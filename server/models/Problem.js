const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({

  pointDescription: { type: String, required: true },
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["reviewed", "resolved", "pending"],
  },
  technicienID: { type: Schema.Types.ObjectId, ref: "Users" },
  operatorID: { type: Schema.Types.ObjectId, ref: "Users" },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
