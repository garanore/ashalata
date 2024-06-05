// OpenBranch.model.js
const mongoose = require("mongoose");
const openBranchSchema = new mongoose.Schema(
  {
    BranchID: { type: String, unique: true },
    BranchName: { type: String, required: true },
    BranchAddress: { type: String, required: true },
    BranchMobile: { type: String },
  },
  { timestamps: true }
);

const OpenBranch = mongoose.model("OpenBranch", openBranchSchema);

module.exports = OpenBranch;
