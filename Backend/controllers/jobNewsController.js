// controllers/jobNewsController.js
const JobNews = require("../Models/JobNews");

// Create Job/News
exports.createJobNews = async (req, res) => {
  try {
    const { title, type, description, imageUrl } = req.body;
    let imagePath = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const newItem = await JobNews.create({ title, type, description, image: imagePath });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Job/News" });
  }
};

// Get all Job/News
exports.getJobNews = async (req, res) => {
  try {
    const items = await JobNews.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Job/News" });
  }
};

// Delete Job/News
exports.deleteJobNews = async (req, res) => {
  try {
    await JobNews.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete Job/News" });
  }
};
