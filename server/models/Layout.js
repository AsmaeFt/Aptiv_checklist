const mongoose = require("mongoose");
const { Schema } = mongoose;

const LayoutSchema = new Schema({
  project: { type: String, required: true },
  family: { type: String, required: true },
  post: { type: String, required: true },
  Equipement: [{ type: String }]
});

const Layout = mongoose.model("Layout", LayoutSchema);
module.exports = Layout;
