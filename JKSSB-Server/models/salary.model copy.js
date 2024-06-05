const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkerSalarySchema = new Schema({
  workerID: { type: String, required: true },
  WorkerName: { type: String, required: true },
  Designation: { type: String, required: true },
  basic: { type: Number },
  houseRent: { type: Number },
  medAllow: { type: Number },
  transAllow: { type: Number },
  special: { type: Number },
  distance: { type: Number },
  deameSlance: { type: Number },
  mobileBill: { type: Number },
  commission: { type: Number },
  bonus: { type: Number },
  pf: { type: Number },
  advance: { type: Number },
  loan: { type: Number },
  fsf: { type: Number },
  healthFund: { type: Number },
  other: { type: Number },
  offGrt: { type: Number },
  earned: { type: Number },
  offPf: { type: Number },
  comment: { type: String },
});

const WorkerSalary = mongoose.model("WorkerSalary", WorkerSalarySchema);

module.exports = WorkerSalary;
