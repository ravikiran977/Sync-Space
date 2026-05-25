const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = new Project({
      name: name.trim(),
      description: description?.trim() || "",
      createdBy: req.user.id,
    });

    await project.save();

    const populatedProject = await Project.findById(project._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const projects = await Project.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json(projects);
    }

    const projectIds = await Task.distinct("project", { assignedTo: req.user.id });
    const projects = await Project.find({ _id: { $in: projectIds } })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
