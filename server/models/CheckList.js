const mongoose = require("mongoose");
const { Schema } = mongoose;

const OperatorSchema = new Schema({
  OperatorID: { type: String },
  points: [
    {
      Num: { type: Number, required: true },
      status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["Aproved", "pending"],
      },
    },
  ],
});
const technicienSchema = new Schema({
  technicienID: { type: Schema.Types.ObjectId, ref: "Users" },
  name: { type: String },
  points: [
    {
      Num: { type: Number, required: true },
      status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["Aproved", "pending"],
      },
      Action: { type: String },
      Date_Action: { type: Date },
      Date_Prevu: { type: Date },
    },
  ],
});

const CheckListSchema = new Schema({
  OperatorID: { type: String },
  equipmentID: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  shift: { type: String, required: true },
  project: { type: String, required: true },
  family: { type: String, required: true },
  post: { type: String, require: true },
  ref: { type: String, required: true },
  points: [
    {
      Num: { type: Number, required: true },
      Description: { type: String, required: true },
      status: { type: String, required: true },
      observation: { type: String },
    },
  ],
  flag: { type: String },

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
