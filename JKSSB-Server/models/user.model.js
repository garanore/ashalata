const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    accountName: { type: String, required: true }, // Add this line
    workerID: { type: String, required: true }, // Add this line
    phoneNumber: { type: String, required: true, unique: true }, // Ensure uniqueness,
    email: { type: String, required: true, unique: true }, // Ensure uniqueness,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, required: true },
    UserBranch: { type: [String], required: true },
    UserCenter: { type: [String], required: true },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Granted", "Needs Correction"],
      default: "Pending",
    },
    ActiveStatus: {
      type: String,
      enum: ["True", "False"],
      default: "True",
    },
    submittedBy: { type: String, required: true },
    GrantedBy: { type: String, default: "Null", required: true },
    DeletedBy: { type: String, default: "Null", required: true },
    DeleteDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
