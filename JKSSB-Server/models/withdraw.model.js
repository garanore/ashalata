const mongoose = require("mongoose");

const WithdrawalSchema = new mongoose.Schema(
  {
    savingID: { type: String, required: true },
    memberID: { type: String, required: true },
    SavingName: { type: String, required: true },
    fathername: { type: String, required: true },
    SavingBranch: { type: String, required: true },
    SavingCenter: { type: String, required: true },
    SavingMobile: { type: String, required: true },
    SavingType: { type: String, required: true },
    SavingTime: { type: String },
    SavingCurrentBlance: { type: [Number], required: true },
    withdrawDate: { type: [String], required: true },
    totalSavingAmount: { type: [Number], required: true },
    withDrawAmount: { type: [Number], required: true },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", WithdrawalSchema);

module.exports = Withdrawal;
