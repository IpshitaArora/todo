require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;


// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
