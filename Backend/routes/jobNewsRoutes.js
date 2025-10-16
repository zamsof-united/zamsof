const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================
// Multer storage for images
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
// In-memory DB
// ======================
let jobNewsDB = [];

// ======================
// GET all job/news
// ======================
router.get("/", (req, res) => {
  res.json(jobNewsDB);
});

// ======================
// POST new job/news
// ======================
router.post("/", upload.array("images"), (req, res) => {
  const {
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
  } = req.body;

  const images = req.files ? req.files.map((file) => "/" + file.path) : [];

  const newItem = {
    _id: Date.now().toString(),
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
    images,
  };

  jobNewsDB.unshift(newItem);
  res.json(newItem);
});

// ======================
// PUT /:id - Edit existing job/news
// ======================
router.put("/:id", upload.array("images"), (req, res) => {
  const { id } = req.params;
  const index = jobNewsDB.findIndex((item) => item._id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const {
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
  } = req.body;

  // Update the item
  jobNewsDB[index] = {
    ...jobNewsDB[index],
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
    images: req.files.length
      ? req.files.map((file) => "/" + file.path)
      : jobNewsDB[index].images, // keep old images if none uploaded
  };

  res.json(jobNewsDB[index]);
});

// ======================
// DELETE job/news
// ======================
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  jobNewsDB = jobNewsDB.filter((item) => item._id !== id);
  res.json({ success: true });
});

module.exports = router;
