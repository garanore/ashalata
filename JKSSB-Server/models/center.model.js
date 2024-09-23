const mongoose = require("mongoose");

const openCenterSchema = new mongoose.Schema(
  {
    centerID: { type: String, unique: true },
    CenterName: { type: String, required: true },
    centerBranch: { type: String },
    CenterAddress: { type: String, required: true },
    CenterMnumber: { type: String, required: true },
    CenterDay: { type: String },
    approvalStatus: {
      type: String,
      enum: ["Approved", "Needs Correction", "Granted"],
      default: "Approved",
    },
    ActiveStatus: {
      type: String,
      enum: ["True", "False"],
      default: "True",
    },
    submittedBy: { type: String, required: true },
    GrantedBy: { type: String, default: "Null", required: true },
    DeletedStatus: { type: String, default: "Null", required: true },
    DeleteDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const OpenCenter = mongoose.model("OpenCenter", openCenterSchema);

module.exports = OpenCenter;
