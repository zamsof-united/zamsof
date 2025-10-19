const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const JobNews = require("../Models/JobNews");

const router = express.Router();

// ======================
// Multer setup
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/jobnews";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ======================
// Helper: Upload to Cloudinary
// ======================
const uploadToCloudinary = async (filePath) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "zamsof/jobnews",
    });
    fs.unlinkSync(filePath);
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    fs.unlinkSync(filePath);
    return null;
  }
};

// ======================
// GET All JobNews
// ======================
router.get("/", async (req, res) => {
  try {
    const jobnews = await JobNews.find().sort({ createdAt: -1 });
    res.json(jobnews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch Job & News" });
  }
});

// ======================
// POST (Create)
// ======================
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { type, title, description, location, deadline, startDate, contract, qualifications, responsibilities, link } = req.body;

    const imageUrls = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path);
      if (url) imageUrls.push(url);
    }

    const newItem = new JobNews({
      type,
      title,
      description,
      location,
      deadline,
      startDate,
      contract,
      qualifications,
      responsibilities,
      link,
      images: imageUrls,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Error creating JobNews:", err);
    res.status(500).json({ message: "Error creating Job/News" });
  }
});

// ======================
// PUT (Update)
// ======================
router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    const existing = await JobNews.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Item not found" });

    const imageUrls = existing.images || [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file.path);
      if (url) imageUrls.push(url);
    }

    const updated = await JobNews.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: imageUrls },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating JobNews:", err);
    res.status(500).json({ message: "Error updating item" });
  }
});

// ======================
// DELETE
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await JobNews.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting JobNews:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
});

module.exports = router;
