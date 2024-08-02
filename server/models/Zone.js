const mongoose = require("mongoose");
const { Schema } = mongoose;

const Zone = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: "Users" },
  Project: { type: String },
  Family: { type: String },
  Post: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
