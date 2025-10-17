const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobNews = require("../Models/JobNews");

// ======================
// Multer storage for image uploads
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/jobnews";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ======================
// GET all job/news
// ======================
router.get("/", async (req, res) => {
  try {
    const items = await JobNews.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job/news items" });
  }
});

// ======================
// POST new job/news
// ======================
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => "/" + file.path) : [];
    const newItem = new JobNews({
      ...req.body,
      images,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add job/news" });
  }
});

// ======================
// PUT /:id - Edit existing job/news
// ======================
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await JobNews.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const images = req.files.length
      ? req.files.map((file) => "/" + file.path)
      : existingItem.images;

    const updated = await JobNews.findByIdAndUpdate(
      id,
      { ...req.body, images },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job/news" });
  }
});

// ======================
// DELETE job/news
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await JobNews.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job/news" });
  }
});

module.exports = router;
