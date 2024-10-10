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
    macroloan: { type: Number, required: true },
    fromFee: { type: Number, required: true },
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
const Loan = mongoose.model("Loan", dateSchema);

module.exports = Loan;
