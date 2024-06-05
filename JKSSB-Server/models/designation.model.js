const mongoose = require("mongoose");

// Define a schema for the date document
const DesignationSchema = new mongoose.Schema({
  DesignationID: { type: String, unique: true },

  DesignationName: { type: String },
});

// Create a model using the schema
const Designation = mongoose.model("Designation", DesignationSchema);

module.exports = Designation;
