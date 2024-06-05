const mongoose = require("mongoose");

const InstallmentCollectionSchema = new mongoose.Schema(
  {
    loanID: { type: String, required: true },
    memberID: { type: String, required: true },
    OLname: { type: String, required: true },
    OLmobile: { type: String, required: true },
    loanType: { type: String, required: true },
    installment: { type: Number, required: true },
    centerName: { type: String, required: true },
    installmentDate: { type: [String], required: true }, // Array of strings
    // Add other fields as necessary
  },
  { timestamps: true }
); // Add timestamps option here

const InstallmentCollection = mongoose.model(
  "InstallmentCollection",
  InstallmentCollectionSchema
);

module.exports = InstallmentCollection;
