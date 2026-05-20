const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// TEMP OTP STORE
const otpStore = new Map();

// MAIL TRANSPORT
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
});
/////////////////////////////////////////////////////
// REGISTER
/////////////////////////////////////////////////////

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Invalid input" });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const otp = crypto.randomInt(100000, 999999).toString();

      otpStore.set(email, {
        name,
        email,
        password,
        otp,
        expires: Date.now() + 5 * 60 * 1000,
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "StudySync OTP Verification",
          html: `<h2>Your OTP is ${otp}</h2>`,
        });
      } catch (mailErr) {
        console.error("Email failed:", mailErr);
        return res.status(500).json({ msg: "Email service failed" });
      }

      res.json({
        requiresOtp: true,
        email,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

/////////////////////////////////////////////////////
// LOGIN
/////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/////////////////////////////////////////////////////
// GOOGLE LOGIN
/////////////////////////////////////////////////////

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const otp = crypto.randomInt(100000, 999999).toString();

      otpStore.set(email, {
        name,
        email,
        password: "google-oauth",
        otp,
        expires: Date.now() + 5 * 60 * 1000,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "StudySync OTP Verification",
        html: `<h2>Your OTP is ${otp}</h2>`,
      });

      return res.json({
        requiresOtp: true,
        email,
      });
    }

    const jwtToken = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Google login failed" });
  }
});

/////////////////////////////////////////////////////
// VERIFY OTP
/////////////////////////////////////////////////////

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore.get(email);

  if (!data) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  if (Date.now() > data.expires) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = new User({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    isVerified: true,
  });

  await user.save();

  otpStore.delete(email);

  const token = jwt.sign(
    { user: { id: user._id } },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user,
  });
});

/////////////////////////////////////////////////////

module.exports = router;