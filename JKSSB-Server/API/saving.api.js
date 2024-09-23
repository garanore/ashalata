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
  try {
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
      submittedBy, // Added submittedBy to validation
    } = req.body;

    // Validation: Check for required fields
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
      !submittedBy // Include validation for submittedBy
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate the SavingID
    const SavingID = await generateSavingID(memberID);

    // Create new OpenSaving document
    const newSaving = new OpenSaving({
      SavingID,
      memberID,
      SavingName,
      fathername,
      SavingBranch,
      SavingCenter,
      SavingMobile,
      SavingType,
      SavingTime: SavingTime || "N/A", // Default to 'N/A' if SavingTime is missing
      SavingAmount,
      CenterDay,
      installmentStart,
      nextDates: nextDates.length > 0 ? nextDates : [], // Default to an empty array if nextDates is missing
      approvalStatus: "Pending", // Default to Pending if not provided
      ActiveStatus: "True", // Default to True if not provided
      submittedBy, // Ensure submittedBy is provided
      GrantedBy: "Null", // Default to 'Null' if not provided
      DeletedBy: "Null", // Default to 'Null' if not provided
      DeleteDate: null, // Default to null if not provided
    });

    // Save the new document to the database
    await newSaving.save();

    // Return success response
    res.status(200).json({ message: "Dates saved successfully" });
  } catch (error) {
    console.error("Error saving dates:", error.message);
    res.status(500).json({ error: "Failed to save dates" });
  }
});

// for permissions check

router.post("/opensaving/approved/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const savings = await OpenSaving.findByIdAndUpdate(
      id,
      { approvalStatus: "Approved" },
      { new: true }
    );

    if (!savings) {
      return res.status(404).json({ message: "savings not found" });
    }

    res.json({ message: "savings pending", savings });
  } catch (error) {
    console.error("Error approving savings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/opensaving/approved", async (req, res) => {
  try {
    const pendingSavings = await OpenSaving.find({ approvalStatus: "Pending" });
    res.json(pendingSavings);
  } catch (error) {
    console.error("Error fetching pending savings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// For Granted

router.post("/opensaving/granted/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const savings = await OpenSaving.findByIdAndUpdate(
      id,
      { approvalStatus: "Granted", GrantedBy: username },
      { new: true }
    );

    if (!savings) {
      return res.status(404).json({ message: "savings not found" });
    }

    res.json({ message: "savings pending", savings });
  } catch (error) {
    console.error("Error approving savings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/opensaving/granted", async (req, res) => {
  try {
    const pendingSavings = await OpenSaving.find({
      approvalStatus: "Approved",
    });
    res.json(pendingSavings);
  } catch (error) {
    console.error("Error fetching pending savings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// for Delete

router.delete("/opensaving/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const savings = await OpenSaving.findByIdAndDelete(id);

    if (!savings) {
      return res.status(404).json({ message: "savings not found" });
    }

    res.json({ message: "savings canceled" });
  } catch (error) {
    console.error("Error canceling savings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update savings approval status to Needs Correction
router.get("/opensaving/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    // If submittedBy is provided, filter savings by it, otherwise fetch all with Needs Correction
    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const savings = await OpenSaving.find(query);
    res.json(savings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Saving needing correction" });
  }
});

// Update center approval status to Needs Correction
router.post("/opensaving/review/:id", async (req, res) => {
  try {
    const center = await OpenSaving.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "Saving sent back for Approve", center });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending Saving back for correction" });
  }
});

//All Saving Callbacks----------------------------------------------------------------

router.get("/saving-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // If center parameter is provided, filter savings by center
    // const query = center ? { SavingCenter: center } : {};

    const query = {
      ...(center ? { SavingCenter: center } : {}), // Add center filter if specified
      approvalStatus: "Granted", // Only include loans with 'Granted' approval status
    };

    const savings = await OpenSaving.find(
      query,
      " DeleteDate DeletedBy GrantedBy submittedBy approvalStatus ActiveStatus memberID SavingID SavingName fathername SavingBranch SavingCenter SavingMobile SavingType SavingTime SavingAmount CenterDay installmentStart nextDates "
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
    const SavingIDs = await OpenSaving.find({ SavingID: selectedSaving });

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
      approvalStatus: "Granted",
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
      approvalStatus: "Granted",
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
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(memberIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Saving Calback by Branch----------------------------------------------------

router.get("/saving-callback-by-branch/:SavingBranch", async (req, res) => {
  try {
    const selectedID = req.params.SavingBranch; //

    // Filter documents based on the selected ID
    const SavingBranchs = await OpenSaving.find({
      SavingBranch: selectedID,
      approvalStatus: "Granted",
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

router.put("/opensaving/ActiveStatus/:id", async (req, res) => {
  try {
    const { username, deleteDate } = req.body; // Extract data from request body
    const SavingID = req.params.id; // Get the savings ID from the route params

    // Find the savings by ID
    const savings = await OpenSaving.findById(SavingID);

    // If saving not found, return a 404 response
    if (!savings) {
      return res
        .status(404)
        .json({ success: false, message: "savings not found" });
    }

    // Update the fields in the savings document
    savings.ActiveStatus = "False";
    savings.DeletedBy = username;
    savings.DeleteDate = deleteDate; // Assuming you have a DeleteDate field in your schema

    // Save the updated savings document
    await savings.save();

    // Return success response
    res.status(200).json({ message: "savings updated successfully" });
  } catch (error) {
    console.error("Error updating ActiveStatus:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
