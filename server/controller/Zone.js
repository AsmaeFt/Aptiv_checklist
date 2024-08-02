const Zone = require("../models/Zone");
const User = require("../models/Users");

// create
exports.Create = async (req, res) => {
  const { userName, Project, Family, Post } = req.body;
  try {
    const ExistUser = await User.findOne({ userName });
    if(!ExistUser){return res.status(404).json("Technician doesn't exist!")}
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// create

// delete
exports.Delete = async (req, res) => {};
// delete

// update
exports.Update = async (req, res) => {};
// update
