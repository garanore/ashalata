const express = require("express");
const router = express.Router();
const OpenSaving = require("../models/saving.model.js");
const { ObjectId } = require("mongoose").Types;

const generateSavingID = async (memberID) => {
  try {
    const count = await OpenSaving.countDocuments({ memberID: memberID });
    const paddedCount = (count + 1).toString().padStart(2, "0");
    return `${memberID}S${paddedCount}`;
  } catch (error) {
    console.error("Error generating Saving ID:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
};

// Saving ID Count
router.get("/opensaving/count", async (req, res) => {
  try {
    const count = await OpenSaving.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching saving count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/opensaving", async (req, res) => {
  const {
    memberID,
    SavingName,
    fathername,
    SavingBranch,
    SavingCenter,
    SavingMobile,
    SavingType,
    SavingTime,
    SavingAmount,
    CenterDay,
    installmentStart,
    nextDates,
  } = req.body;

  if (
    !memberID ||
    !SavingName ||
    !fathername ||
    !SavingBranch ||
    !SavingCenter ||
    !SavingMobile ||
    !SavingType ||
    !SavingAmount ||
    !CenterDay ||
    !installmentStart ||
    !nextDates
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const SavingID = await generateSavingID(memberID);

    const dateDocument = new OpenSaving({
      memberID,
      SavingID,
      SavingName,
      fathername,
      SavingBranch,
      SavingCenter,
      SavingMobile,
      SavingType,
      SavingTime,
      SavingAmount,
      CenterDay,
      installmentStart,
      nextDates,
    });

    await dateDocument.save();
    res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    console.error("Error saving dates:", error.message);
    res.status(500).json({ error: "Failed to save dates" });
  }
});

//All Saving Callbacks----------------------------------------------------------------

router.get("/saving-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // If center parameter is provided, filter savings by center
    const query = center ? { SavingCenter: center } : {};

    const savings = await OpenSaving.find(
      query,
      "memberID SavingID SavingName fathername SavingBranch SavingCenter SavingMobile SavingType SavingTime SavingAmount CenterDay installmentStart nextDates "
    );

    res.json(savings);
  } catch (error) {
    console.error("Saving Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Saving Callback by Saving ID-------------------------------------------------------------------------------------------
router.get("/get-saving-savingid/:SavingID", async (req, res) => {
  try {
    const selectedSaving = req.params.SavingID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const SavingIDs = await OpenSaving.find({
      SavingID: selectedSaving,
    });

    // Send the retrieved dates as a response
    res.status(200).json(SavingIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Saving CallBack By Center----------------------------------------------------------------

router.get("/saving-callback-center/:center", async (req, res) => {
  try {
    const selectedCenter = req.params.center; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const SavingCenters = await OpenSaving.find({
      SavingCenter: selectedCenter,
    });

    // Send the retrieved dates as a response
    res.status(200).json(SavingCenters);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Saving CallBack By SavingType----------------------------------------------------------------

router.get("/savingtype-callback/:SavingType", async (req, res) => {
  try {
    const selectedSavingType = req.params.SavingType; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const SavingTypes = await OpenSaving.find({
      SavingType: selectedSavingType,
    });

    // Send the retrieved dates as a response
    res.status(200).json(SavingTypes);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Saving CallBack By MemberID----------------------------------------------------------------

router.get("/saving-callback-memberid/:memberID", async (req, res) => {
  try {
    const selectedMemberID = req.params.memberID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const memberIDs = await OpenSaving.find({
      memberID: selectedMemberID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(memberIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Saving Calback by Branch----------------------------------------------------

router.get("/saving-callback-by-branch", async (req, res) => {
  try {
    const SavingBranchs = await OpenSaving.find();

    // Send the retrieved dates as a response
    res.status(200).json(SavingBranchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/saving-callback-by-branch/:SavingBranch", async (req, res) => {
  try {
    const selectedID = req.params.SavingBranch; //

    // Filter documents based on the selected ID
    const SavingBranchs = await OpenSaving.find({
      SavingBranch: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(SavingBranchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Saving Update----------------------------------------------------------------

router.put("/saving-callback/:ID", async (req, res) => {
  try {
    const SavingID = req.params.ID; // Retrieve SavingID from route parameter
    const query = { _id: new ObjectId(SavingID) };
    const updatedData = req.body;

    const updatedSaving = await OpenSaving.findOneAndUpdate(
      { _id: query },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedSaving) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }

    res.json({
      success: true,
      message: "Loan updated successfully",
      updatedSaving,
    });
  } catch (error) {
    console.error("Loan Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
