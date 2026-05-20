const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const OpenAI = require("openai").default;

const upload = multer();

router.post("/", auth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file required" });
    }

    // 🔥 Create instance INSIDE route
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: await OpenAI.toFile(req.file.buffer, "audio.webm"),
      model: "whisper-1",
    });

    const text = transcription.text;

    const newNote = new Note({
      user: req.user.id,
      title: "Voice Note",
      content: text,
      tags: ["voice"],
    });

    await newNote.save();

    res.json({ text });

  } catch (err) {
    console.error("VOICE ERROR:", err);
    res.status(500).json({ error: "Voice transcription failed" });
  }
});

module.exports = router;