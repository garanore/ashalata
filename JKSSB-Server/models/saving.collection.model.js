const mongoose = require("mongoose");

const SavingCollectionSchema = new mongoose.Schema(
  {
    savingID: { type: String, required: true },
    memberID: { type: String, required: true },
    savingName: { type: String, required: true },
    savingMobile: { type: String, required: true },
    centerName: { type: String, required: true },

    savingType: { type: String, required: true },
    savingTime: { type: String },
    savingAmount: { type: Number, required: true },
    savingCollecting: { type: [String] }, // Array of strings
    savingCollectionDate: { type: [String], required: true }, // Array of strings
  },
  { timestamps: true } // Add timestamps option here
);

const SavingCollection = mongoose.model(
  "SavingCollection",
  SavingCollectionSchema
);

module.exports = SavingCollection;
