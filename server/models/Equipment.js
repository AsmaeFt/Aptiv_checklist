const mongoose = require("mongoose");
const { Schema } = mongoose;

const PointSchema = new Schema({
  Description: {
    type: String,
    required: true,
  },
  Num: {
    type: Number,
    required: true,
  },
  Position: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
});
const EquipementSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  ref: { type: String, required: true },
  Pic: {
    type: String,
    required: true,
  },
  Points: { type: [PointSchema] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Equipment = mongoose.model("Equipment", EquipementSchema);
module.exports = Equipment;
