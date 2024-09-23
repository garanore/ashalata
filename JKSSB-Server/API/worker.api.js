const express = require("express");
const router = express.Router();
const AddWorker = require("../models/worker.model.js");
const { ObjectId } = require("mongoose").Types;

//For Generate ID------------------------------------------
const generateWorkerID = async () => {
  const count = await AddWorker.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `W${paddedCount}`;
};

router.get("/workeradmission/count", async (req, res) => {
  try {
    const count = await AddWorker.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Worker Data------------------------------------------------

router.post("/workeradmission", async (req, res) => {
  try {
    const {
      WorkerName,
      WorkerParent,
      WdateOfBirth,
      WorkerJob,
      WorkerHome,
      WorkerUnion,
      WorkerPost,
      WorkerSubDic,
      WorkerDic,
      WorkerMarital,
      WorkerStudy,
      WorkerNID,
      WorkerMobile,
      WorkerMail,
      Workerimage,
      WorkerCenterAdd,
      WorkerBranchAdd,
      Designation,
      JoiningDate,
      submittedBy,
      agreementChecked,
    } = req.body;
    const workerID = await generateWorkerID();
    const newWorker = new AddWorker({
      workerID,
      WorkerName,
      WorkerParent,
      WdateOfBirth,
      WorkerJob,
      WorkerHome,
      WorkerUnion,
      WorkerPost,
      WorkerSubDic,
      WorkerDic,
      WorkerMarital,
      WorkerStudy,
      WorkerNID,
      WorkerMobile,
      WorkerMail,
      Workerimage,
      WorkerCenterAdd,
      WorkerBranchAdd,
      Designation,
      JoiningDate,
      approvalStatus: "Approved",
      ActiveStatus: "True",
      submittedBy, // Save the username to the model
      GrantedBy: "Null", // Set default value
      DeletedStatus: "Null", // Set default value
      agreementChecked,
    });
    await newWorker.save();
    res.status(201).json({ message: "Worker data saved successfully" });
  } catch (error) {
    console.error("Worker Admission Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// For Permission

router.post("/workeradmission/grant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const worker = await AddWorker.findByIdAndUpdate(
      id,
      { approvalStatus: "Granted", GrantedBy: username },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: "worker not found" });
    }

    res.json({ message: "worker granted", worker });
  } catch (error) {
    console.error("Error granting worker:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workeradmission/grant", async (req, res) => {
  try {
    const grantWorker = await AddWorker.find({ approvalStatus: "Approved" });
    res.json(grantWorker);
  } catch (error) {
    console.error("Error fetching pending workers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/workeradmission/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await AddWorker.findByIdAndDelete(id);

    if (!worker) {
      return res.status(404).json({ message: "worker not found" });
    }

    res.json({ message: "worker canceled" });
  } catch (error) {
    console.error("Error canceling worker:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/workeradmission/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    // If submittedBy is provided, filter worker by it, otherwise fetch all with Needs Correction
    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const workers = await AddWorker.find(query);
    res.json(workers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching worker needing correction" });
  }
});

// Update worker approval status to Needs Correction
router.post("/workeradmission/review/:id", async (req, res) => {
  try {
    const worker = await AddWorker.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "worker sent back for correction", worker });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending worker back for correction" });
  }
});

// Worker Callback--------------------------------------------------
router.get("/worker-callback", async (req, res) => {
  try {
    const selectedBranch = req.query.selectedBranch;
    let query = {};
    if (selectedBranch) {
      query = { WorkerBranchAdd: selectedBranch };
    }
    const workers = await AddWorker.find(
      query,
      "workerID WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd Designation JoiningDate agreementChecked"
    );

    res.json(workers);
  } catch (error) {
    console.error("Worker routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Only Worker CallBack--------------------------------------------------------
router.get("/worker-callback-salary", async (req, res) => {
  try {
    const workers = await AddWorker.find({}, "workerID WorkerName Designation");

    res.json(workers);
  } catch (error) {
    console.error("Worker routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker ID get--------------------------------------------------------------

router.get("/worker-callback/:ID", async (req, res) => {
  try {
    const workerID = req.params.ID; // Retrieve workerID from route parameter
    const query = { _id: new ObjectId(workerID) };

    const worker = await AddWorker.findOne(
      query,
      "workerID WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd Designation agreementChecked"
    );

    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "worker not found" });
    }

    res.json(worker);
  } catch (error) {
    console.error("worker routerlication Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker Name Call back by center

router.get("/get-worker-name/:WorkerCenterAdd", async (req, res) => {
  try {
    const { WorkerCenterAdd } = req.params;

    // Find the worker where WorkerCenterAdd array contains the provided Center
    const worker = await AddWorker.findOne({
      WorkerCenterAdd: { $in: [WorkerCenterAdd] },
    });

    // Check if worker data is found
    if (worker) {
      res.status(200).json({ WorkerName: worker.WorkerName });
    } else {
      res
        .status(404)
        .json({ message: "No worker found with the provided WorkerCenterAdd" });
    }
  } catch (error) {
    console.error("Error fetching worker name:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker Callback by Center ----------------------------------------------------------------

router.get("/worker-callback-center", async (req, res) => {
  try {
    const WorkerCenterAdds = await AddWorker.find();

    // Send the retrieved dates as a response
    res.status(200).json(WorkerCenterAdds);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/worker-callback-center/:ID", async (req, res) => {
  try {
    const selectedCenter = req.params.ID; //

    // Filter documents based on the selected ID
    const WorkerCenterAdds = await AddWorker.find({
      WorkerCenterAdd: selectedCenter,
    });

    // Send the retrieved dates as a response
    res.status(200).json(WorkerCenterAdds);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Worker Callback by Branch ----------------------------------------------------------------

router.get("/worker-callback-branch", async (req, res) => {
  try {
    const branchs = await AddWorker.find();

    // Send the retrieved dates as a response
    res.status(200).json(branchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/worker-callback-branch/:WorkerBranchAdd", async (req, res) => {
  try {
    const selectedbranchs = req.params.WorkerBranchAdd; //

    // Filter documents based on the selected ID
    const branchs = await AddWorker.find({
      WorkerBranchAdd: selectedbranchs,
    });

    // Send the retrieved dates as a response
    res.status(200).json(branchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//worker Update-----------------------------------------------------------------

router.put("/worker-callback/:ID", async (req, res) => {
  try {
    const workerID = req.params.ID; // Retrieve workerID from route parameter

    // No need to use new ObjectId(workerID) if it's already a valid ObjectId string
    const query = { _id: workerID };
    const updatedData = req.body;

    const updatedWorker = await AddWorker.findOneAndUpdate(
      query,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedWorker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }

    res.json({
      success: true,
      message: "Worker updated successfully",
      updatedWorker,
    });
  } catch (error) {
    console.error("Worker Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/workeradmission/ActiveStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, deleteDate } = req.body; // Get the username and deleteDate from the request body

    const worker = await AddWorker.findByIdAndUpdate(
      id,
      {
        ActiveStatus: "False",
        DeletedStatus: username, // Save the username in the DeletedStatus field
        DeleteDate: deleteDate, // Save the current date in the DeleteDate field
      },
      { new: true } // Return the updated document
    );

    if (!worker) {
      return res.status(404).json({ message: "worker not found" });
    }

    res.json({ message: "worker status updated", worker });
  } catch (error) {
    console.error("Error updating worker status:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
