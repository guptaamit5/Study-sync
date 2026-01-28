const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Todo = require("../models/Todo");

// CREATE TODO
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = new Todo({
      user: req.user.id,
      title: title.trim(),
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET TODOS
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE TODO
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.deleteOne();
    res.json({ message: "Todo deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
