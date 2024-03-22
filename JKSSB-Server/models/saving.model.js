// opensaving.model.js
const mongoose = require("mongoose");

const openSavingSchema = new mongoose.Schema(
  {
    memberID: { type: String, required: true },
    savingID: { type: String, required: true, unique: true },
    OSname: { type: String, required: true },
    fathername: { type: String, required: true },
    OSbranch: { type: String },
    OScenter: { type: String },
    OSmobile: { type: String },
    savingType: { type: String },
    OSamount: { type: Number },
    timePeriod: { type: String },
    Samount: { type: Number },
  },
  { timestamps: true }
);

const OpenSaving = mongoose.model("OpenSaving", openSavingSchema);

module.exports = OpenSaving;
