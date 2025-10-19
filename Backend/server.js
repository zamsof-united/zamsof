const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2;

// -------------------------
// Import Routes
// -------------------------
const contactRoute = require("./routes/contactRoutes");
const donationRoute = require("./routes/donationRoutes");
const volunteerRoute = require("./routes/volunteerRoutes");
const partnerRoute = require("./routes/partnerRoutes");
const joinUsRoute = require("./routes/joinUsRoutes");
const jobNewsRoute = require("./routes/jobNewsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------
// Admin Credentials
// -------------------------
const ADMIN_PASSWORD = "admin123";
const JWT_SECRET = "mysecret123";

// -------------------------
// Cloudinary Configuration
// -------------------------
cloudinary.config({
  cloud_name: "dk5yadswa",        // Replace with your Cloudinary cloud name
  api_key: "351985154945531",     // Replace with your Cloudinary API key
  api_secret: "Jqkw711hFhXWUSnGBaVRQqpRtqY", // Replace with your Cloudinary API secret
});
console.log("✅ Cloudinary configured:", cloudinary.config().cloud_name);

// -------------------------
// CORS Configuration
// -------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://zamsof.org",
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// -------------------------
// Middleware
// -------------------------
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// API Routes
// -------------------------
app.use("/api/contact", contactRoute);
app.use("/api/donation", donationRoute);
app.use("/api/volunteer", volunteerRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/joinus", joinUsRoute);
app.use("/api/jobnews", jobNewsRoute);

// -------------------------
// Admin Login
// -------------------------
app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: "Password required" });

  if (password !== ADMIN_PASSWORD) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
});

// -------------------------
// Root Route
// -------------------------
app.get("/", (req, res) => res.json({ message: "✅ Backend is working perfectly!" }));

// -------------------------
// Catch-all for unknown API routes (always JSON)
// -------------------------
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// -------------------------
// Global Error Handler (always JSON)
// -------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message || err);
  res.status(500).json({ message: "Internal server error", error: err.message || err });
});

// -------------------------
// Connect MongoDB & Start Server
// -------------------------
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
