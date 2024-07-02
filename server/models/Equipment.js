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
    },
    y: {
      type: Number,
    },
  },
});

const EquipementSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Points: { type: [PointSchema] },
  ref: { type: String },
  Pic: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Equipment = mongoose.model("Equipment", EquipementSchema);
module.exports = Equipment;
