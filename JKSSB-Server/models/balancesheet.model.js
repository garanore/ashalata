const mongoose = require("mongoose");

const balancesheetSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    productCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true, unique: true },
    month: [{ type: String }],
    currentMonthAmount: [{ type: String }],
    toDateAmount: [{ type: String }],
  },
  { timestamps: true }
);

const IncomeExpense = mongoose.model("BalanceSheet", balancesheetSchema);

module.exports = IncomeExpense;
