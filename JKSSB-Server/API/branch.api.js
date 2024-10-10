const express = require("express");
const router = express.Router();
const OpenBranch = require("../models/branch.model.js");
const { ObjectId } = require("mongoose").Types;

const generateBranchID = async () => {
  const count = await OpenBranch.countDocuments();
  const paddedCount = (count + 1).toString().padStart(2, "0");
  return `B${paddedCount}`;
};

router.get("/openbranch/count", async (req, res) => {
  try {
    const count = await OpenBranch.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/openbranch", async (req, res) => {
  try {
    const { BranchName, BranchAddress, BranchMobile, submittedBy } = req.body;
    const BranchID = await generateBranchID();
    const newBranchrouterlication = new OpenBranch({
      BranchID,
      BranchName,
      BranchAddress,
      submittedBy,
      BranchMobile,
      ActiveStatus: "True",
      DeletedBy: "Null",
    });
    await newBranchrouterlication.save();
    res.status(201).json({ message: "Branch Create successfully" });
  } catch (error) {
    console.error("Branch routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch Callback----------------------------------------------------------------

router.get("/branch-callback", async (req, res) => {
  try {
    // Fetch all centers and return only CenterName
    const branchs = await OpenBranch.find(
      {},
      "BranchID BranchName BranchAddress  BranchMobile ActiveStatus DeletedBy submittedBy "
    );
    res.json(branchs);
  } catch (error) {
    console.error("Branch routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch ID Get--------------------------------------------------------

router.get("/branch-callback/:ID", async (req, res) => {
  try {
    const branchID = req.params.ID; // Retrieve BranchID from route parameter

    const query = { _id: new ObjectId(branchID) };

    const branch = await OpenBranch.findOne(
      query,
      " BranchID BranchName BranchAddress  BranchMobile ActiveStatus DeletedBy submittedBy"
    );

    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.error("Branch routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch Update
router.put("/branch-callback/:ID", async (req, res) => {
  try {
    const branchID = req.params.ID;
    const query = { _id: new ObjectId(branchID) };
    const updatedData = req.body;

    const updatedBranch = await OpenBranch.findOneAndUpdate(
      { _id: query },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedBranch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    res.json({
      success: true,
      message: "Branch updated successfully",
      updatedBranch,
    });
  } catch (error) {
    console.error("Branch Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// for disabling branches ------------------------------

router.put("/openbranch/ActiveStatus/:id", async (req, res) => {
  try {
    const { username, deleteDate } = req.body;
    const branchId = req.params.id;

    const branch = await OpenBranch.findById(branchId);

    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    branch.ActiveStatus = "False";
    branch.DeletedBy = username;
    branch.DeleteDate = deleteDate; // Assuming you have a DeleteDate field in your schema

    await branch.save();

    res.status(200).json({ message: "Branch updated successfully" });
  } catch (error) {
    console.error("Error updating ActiveStatus:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
