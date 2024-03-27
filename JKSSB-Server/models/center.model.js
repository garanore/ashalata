// OpenCenter.model.js
const mongoose = require("mongoose");
const openCenterSchema = new mongoose.Schema(
  {
    centerID: { type: String, unique: true },
    CenterName: { type: String, required: true },
    centerBranch: { type: String },
    CenterAddress: { type: String, required: true },
    CenterMnumber: { type: String, required: true },
    centerWorker: { type: String },
    CenterDay: { type: String },
  },
  { timestamps: true }
);

const OpenCenter = mongoose.model("OpenCenter", openCenterSchema);

module.exports = OpenCenter;
