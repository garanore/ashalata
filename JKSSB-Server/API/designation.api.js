const express = require("express");
const router = express.Router();
const Designation = require("../models/designation.model.js");
const { ObjectId } = require("mongoose").Types;

const generateDesignationID = async () => {
  const count = await Designation.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `D${paddedCount}`;
};

router.get("/designation/count", async (req, res) => {
  try {
    const count = await Designation.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching Designation count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Designation Information-----------------------------------------------------
router.post("/designation", async (req, res) => {
  try {
    const { DesignationName } = req.body;

    const DesignationID = await generateDesignationID();

    // Create a new document using the DateModel
    const dateDocument = new Designation({
      DesignationID,
      DesignationName,
    });

    // Save the document to the database
    await dateDocument.save();

    // Send a success response
    res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    // If an error occurs during the save operation, send an error response
    console.error("Error saving dates:", error.message);
    res.status(500).json({ error: "Failed to save dates" });
  }
});

//  Designation callback by ID ----------------------------------------------------------------
router.get("/designation-callback", async (req, res) => {
  try {
    const DesignationIDs = await Designation.find();

    // Send the retrieved dates as a response
    res.status(200).json(DesignationIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/designation-callback/:ID", async (req, res) => {
  try {
    const selectedID = req.params.ID; //

    // Filter documents based on the selected ID
    const DesignationIDs = await Designation.find({
      DesignationID: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(DesignationIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

module.exports = router;
