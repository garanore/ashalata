// worker.model.js

const mongoose = require("mongoose");
const addworkerSchema = new mongoose.Schema(
  {
    workerID: { type: String, unique: true },
    WorkerName: { type: String, required: true },
    WorkerParent: { type: String, required: true },
    WdateOfBirth: { type: String, default: null },
    WorkerJob: { type: String, required: true },
    WorkerHome: { type: String, required: true },
    WorkerUnion: { type: String, required: true },
    WorkerPost: { type: String, required: true },
    WorkerSubDic: { type: String, required: true },
    WorkerDic: { type: String, required: true },
    WorkerMarital: { type: String, required: true },
    WorkerStudy: { type: String, required: true },
    WorkerNID: { type: String, required: true },
    WorkerMobile: { type: String, required: true },
    WorkerMail: { type: String, required: true },
    Workerimage: { type: String, default: null }, // Image path or URL
    WorkerCenterAdd: { type: [String] }, // save as Array
    WorkerBranchAdd: { type: [String] }, // save as Array
    Designation: { type: String, required: true },
    JoiningDate: { type: String, required: true },
    agreementChecked: { type: Boolean, required: true },
    approvalStatus: {
      type: String,
      enum: ["Approved", "Needs Correction", "Granted"],
      default: "Approved",
    },
    ActiveStatus: {
      type: String,
      enum: ["True", "False"],
      default: "True",
    },
    submittedBy: { type: String, required: true },
    GrantedBy: { type: String, default: "Null", required: true },
    DeletedStatus: { type: String, default: "Null", required: true },
    DeleteDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const addWorker = mongoose.model("addWorker", addworkerSchema);

module.exports = addWorker;
