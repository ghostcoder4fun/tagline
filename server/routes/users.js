const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Joi = require("joi");
const User = require("../models/users");
const authMiddleware = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = express.Router();

// Middleware (if this is your main file, ensure app.use(cors()) and app.use(cookieParser()) are set)
router.use(cookieParser());

// If frontend is on a different domain, enable CORS with credentials
router.use(
  cors({
    origin: "https://tagline-production.up.railway.app/", // replace with your frontend URL in production
    credentials: true,
  })
);

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max attempts
  message: "Too many login attempts. Try again later.",
});

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// REGISTER
router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE USER (protected)
router.put("/update", authMiddleware, async (req, res) => {
  const { username, email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        balance: user.balance,
        tasksCompleted: user.tasksCompleted.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          balance: user.balance,
          tasksCompleted: user.tasksCompleted.length,
        },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Refresh token required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Update cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// GET CURRENT USER (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      balance: user.balance,
      tasksCompleted: user.tasksCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
