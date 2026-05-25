const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Task Register
app.use("/api/tasks", taskRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });
