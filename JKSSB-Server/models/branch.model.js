// OpenBranch.model.js
const mongoose = require("mongoose");
const openBranchSchema = new mongoose.Schema(
  {
    BranchID: { type: String, unique: true },
    BranchName: { type: String, required: true },
    BranchAddress: { type: String, required: true },
    BranchMobile: { type: String },
    ActiveStatus: {
      type: String,
      enum: ["True", "False"],
      default: "True",
    },
    submittedBy: { type: String, required: true },
    DeletedBy: { type: String, default: "Null", required: true },
    DeleteDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const OpenBranch = mongoose.model("OpenBranch", openBranchSchema);

module.exports = OpenBranch;
