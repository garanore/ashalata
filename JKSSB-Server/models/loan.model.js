const mongoose = require("mongoose");

// Define a schema for the date document
const dateSchema = new mongoose.Schema(
  {
    loanID: { type: String, unique: true },
    memberID: { type: String },
    OLname: { type: String },
    fathername: { type: String },
    OLbranch: { type: String },
    OLcenter: { type: String },
    OLmobile: { type: String },
    loanType: { type: String },
    OLamount: { type: Number, required: true },
    OLtotal: { type: Number, required: true },
    installment: { type: Number },
    withoutInterst: { type: Number },
    onlyInterest: { type: Number },
    CenterDay: { type: String },
    totalInstallment: { type: String },

    installmentStart: {
      type: String,
      required: true,
    },
    nextDates: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Loan = mongoose.model("Loan", dateSchema);

module.exports = Loan;
