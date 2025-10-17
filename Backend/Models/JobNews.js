const mongoose = require("mongoose");

const jobNewsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["job", "news"], required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    deadline: { type: String },
    startDate: { type: String },
    contract: { type: String },
    qualifications: { type: String },
    responsibilities: { type: String },
    link: { type: String },
    images: [String], // array of image URLs or file paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobNews", jobNewsSchema);
