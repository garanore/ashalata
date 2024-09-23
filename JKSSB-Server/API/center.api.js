const express = require("express");
const router = express.Router();
const OpenCenter = require("../models/center.model.js");
const { ObjectId } = require("mongoose").Types;

const generateCenterID = async () => {
  const count = await OpenCenter.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `C${paddedCount}`;
};

router.get("/opencenter/count", async (req, res) => {
  try {
    const count = await OpenCenter.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Center Data------------------------------------------------------

router.post("/opencenter", async (req, res) => {
  try {
    const {
      CenterName,
      CenterAddress,
      CenterMnumber,
      centerBranch,
      CenterDay,
      submittedBy, // Get the submittedBy from the request
    } = req.body;
    const centerID = await generateCenterID();

    const newCenter = new OpenCenter({
      centerID,
      CenterName,
      CenterAddress,
      CenterMnumber,
      centerBranch,
      CenterDay,
      approvalStatus: "Approved",
      ActiveStatus: "True",
      submittedBy, // Save the username to the model
      GrantedBy: "Null", // Set default value
      DeletedStatus: "Null", // Set default value
    });

    await newCenter.save();
    res.status(201).json({ message: "Center application is pending approval" });
  } catch (error) {
    console.error("Center application error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.post("/opencenter/approve/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const center = await OpenCenter.findByIdAndUpdate(
//       id,
//       { approvalStatus: "Approved" },
//       { new: true }
//     );

//     if (!center) {
//       return res.status(404).json({ message: "Center not found" });
//     }

//     res.json({ message: "Center approved", center });
//   } catch (error) {
//     console.error("Error approving center:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // For Pending

// router.get("/opencenter/pending", async (req, res) => {
//   try {
//     const pendingCenters = await OpenCenter.find({ approvalStatus: "Pending" });
//     res.json(pendingCenters);
//   } catch (error) {
//     console.error("Error fetching pending centers:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/opencenter/grant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // Get the username from the request body

    const center = await OpenCenter.findByIdAndUpdate(
      id,
      {
        approvalStatus: "Granted",
        GrantedBy: username, // Save the username in the GrantedBy field
      },
      { new: true }
    );

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    res.json({ message: "Center granted", center });
  } catch (error) {
    console.error("Error granting center:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/opencenter/grant", async (req, res) => {
  try {
    const grantCenters = await OpenCenter.find({ approvalStatus: "Approved" });
    res.json(grantCenters);
  } catch (error) {
    console.error("Error fetching pending centers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch centers with Needs Correction status
// Fetch centers with Needs Correction status, optionally filter by submittedBy
router.get("/opencenter/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    // If submittedBy is provided, filter centers by it, otherwise fetch all with Needs Correction
    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const centers = await OpenCenter.find(query);
    res.json(centers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching centers needing correction" });
  }
});

// Update center approval status to Needs Correction
router.post("/opencenter/review/:id", async (req, res) => {
  try {
    const center = await OpenCenter.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "Center sent back for correction", center });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending center back for correction" });
  }
});

router.delete("/opencenter/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const center = await OpenCenter.findByIdAndDelete(id);

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    res.json({ message: "Center canceled" });
  } catch (error) {
    console.error("Error canceling center:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Center Callback---------------------------------------------------------------

router.get("/center-callback", async (req, res) => {
  try {
    const selectedBranch = req.query.selectedBranch;

    let query = { approvalStatus: "Granted" }; // Default query (filtering by approvalStatus)

    if (selectedBranch) {
      query.centerBranch = selectedBranch;
    }

    const centers = await OpenCenter.find(
      query,
      " submittedBy ActiveStatus approvalStatus centerID CenterName CenterAddress CenterMnumber  centerBranch CenterDay"
    );

    res.json(centers);
  } catch (error) {
    console.error("Center routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Center Callback By CenterID------------------------------------------------

router.get("/center-callback-id/:center", async (req, res) => {
  try {
    const selectedid = req.params.center; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center and approvalStatus
    const centerdays = await OpenCenter.find({
      centerID: selectedid,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(centerdays);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Find Center by Selected Branch-------------------------------------------------------

router.get("/center-callback/:ID", async (req, res) => {
  try {
    const centerID = req.params.ID; // Retrieve centerID from route parameter
    const query = { _id: new ObjectId(centerID), approvalStatus: "Granted" };

    const center = await OpenCenter.findOne(
      query,
      " submittedBy ActiveStatus approvalStatus centerID CenterName CenterAddress CenterMnumber centerWorker centerBranch CenterDay"
    );

    if (!center) {
      return res
        .status(404)
        .json({ success: false, message: "center not found" });
    }

    res.json(center);
  } catch (error) {
    console.error("center routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Center Callbacks by Branch----------------------------------------------------------------

router.get("/center-callback-by-branch", async (req, res) => {
  try {
    const BranchIDs = await OpenCenter.find({ approvalStatus: "Granted" });

    // Send the retrieved dates as a response
    res.status(200).json(BranchIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/center-callback-by-branch/:centerBranch", async (req, res) => {
  try {
    const selectedID = req.params.centerBranch;

    // Filter documents based on the selected ID and approvalStatus
    const BranchIDs = await OpenCenter.find({
      centerBranch: selectedID,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(BranchIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Center Callbacks by CenterDay----------------------------------------------------------------

router.get("/center-callback-by-CenterDay", async (req, res) => {
  try {
    const CenterDays = await OpenCenter.find({ approvalStatus: "Granted" });

    // Send the retrieved dates as a response
    res.status(200).json(CenterDays);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/center-callback-by-CenterDay/:CenterDay", async (req, res) => {
  try {
    const selectedID = req.params.CenterDay;

    // Filter documents based on the selected ID and approvalStatus
    const CenterDays = await OpenCenter.find({
      CenterDay: selectedID,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(CenterDays);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Center Update ----------------------------------------------------------------
router.put("/center-callback/:ID", async (req, res) => {
  try {
    const centerID = req.params.ID;
    const query = { _id: new ObjectId(centerID) };
    const updatedData = req.body;

    const updatedCenter = await OpenCenter.findOneAndUpdate(
      { _id: query },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedCenter) {
      return res
        .status(404)
        .json({ success: false, message: "Center not found" });
    }

    res.json({
      success: true,
      message: "Center updated successfully",
      updatedCenter,
    });
  } catch (error) {
    console.error("Center Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/opencenter/ActiveStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, deleteDate } = req.body; // Get the username and deleteDate from the request body

    const center = await OpenCenter.findByIdAndUpdate(
      id,
      {
        ActiveStatus: "False",
        DeletedStatus: username, // Save the username in the DeletedStatus field
        DeleteDate: deleteDate, // Save the current date in the DeleteDate field
      },
      { new: true } // Return the updated document
    );

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    res.json({ message: "Center status updated", center });
  } catch (error) {
    console.error("Error updating center status:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
