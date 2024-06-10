const mongoose = require("mongoose");
const { Schema } = mongoose;

const OperatorSchema = new Schema({
  OperatorID: { type: String },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["Aproved", "pending"],
  },
});

const technicienSchema = new Schema({
  technicienID: { type: Schema.Types.ObjectId, ref: "Users" },
  comments: { type: String },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["Aproved", "pending"],
  },
});

const CheckListSchema = new Schema({
  OperatorID: { type: String },
  equipmentID: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  date: { type: Date, required: true },
  shift: { type: String, required: true },
  project: { type: String, required: true },
  family: { type: String, required: true },
  ref: { type: String, required: true },
  points: [
    {
      Num: { type: Number, required: true },
      Description: { type: String, required: true },
      status: { type: String, required: true },
    },
  ],
  technicienDecision: {
    type: [technicienSchema],
  },
  OperatornDecision: {
    type: [OperatorSchema],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CheckList = mongoose.model("CheckList", CheckListSchema);
module.exports = CheckList;
