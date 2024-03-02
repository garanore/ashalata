// OpenCenter.model.js
const mongoose = require("mongoose");
const openCenterSchema = new mongoose.Schema(
  {
    centerID: { type: String, unique: true },
    CenterName: { type: String, required: true },
    AddressCenter: { type: String, required: true },
    CenterMnumber: { type: String, required: true },
    centerWorker: { type: String },
    centerBranch: { type: String },
  },
  { timestamps: true }
);

const OpenCenter = mongoose.model("OpenCenter", openCenterSchema);

module.exports = OpenCenter;
