const express = require("express");
const router = express.Router();
const AddWorker = require("../models/worker.model.js");
const { ObjectId } = require("mongoose").Types;

const multer = require("multer");
const cloudinary = require("../cloudinaryConfig"); // Import Cloudinary config
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Set up Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "workers", // The folder should exist in Cloudinary
    format: async (req, file) => {
      // Automatically choose the format based on the uploaded file
      const allowedFormats = ["jpg", "png", "jpeg"];
      const format = file.mimetype.split("/")[1];
      return allowedFormats.includes(format) ? format : null;
    },
    public_id: (req, file) => file.originalname.split(".")[0], // Optional: set a specific file name
  },
});

const upload = multer({ storage }); // Multer config for file upload

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

router.post(
  "/workeradmission",
  upload.single("WorkerImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        console.error("No file uploaded or file format not supported");
        throw new Error("No file uploaded or file format not supported");
      }

      // Check what's in req.file
      console.log(req.file); // Should log the uploaded file info

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
        WorkerCenterAdd,
        WorkerBranchAdd,
        designation,
        JoiningDate,
        submittedBy,
        agreementChecked,
      } = req.body;

      const workerID = await generateWorkerID();
      const imageUrl = req.file.path; // Cloudinary URL from Multer

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
        WorkerCenterAdd,
        WorkerBranchAdd,
        designation,
        JoiningDate,
        approvalStatus: "Approved",
        ActiveStatus: "True",
        submittedBy,
        GrantedBy: "Null",
        DeletedStatus: "Null",
        agreementChecked,
        image: imageUrl, // Save the Cloudinary URL
      });

      await newWorker.save();
      res
        .status(201)
        .json({ message: "Worker data saved successfully", imageUrl });
    } catch (error) {
      console.error("Worker Admission Error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

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
      "workerID image imageUrl WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd designation JoiningDate agreementChecked"
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
    const workers = await AddWorker.find({}, "workerID WorkerName designation");

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
      "workerID  image  WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd designation agreementChecked"
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

// worker callback by mail-------------------------------------------
router.get("/get-worker-by-mail/:WorkerMail", async (req, res) => {
  try {
    const { WorkerMail } = req.params;

    // Find the worker where WorkerMail matches the provided email
    const worker = await AddWorker.findOne({ WorkerMail });

    // Check if worker data is found
    if (worker) {
      res.status(200).json(worker); // Return the worker's full data
    } else {
      res
        .status(404)
        .json({ message: "No worker found with the provided email" });
    }
  } catch (error) {
    console.error("Error fetching worker by email:", error.message);
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

router.get("/worker-callback-by-branch/:WorkerBranchAdd", async (req, res) => {
  try {
    const selectedWorkerBranch = req.params.WorkerBranchAdd;

    // Check if the selectedWorkerBranch is "AllWorkerBranch"
    let query;
    if (selectedWorkerBranch === "AllWorkerBranch") {
      // Find workers with an empty WorkerBranchAdd array
      query = { WorkerBranchAdd: { $size: 0 } };
    } else {
      // Otherwise, find workers with the selected WorkerBranchAdd
      query = { WorkerBranchAdd: selectedWorkerBranch };
    }

    const workers = await AddWorker.find(query);

    if (workers.length > 0) {
      res.status(200).json(
        workers.map((worker) => ({
          ...worker._doc,
          WorkerBranchAdd: worker.WorkerBranchAdd.filter(
            (branch) =>
              branch === selectedWorkerBranch ||
              selectedWorkerBranch === "AllWorkerBranch"
          ),
        }))
      );
    } else {
      res.status(404).json({ error: "Worker not found" });
    }
  } catch (error) {
    console.error("Error fetching worker data:", error.message);
    res.status(500).json({ error: "Failed to fetch worker data" });
  }
});

// Worker Callback by Designation ----------------------------------------------------------------

router.get("/get-worker-designation/:designation", async (req, res) => {
  try {
    const selectedUser = req.params.designation;
    const designations = await AddWorker.find({ designation: selectedUser });

    if (designations.length > 0) {
      res.status(200).json(designations);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Worker Callback by Branch and Designation ----------------------------------------------------------------

router.get("/get-worker-branch-designation", async (req, res) => {
  try {
    const { branch, designation } = req.query;

    // Build the query object based on the provided parameters
    let query = {};

    if (branch) {
      if (branch === "AllUserBranch") {
        query.WorkerBranchAdd = { $size: 0 }; // Find users with an empty UserBranch array
      } else {
        query.WorkerBranchAdd = branch; // Filter by specific branch
      }
    }

    if (designation) {
      query.designation = designation; // Filter by specific designation
    }

    const users = await AddWorker.find(query);

    if (users.length > 0) {
      res.status(200).json(
        users.map((user) => ({
          ...user._doc,
          WorkerBranchAdd: user.WorkerBranchAdd.filter(
            (b) => b === branch || branch === "AllUserBranch"
          ),
        }))
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

//worker Update-----------------------------------------------------------------

router.put(
  "/worker-callback/:ID",
  upload.single("WorkerImage"),
  async (req, res) => {
    try {
      const workerID = req.params.ID; // This should be the ObjectId (_id)
      const updatedData = req.body;

      // If an image file is provided, upload it and add the URL to the updatedData
      if (req.file) {
        updatedData.image = req.file.path; // Cloudinary URL
      }

      // Find the worker by _id and update the data
      const updatedWorker = await AddWorker.findOneAndUpdate(
        { _id: workerID },
        { $set: updatedData },
        { new: true } // Return the updated document
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
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

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
