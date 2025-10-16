const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db"); // your MongoDB connection function
const bcrypt = require("bcrypt"); // optional here, we will use plain password
const jwt = require("jsonwebtoken");

// -------------------------
// Routes
// -------------------------
const contactRoute = require("./routes/contactRoutes");
const donationRoute = require("./routes/donationRoutes");
const volunteerRoute = require("./routes/volunteerRoutes");
const partnerRoute = require("./routes/partnerRoutes");
const joinUsRoute = require("./routes/joinUsRoutes");
const jobNewsRoute = require("./routes/jobNewsRoutes");

const app = express();
const PORT = 5000;

// -------------------------
// Hardcoded Admin Credentials
// -------------------------
const ADMIN_PASSWORD = "admin123";  // fixed password
const JWT_SECRET = "mysecret123";   // JWT secret

// -------------------------
// CORS Configuration
// -------------------------
const allowedOrigins = [
  "http://localhost:5173",   // local frontend
  "https://zamsof.org",      // production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked request from:", origin);
      callback(new Error("Not allowed by CORS"));
    }
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
// Admin Login Route
// -------------------------
app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Password required" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "1d" });

  res.json({ success: true, token });
});

// -------------------------
// Root Route
// -------------------------
app.get("/", (req, res) => res.send("Backend is working!"));

// -------------------------
// Connect to MongoDB & Start Server
// -------------------------
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
