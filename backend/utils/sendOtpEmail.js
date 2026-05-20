const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `"StudySync" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your StudySync account",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}

module.exports = sendOtpEmail;