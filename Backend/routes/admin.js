const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const JobNews = require("../Models/JobNews");
const auth = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// -------- Verify password & generate JWT --------
router.post("/verify-password", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: "Password required" });

  const isMatch = password === process.env.ADMIN_PASSWORD; // simple check, can hash later
  if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
});

// -------- Job/News CRUD --------

// Get all Job/News
router.get("/jobnews", auth, async (req, res) => {
  try {
    const items = await JobNews.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create Job/News
router.post("/jobnews", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, type, description, imageUrl } = req.body;
    let image = null;

    if (req.file) image = "/uploads/" + req.file.filename;
    else if (imageUrl) image = imageUrl;

    const newItem = new JobNews({ title, type, description, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add Job/News" });
  }
});

// Delete Job/News
router.delete("/jobnews/:id", auth, async (req, res) => {
  try {
    await JobNews.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
