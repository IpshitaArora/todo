const express = require("express");
const Todo = require("../models/todoModel");
const { roleCheck } = require("../middleware/role");
const { auth, authorizeRoles } = require("../middleware/auth");
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
    try {
        const todo = await Todo.findOne({ _id: req.params.id }); // ✅ FIXED

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" }); // ✅ Better error code
        }

        if (todo.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(todo, req.body);
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Delete Todo (Only Admin)
router.delete("/:id", auth, roleCheck(["admin"]), async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        await todo.deleteOne();  // or use findByIdAndDelete(req.params.id) if you prefer
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;