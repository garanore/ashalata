const mongoose = require("mongoose");

const DebitSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true, unique: true },
    sellCost: [{ type: Number }],
    comment: [{ type: String }],
    date: [{ type: String }],
    branch: { type: String, required: true },
  },
  { timestamps: true }
);

const debit = mongoose.model("debit", DebitSchema);

module.exports = debit;
