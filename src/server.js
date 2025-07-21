require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
connectDB();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
