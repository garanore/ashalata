const mongoose = require("mongoose");
const addOfficeWorkerSchema = new mongoose.Schema(
  {
    officeworkerID: { type: String, unique: true },
    officeWorkerName: { type: String, required: true },
    OfficeWorkerParent: { type: String, required: true },
    OfficeWdateOfBirth: { type: String, default: null },
    OfficeWorkerJob: { type: String, required: true },
    officeWorkerHome: { type: String, required: true },
    OfficeWorkerUnion: { type: String, required: true },
    officeWorkerPost: { type: String, required: true },
    OfficeWorkerSubDic: { type: String, required: true },
    OfficeWorkerDic: { type: String, required: true },
    OfficeWorkerMarital: { type: String, required: true },
    OfficeWorkerStudy: { type: String, required: true },
    OfficeWorkerNID: { type: String, required: true },
    OfficeWorkerMobile: { type: String, required: true },
    OfficeWorkerMail: { type: String, required: true },

    OfficeWorkerCenter: { type: String, required: true },
    OfficeWorkerBranch: { type: String, required: true },
    Designation: { type: String, required: true },
    agreementChecked: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const addOfficeWorker = mongoose.model(
  "addOfficeWorker",
  addOfficeWorkerSchema
);

module.exports = addOfficeWorker;
