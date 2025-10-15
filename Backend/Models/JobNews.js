const mongoose = require("mongoose");

const jobNewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["job", "news"], required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, // file path or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobNews", jobNewsSchema);
