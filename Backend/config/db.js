const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://rhmain0987_db_user:vwo60p7S0Bz6NR7X@cluster0.w5euppw.mongodb.net/zamsofDB?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
