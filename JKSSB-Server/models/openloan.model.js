// openloan.model.js
const mongoose = require("mongoose");
const openLoanSchema = new mongoose.Schema(
  {
    nid: { type: Number, required: true },
    loanID: { type: String, required: true, unique: true },
    memberName: { type: String, required: true },
    husbandName: { type: String, required: true },
    branchName: { type: String, required: true },
    centerName: { type: String, required: true },
    mobile: { type: String, required: true },
    loanType: { type: String, required: true },
    amount: { type: Number, required: true },
    total: { type: Number, required: true },
    mobileNumber: { type: String },
  },
  { timestamps: true }
);

const OpenLoan = mongoose.model("OpenLoan", openLoanSchema);

module.exports = OpenLoan;
