const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check role
const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add Admin
router.post("/admin/add", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || role !== "admin") {
    return res
      .status(400)
      .json({ message: "All fields are required and role must be admin" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();
    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add Admin (Superadmin only)
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin") {
        return res.status(400).json({ message: "User is already an admin" });
      }

      user.role = "admin";
      await user.save();
      res.json({
        message: "User promoted to admin",
        user: { id: user._id, email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create Superadmin (One-time setup)
router.post("/setup-superadmin", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingSuperadmin = await User.findOne({ role: "superadmin" });
    if (existingSuperadmin) {
      return res.status(400).json({ message: "Superadmin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superadmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
    });
    await superadmin.save();

    res.status(201).json({ message: "Superadmin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Admin Dashboard Route
router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard" });
  }
);

module.exports = router;
