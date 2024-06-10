const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

// Middleware to check if the user is a root
exports.isRoot = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "root") {
      return res.status(403).json({ error: "Access denied !!!" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to check if the user is a supervisor
exports.isSupervisor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "supervisor") {
      return res.status(403).json({ error: "Access denied !!!" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
