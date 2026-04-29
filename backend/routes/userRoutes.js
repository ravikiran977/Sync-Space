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
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser
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
    const users = await User.find();
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==============================
// GET USER BY ID
// GET /api/users/:id
// ==============================
router.get("/:id", validateObjectId, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
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

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }

    Object.assign(user, req.body);

    await user.save(); // ensures password hashing works

    res.status(200).json({
      message: "User Updated Successfully",
      user: user
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
        message: "User Not Found"
      });
    }

    res.status(200).json({
      message: "User Deleted Successfully",
      user: deletedUser
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
        message: "Invalid email or password"
      });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// forgot password route

router.post("/forgot-password", async (req, res) => {
  try {
    const {email} =req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found"
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");    //generate random token

    user.resetPasswordToken =resetToken;  //save token in Db and set expire time
    user.resetPasswordExpire = Date.now() + 15*60*1000; //15 minutes

    await user.save();

    res.status(200).json({
      message: "Password reset token generated",
      resetToken
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
      resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


module.exports = router;