const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Note = require("../models/Note");
const Todo = require("../models/Todo");
const Summary = require("../models/Summary");

router.get("/stats", auth, async (req, res) => {
  try {
    // 🔥 today 00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notesCount = await Note.countDocuments({
      user: req.user.id,
    });

    const pendingTodos = await Todo.countDocuments({
      user: req.user.id,
      completed: false,
    });

    const summariesToday = await Summary.countDocuments({
      user: req.user.id,
      createdAt: { $gte: today },
    });

    res.json({
      notes: notesCount,
      todos: pendingTodos,
      summariesToday, // 👈 DAILY RESET COUNT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard stats failed" });
  }
});

module.exports = router;
