const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
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

router.post("/:projectId/users", authMiddleware,  authorizeRoles("admin"), async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userIds } = req.body;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid project id" });
      }

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "Please provide userIds as a non-empty array" });
      }

      const hasInvalidUserId = userIds.some((userId) => !mongoose.Types.ObjectId.isValid(userId));

      if (hasInvalidUserId) {
        return res.status(400).json({ message: "One or more user ids are invalid" });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const updateResult = await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { projects: project._id } }
      );

      const invitedUsers = await User.find({ _id: { $in: userIds } })
        .select("name email role projects")
        .populate("projects", "name description");

      res.status(200).json({
        message: "Users invited to project successfully",
        project,
        matchedUsers: updateResult.matchedCount,
        updatedUsers: updateResult.modifiedCount,
        users: invitedUsers,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
