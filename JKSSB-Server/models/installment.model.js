// installment.model.js
const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema(
  {
    center: { type: String, required: true },
    memberName: { type: String, required: true },
    mobile: { type: String, required: true },
    loanType: { type: String, required: true },
    amount: { type: Number, required: true },
    week: { type: Number, required: true },
  },
  { timestamps: true }
);

const Installment = mongoose.model("Installment", installmentSchema);

module.exports = Installment;
