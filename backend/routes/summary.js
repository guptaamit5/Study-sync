const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Summary = require("../models/Summary");

// CREATE SUMMARY
router.post("/", auth, async (req, res) => {
  const { content, title } = req.body;

  if (!content || !title) {
    return res.status(400).json({ error: "Content and title required" });
  }

  try {
    // MOCK AI SUMMARY
    const summaryText =
      "AI Summary:\n\n" + content.slice(0, 200) + "...";

    const summary = new Summary({
      user: req.user.id,
      title,
      content: summaryText,
    });

    await summary.save();

    res.json({ summary: summaryText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summary failed" });
  }
});

module.exports = router;
