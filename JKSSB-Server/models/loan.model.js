const mongoose = require("mongoose");

// Define a schema for the date document
const dateSchema = new mongoose.Schema({
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

  selectedDate: {
    type: String,
    required: true,
  },
  nextDates: {
    type: [String], // Assuming nextDates is an array of strings
    required: true,
  },
});

// Create a model using the schema
const Loan = mongoose.model("Loan", dateSchema);

module.exports = Loan;
