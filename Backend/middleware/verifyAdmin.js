const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
    if (decoded.role !== "admin") throw new Error("Not an admin");
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

module.exports = verifyAdmin;
