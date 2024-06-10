const mongoose = require("mongoose");
const { Schema } = mongoose;

const CheckListSchema = new Schema({
  operatorID: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  equipmentID: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  date: { type: Date, required: true },
  shift: { type: String, required: true },
  points: [
    {
      Num: { type: Number, required: true },
      Description: { type: String, required: true },
      status: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CheckList = mongoose.model("CheckList", CheckListSchema);
module.exports = CheckList;
