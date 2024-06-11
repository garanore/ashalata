const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkerSalarySchema = new Schema({
  workerID: { type: String, required: true },
  workerName: { type: String, required: true },
  designation: { type: String, required: true },
  month: { type: [String], required: true },
  basic: { type: [Number] }, // Array of numbers
  houseRent: { type: [Number] }, // Array of numbers
  medAllow: { type: [Number] }, // Array of numbers
  transAllow: { type: [Number] }, // Array of numbers
  special: { type: [Number] }, // Array of numbers
  distance: { type: [Number] }, // Array of numbers
  deameSlance: { type: [Number] }, // Array of numbers
  totalSalary: { type: [Number] }, // Array of numbers
  netPay: { type: [Number] }, // Array of numbers
  mobileBill: { type: [Number] }, // Array of numbers
  commission: { type: [Number] }, // Array of numbers
  bonus: { type: [Number] }, // Array of numbers
  pf: { type: [Number] }, // Array of numbers
  advance: { type: [Number] }, // Array of numbers
  loan: { type: [Number] }, // Array of numbers
  fsf: { type: [Number] }, // Array of numbers
  healthFund: { type: [Number] }, // Array of numbers
  other: { type: [Number] }, // Array of numbers
  offGrt: { type: [Number] }, // Array of numbers
  earned: { type: [Number] }, // Array of numbers
  offPf: { type: [Number] }, // Array of numbers
  totalPF: { type: [Number] }, // Array of numbers
  totalSalAndAllowances: { type: [Number] }, // Array of numbers
  comment: { type: [String] }, // Array of strings for comments
});

const WorkerSalary = mongoose.model("WorkerSalary", WorkerSalarySchema);

module.exports = WorkerSalary;
