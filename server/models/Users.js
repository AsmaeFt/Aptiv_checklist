const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true,unique: true },
  passWord: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["operator", "technicien", "supervisor","root"],
  },
  createdAt: { type: Date, default: Date.now },
  updateddAt: { type: Date, default: Date.now },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
