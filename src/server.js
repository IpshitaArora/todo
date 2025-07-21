require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
// const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// console.log("authRoutes:", authRoutes);
// console.log("todoRoutes:", todoRoutes);
// console.log("userRoutes:", userRoutes);
// console.log("errorHandler:", errorHandler);


// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
// app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
