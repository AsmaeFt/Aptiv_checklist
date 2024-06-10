const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create new user
exports.createUser = async (req, res) => {
  const { userName, password, role } = req.body;

  if (!["operator", "technician", "supervisor"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const existUser = await User.findOne({ userName });
    if (existUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      passWord: hashpassword,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTech = async (req, res) => {
  const { userName, password, role } = req.body;
  if (!["technician"].includes(role)) {
    return res.status(400).json({ error: "Invalid role for supervisor" });
  }
  try {
    const existUser = await User.findOne({ userName });
    if (existUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      passWord: hashpassword,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log user in
exports.login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.passWord);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
