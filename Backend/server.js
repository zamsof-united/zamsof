const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const { checkStripeConnection } = require("./config/stripe"); // Import Stripe checker
const contactRoute = require("./routes/contactRoutes");
const donationRoute = require('./routes/donationRoutes');
const volunteerRoute = require("./routes/volunteerRoutes");
const partnerRoute = require("./routes/partnerRoutes");
const joinUsRoute = require("./routes/joinUsRoutes");
const stripeRoute = require("./stripe");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: "https://zamsof.org",
    methods: "GET, POST, PUT, DELETE",
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various versions of Android) choke on 204
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/contact", contactRoute);
app.use("/api/donation", donationRoute);
app.use("/api/volunteer", volunteerRoute);
app.use("/api/partner", partnerRoute);
app.use("/api/joinus", joinUsRoute);
app.use("/api/stripe", stripeRoute);

const hashedPassword = bcrypt.hashSync("X4@pL#9mWz!kQ8vY", 10);
 app.post("/api/verify-password", (req, res) => {
   const { password } = req.body;

   if (bcrypt.compareSync(password, hashedPassword)) {
     res.json({ success: true });
   } else {
     res.json({ success: false });
   }
 });

// Root Route
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

app.post("/", (req, res) => {
    console.log(req.body);
    res.send("Data received");
})

// Test Stripe Connection
checkStripeConnection();

// Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
