const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Summary = require("../models/Summary");

router.post("/", auth, async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content || !title) {
      return res.status(400).json({ error: "Content and title required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following clearly and professionally:\n\n${content}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error(data);
      return res.status(500).json({ error: "AI failed" });
    }

    const summaryText =
      data.candidates[0].content.parts[0].text;

    const summary = new Summary({
      user: req.user.id,
      title,
      content: summaryText,
    });

    await summary.save();

    res.json({ summary: summaryText });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "AI Summary failed" });
  }
});

module.exports = router;