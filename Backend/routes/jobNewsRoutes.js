const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup storage for images
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

// In-memory "DB" example (replace with MongoDB in production)
let jobNewsDB = [];

// GET all
router.get("/", (req, res) => {
  res.json(jobNewsDB);
});

// POST new job/news with multiple images
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

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  jobNewsDB = jobNewsDB.filter((item) => item._id !== id);
  res.json({ success: true });
});

module.exports = router;
