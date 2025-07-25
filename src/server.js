const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");


const path = require("path");
const dotenv = require("dotenv");
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;


// DB Connection
// connectDB(); // Remove this line

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on ${PORT}`)); // Remove this line


const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to DB. Server not started.");
        console.error(err.message);
        process.exit(1); // Exit the process with failure
    }
};

startServer();