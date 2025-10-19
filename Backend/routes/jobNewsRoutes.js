const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const JobNews = require("../Models/JobNews");

// -------------------------
// Cloudinary Config
// -------------------------
cloudinary.config({
  cloud_name: "dz6hvxpoz",
  api_key: "359448792782743",
  api_secret: "qNVvXvhAY_RIpB6uLpmMCggKqgU",
});

// -------------------------
// Multer with Cloudinary
// -------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zamsof/jobnews",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// -------------------------
// GET all Job/News
// -------------------------
router.get("/", async (req, res) => {
  try {
    const items = await JobNews.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /jobnews error:", err);
    res.status(500).json({ message: "Failed to fetch job/news items" });
  }
});

// -------------------------
// POST new Job/News
// -------------------------
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const data = req.body;

    if (req.files?.length) {
      data.images = req.files.map((file) => file.path);
    }

    const newItem = new JobNews(data);
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("POST /jobnews error:", err);
    res.status(500).json({ message: "Failed to add Job/News", error: err.message });
  }
});

// -------------------------
// PUT update Job/News
// -------------------------
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid or missing ID" });
    }

    const existingItem = await JobNews.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const data = req.body;

    // Merge images if new ones are uploaded
    if (req.files?.length) {
      data.images = [
        ...(existingItem.images || []),
        ...req.files.map((file) => file.path),
      ];
    } else {
      data.images = existingItem.images;
    }

    const updatedItem = await JobNews.findByIdAndUpdate(id, data, { new: true });
    res.json(updatedItem);
  } catch (err) {
    console.error("PUT /jobnews/:id error:", err);
    res.status(500).json({ message: "Failed to update Job/News", error: err.message });
  }
});

// -------------------------
// DELETE Job/News
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await JobNews.findById(id);

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    await JobNews.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE /jobnews/:id error:", err);
    res.status(500).json({ message: "Failed to delete Job/News", error: err.message });
  }
});

module.exports = router;
