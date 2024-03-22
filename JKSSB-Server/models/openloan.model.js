// openloan.model.js
const mongoose = require("mongoose");
const openLoanSchema = new mongoose.Schema(
  {
    memberID: { type: String, required: true },
    loanID: { type: String, required: true, unique: true },
    OLname: { type: String, required: true },
    fathername: { type: String, required: true },
    OLbranch: { type: String },
    OLcenter: { type: String },
    OLmobile: { type: String },
    loanType: { type: String },
    OLamount: { type: Number },
    OLtotal: { type: Number },
  },
  { timestamps: true }
);

const OpenLoan = mongoose.model("OpenLoan", openLoanSchema);

module.exports = OpenLoan;
