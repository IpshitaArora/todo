const express = require("express");
const Todo = require("../models/todoModel");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/role");
const router = express.Router();

// Create Todo (any logged-in user)
router.post("/", auth, async (req, res) => {
    try {
        const todo = new Todo({ ...req.body, user: req.user._id });
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Todos (Admin only)
router.get("/", auth, roleCheck(["admin"]), async (req, res) => {
    const todos = await Todo.find().populate("user", "username");
    res.json(todos);
});

// Get user-specific Todos
router.get("/my", auth, async (req, res) => {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
});

// Update Todo (Only owner or Admin)
router.put("/:id", auth, async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo && req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    Object.assign(todo, req.body);
    await todo.save();
    res.json(todo);
});

// Delete Todo (Only Admin)
router.delete("/:id", auth, roleCheck(["admin"]), async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
});

module.exports = router;