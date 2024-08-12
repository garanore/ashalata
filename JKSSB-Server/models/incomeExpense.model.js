const mongoose = require("mongoose");

const incomeExpenseSchema = new mongoose.Schema(
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

const IncomeExpense = mongoose.model("IncomeExpense", incomeExpenseSchema);

module.exports = IncomeExpense;
