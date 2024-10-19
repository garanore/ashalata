const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema(
  {
    DesignationID: { type: String, unique: true },
    DesignationName: { type: String },
    ActiveStatus: {
      type: String,
      enum: ["True", "False"],
      default: "True",
    },
    submittedBy: { type: String, required: true },
    DeletedBy: { type: String, default: "Null", required: true },
    DeleteDate: { type: Date, default: null },
    imageUrl: { type: String }, // Add this field to store the image URL
  },
  { timestamps: true }
);

const Designation = mongoose.model("Designation", DesignationSchema);

module.exports = Designation;
