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
      centerWorker,
      centerBranch,
      CenterDay,
    } = req.body;
    const centerID = await generateCenterID();
    const newCenterrouterlication = new OpenCenter({
      centerID,
      CenterName,
      CenterAddress,
      CenterMnumber,
      centerWorker,
      centerBranch,
      CenterDay,
    });
    await newCenterrouterlication.save();
    res.status(201).json({ message: "Center Create successfully" });
  } catch (error) {
    console.error("Center routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Center Callback---------------------------------------------------------------

router.get("/center-callback", async (req, res) => {
  try {
    const selectedBranch = req.query.selectedBranch;

    let query = {}; // Default query (no filtering)

    if (selectedBranch) {
      query = { centerBranch: selectedBranch };
    }

    const centers = await OpenCenter.find(
      query,
      "centerID CenterName CenterAddress CenterMnumber centerWorker centerBranch CenterDay"
    ).populate("centerWorker", "WorkerName");

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

    // Filter documents based on the selected center
    const centerdays = await OpenCenter.find({ centerID: selectedid });

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
    const query = { _id: new ObjectId(centerID) };

    const center = await OpenCenter.findOne(
      query,
      " centerID CenterName CenterAddress CenterMnumber centerWorker centerBranch CenterDay"
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
    const BranchIDs = await OpenCenter.find();

    // Send the retrieved dates as a response
    res.status(200).json(BranchIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/center-callback-by-branch/:centerBranch", async (req, res) => {
  try {
    const selectedID = req.params.centerBranch; //

    // Filter documents based on the selected ID
    const BranchIDs = await OpenCenter.find({
      centerBranch: selectedID,
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
    const CenterDays = await OpenCenter.find();

    // Send the retrieved dates as a response
    res.status(200).json(CenterDays);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/center-callback-by-CenterDay/:CenterDay", async (req, res) => {
  try {
    const selectedID = req.params.CenterDay; //

    // Filter documents based on the selected ID
    const CenterDays = await OpenCenter.find({
      CenterDay: selectedID,
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

module.exports = router;
