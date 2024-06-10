const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  Description: {
    type: String,
    required: true,
  },
  Num: {
    type: Number,
    required: true,
  },
});

const equip = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Points: { type: [PointSchema] },
});

const Equipe = mongoose.model("ListEquip", equip);
module.exports = Equipe;

