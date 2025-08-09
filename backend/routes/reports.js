const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Report = require("../models/report");
const router = express.Router();

// Multer configuration for media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|webm/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images and MP4/WebM videos are allowed"));
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or invalid format" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Create Report
router.post("/", authMiddleware, upload.array("media", 2), async (req, res) => {
  const { title, description, type, latitude, longitude } = req.body;

  if (!title || !description || !type || !req.files || req.files.length === 0) {
    return res.status(400).json({
      message:
        "Title, description, type, and at least one media file are required",
    });
  }

  if (!["report", "cleanup"].includes(type)) {
    return res.status(400).json({ message: "Invalid report type" });
  }

  if (type === "report" && req.files.length > 1) {
    return res
      .status(400)
      .json({ message: "Report type allows only one media file" });
  }

  try {
    const mediaUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const report = new Report({
      title,
      description,
      type,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      mediaUrls,
      user: req.user.id,
      status: "Reported",
      severity: type === "report" ? "High" : "Not specified",
    });
    await report.save();

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Reports
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "name email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
