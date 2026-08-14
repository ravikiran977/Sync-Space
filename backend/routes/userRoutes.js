const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const authorizeRoles = require("../middleware/authorizeRoles");

// ==============================
// CREATE USER
// POST /api/users
// ==============================
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with this email",
      });
    }

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// GET ALL USERS
// GET /api/users
// ==============================
router.get(
  "/",
  authMiddleware,
    authorizeRoles("admin"), // Only admin can access this route
    async (req, res) => {
      try {
      const filter = {};

      if (req.query.projectId) {
        filter.projects = req.query.projectId;
      }

      if (req.query.role) {
        filter.role = req.query.role;
      }

      const users = await User.find(filter).populate("projects", "name description");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ==============================
// GET USER BY ID
// GET /api/users/:id
// ==============================
router.get("/:id", validateObjectId, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("projects", "name description");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// UPDATE USER BY ID
// PUT /api/users/:id
// ==============================
router.put("/:id", validateObjectId, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const allowedUpdates = ["name", "email", "phone", "department"];
    if (req.user.role === "admin") {
      allowedUpdates.push("role", "projects");
    }

    allowedUpdates.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        user[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    });

    await user.save(); // ensures password hashing works

    const updatedUser = await User.findById(id)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate("projects", "name description");

    res.status(200).json({
      message: "User Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// DELETE USER BY ID
// DELETE /api/users/:id
// ==============================
router.delete("/:id", validateObjectId, authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    res.status(200).json({
      message: "User Deleted Successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// LOGIN USER WITH JWT
// POST /api/users/login
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Entered email:", email);
    console.log("Entered password:", password);

    // 1️⃣ Find user
    const user = await User.findOne({ email }).select("+password"); // explicitly select password field

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// forgot password route

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex"); //generate random token

    user.resetPasswordToken = resetToken; //save token in Db and set expire time
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 minutes

    await user.save();

    res.status(200).json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// reset password route

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// CHANGE PASSWORD
// POST /api/users/:id/change-password
// ==============================
router.post("/:id/change-password", validateObjectId, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Authorization check
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user with password field
    const user = await User.findById(id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different from old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // bcrypt hashing is handled by pre-save hook

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
