const express = require("express");
const Task = require("../models/tasks");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate("completedBy", "email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new task
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const task = new Task({ title });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE task status (mark as completed)
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "Completed";
    task.completedBy = req.user.userId;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
