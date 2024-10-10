const mongoose = require("mongoose");

// Define a schema for the date document
const openSavingSchema = new mongoose.Schema(
  {
    SavingID: { type: String, unique: true },
    memberID: { type: String },
    SavingName: { type: String },
    fathername: { type: String },
    SavingBranch: { type: String },
    SavingCenter: { type: String },
    SavingMobile: { type: String },
    SavingType: { type: String },
    SavingTime: { type: String },
    SavingAmount: { type: Number, required: true },
    CenterDay: { type: String },

    installmentStart: {
      type: String,
      required: true,
    },
    nextDates: {
      type: [String], // Assuming nextDates is an array of strings
    },
    approvalStatus: {
      type: String,
      enum: ["Approved", "Granted", "Needs Correction"],
      default: "Approved",
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

// Create a model using the schema
const OpenSaving = mongoose.model("OpenSaving", openSavingSchema);

module.exports = OpenSaving;
