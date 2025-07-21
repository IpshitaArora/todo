const Todo = require("../models/todoModel");

// Create Todo
exports.createTodo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const todo = new Todo({ title, description, user: req.user._id });
        await todo.save();
        res.status(201).json({ success: true, todo });
    } catch (err) {
        next(err);
    }
};

// Get Todos with pagination & search
exports.getTodos = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, search = "" } = req.query;
        const query = {
            user: req.user.role === "admin" ? { $exists: true } : req.user._id,
            title: { $regex: search, $options: "i" }
        };
        const todos = await Todo.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Todo.countDocuments(query);
        res.json({ total, page, pages: Math.ceil(total / limit), todos });
    } catch (err) {
        next(err);
    }
};

// Update Todo
exports.updateTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
        if (!todo && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed to update this todo" });
        }
        Object.assign(todo, req.body);
        await todo.save();
        res.json(todo);
    } catch (err) {
        next(err);
    }
};

// Delete Todo (Admin or Owner)
exports.deleteTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        if (req.user.role !== "admin" && todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to delete this todo" });
        }
        await todo.remove();
        res.json({ message: "Todo deleted" });
    } catch (err) {
        next(err);
    }
};
