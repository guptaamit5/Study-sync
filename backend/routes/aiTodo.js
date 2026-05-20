const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Todo = require("../models/Todo");

router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content required" });
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
                  text: `Convert the following content into actionable tasks. Return only bullet points:\n\n${content}`,
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

    const aiText = data.candidates[0].content.parts[0].text;

    // Split bullet points into array
    const tasks = aiText
      .split("\n")
      .filter(line => line.trim() !== "");

    // Save each task in DB
    const savedTodos = await Promise.all(
      tasks.map(task =>
        Todo.create({
          user: req.user.id,
          title: task.replace(/^- /, ""),
          completed: false,
        })
      )
    );

    res.json({ message: "Todos generated", todos: savedTodos });

  } catch (err) {
    console.error("AI Todo Error:", err);
    res.status(500).json({ error: "Failed to generate todos" });
  }
});

module.exports = router;