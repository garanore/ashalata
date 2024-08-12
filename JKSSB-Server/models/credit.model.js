const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true, unique: true },
    sellCost: [{ type: Number }],
    comment: [{ type: String }],
    date: [{ type: String }],
    centerBranch: { type: String },
  },
  { timestamps: true }
);

const credit = mongoose.model("credit", CreditSchema);

module.exports = credit;
