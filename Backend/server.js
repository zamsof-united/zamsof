const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const contactRoute = require("./routes/contactRoutes");
const donationRoute = require("./routes/donationRoutes");
const volunteerRoute = require("./routes/volunteerRoutes");
const partnerRoute = require("./routes/partnerRoutes");
const joinUsRoute = require("./routes/joinUsRoutes");
const jobNewsRoute = require("./routes/jobNewsRoutes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------
app.use(cors({ origin: ["http://localhost:5173", "https://zamsof.org"], credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// Routes
// -------------------------
app.use("/api/contact", contactRoute);
app.use("/api/donation", donationRoute);
app.use("/api/volunteer", volunteerRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/joinus", joinUsRoute);
app.use("/api/jobnews", jobNewsRoute);

// -------------------------
// Admin login
// -------------------------
if (!process.env.SET_PASSWORD || !process.env.JWT_SECRET) {
  throw new Error("SET_PASSWORD or JWT_SECRET not defined in .env");
}

const hashedPassword = bcrypt.hashSync(process.env.SET_PASSWORD, 10);

app.post("/api/verify-password", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: "Password required" });

  const isMatch = bcrypt.compareSync(password, hashedPassword);
  if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
});

// -------------------------
// Root
// -------------------------
app.get("/", (req, res) => res.send("Backend is working!"));

// -------------------------
// Connect DB & start server
// -------------------------
connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
