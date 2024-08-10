const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const AddWorker = require("./models/worker.model.js");
const Designation = require("./models/designation.model.js");
const OpenCenter = require("./models/center.model.js");
const OpenBranch = require("./models/branch.model.js");
const Member = require("./models/member.model.js");
const OpenSaving = require("./models/saving.model.js");
const InstallmentCollection = require("./models/installment.collection.model.js");
const SavingCollection = require("./models/saving.collection.model.js");
const Withdrawal = require("./models/withdraw.model.js");
const WorkerSalary = require("./models/salary.model.js");
const jwt = require("jsonwebtoken");
const Loan = require("./models/loan.model.js");
const User = require("./models/user.model.js");
const Credit = require("./models/credit.model.js");
const Debit = require("./models/debit.model.js");

const { ObjectId } = require("mongoose").Types;

require("dotenv").config();
const app = express();
app.use(express.json());
const port = 5000;
// app.use(cors({ origin: "https://ashalata.gandhipoka.com" }));
app.use(cors());
app.use(bodyParser.json());

// for loaclhost ---------------------------------------------------------

app.use(cors({ origin: "http://localhost:5173" }));

// database connection

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/jkssb", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
})();

// For Web Hosts --------------------------------------------------------

// const MONGODB_URI = `mongodb+srv://ashallota:Rajibkadir2203@ashalota.9okzvk9.mongodb.net/mongoMongooseTest?retryWrites=true&w=majority`;

// mongoose.connect(MONGODB_URI);
// mongoose.connection.on("connected", () => {
//   console.log("Connected to MongooseDB");
// });

// mongoose.connection.on("error", (err) => {
//   console.error(`MongooseDB connection error: ${err}`);
// });

// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading.
//     console.error("Multer Error:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   } else {
//     next(err);
//   }
// });

//----------------------------------------------------------------

// Sign up Start

//----------------------------------------------------------------

// API to sign up a new user
app.post("/signup", async (req, res) => {
  try {
    const { phoneNumber, username, password, designation, accountName } =
      req.body;

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if phone number is already taken
    const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
    if (existingUserByPhoneNumber) {
      return res.status(400).json({ message: "Phone number already taken" });
    }

    const newUser = new User({
      phoneNumber,
      username,
      password,
      designation,
      accountName,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", accountName });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------

// Sign up End

//----------------------------------------------------------------
//----------------------------------------------------------------

// Login Start

//----------------------------------------------------------------

// API to login a user
app.post("/login", async (req, res) => {
  const { loginInfo, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: loginInfo }, { phoneNumber: loginInfo }],
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      accountName: user.accountName,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//User Check-------------------------

// API to check if there are any users
app.get("/has-users", async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    res.status(200).json({ hasUsers: userCount > 0 });
  } catch (error) {
    console.error("Error checking user count:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------

// Worker Admission Satart

//----------------------------------------------------------------

//For Generate ID------------------------------------------
const generateWorkerID = async () => {
  const count = await AddWorker.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `W${paddedCount}`;
};

app.get("/workeradmission/count", async (req, res) => {
  try {
    const count = await AddWorker.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Worker Data------------------------------------------------

app.post("/workeradmission", async (req, res) => {
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
      agreementChecked,
    });
    await newWorker.save();
    res.status(201).json({ message: "Worker data saved successfully" });
  } catch (error) {
    console.error("Worker Admission Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker Callback--------------------------------------------------
app.get("/worker-callback", async (req, res) => {
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
    console.error("Worker Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Only Worker CallBack--------------------------------------------------------
app.get("/worker-callback-salary", async (req, res) => {
  try {
    const workers = await AddWorker.find({}, "workerID WorkerName Designation");

    res.json(workers);
  } catch (error) {
    console.error("Worker Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker ID get--------------------------------------------------------------

app.get("/worker-callback/:ID", async (req, res) => {
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
    console.error("worker Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker Callback by Center ----------------------------------------------------------------

app.get("/worker-callback-center", async (req, res) => {
  try {
    const WorkerCenterAdds = await AddWorker.find();

    // Send the retrieved dates as a response
    res.status(200).json(WorkerCenterAdds);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/worker-callback-center/:ID", async (req, res) => {
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

app.get("/worker-callback-branch", async (req, res) => {
  try {
    const branchs = await AddWorker.find();

    // Send the retrieved dates as a response
    res.status(200).json(branchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/worker-callback-branch/:WorkerBranchAdd", async (req, res) => {
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

app.put("/worker-callback/:ID", async (req, res) => {
  try {
    const workerID = req.params.ID; // Retrieve workerID from route parameter
    const query = { _id: new ObjectId(workerID) };
    const updatedData = req.body;

    const updatedWorker = await AddWorker.findOneAndUpdate(
      { _id: query },
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

// For wroker Salary--------------------------------------------

app.post("/save-worker-salary", async (req, res) => {
  const { salaryDate, data } = req.body;

  if (!data) {
    return res.status(400).json({ message: "No data provided" });
  }

  try {
    const updatePromises = data.map(async (item) => {
      const filter = { workerID: item.workerID };
      const update = {
        $set: {
          workerID: item.workerID,
          workerName: item.workerName,
          designation: item.designation,
        },
        $push: {
          month: item.month, // Ensure this is correct
          basic: item.basic,
          houseRent: item.houseRent,
          medAllow: item.medAllow,
          transAllow: item.transAllow,
          special: item.special,
          distance: item.distance,
          totalSalary: item.totalSalary,
          deameSlance: item.deameSlance,
          mobileBill: item.mobileBill,
          commission: item.commission,
          bonus: item.bonus,
          pf: item.pf,
          advance: item.advance,
          loan: item.loan,
          fsf: item.fsf,
          netPay: item.netPay,
          healthFund: item.healthFund,
          other: item.other,
          offGrt: item.offGrt,
          earned: item.earned,
          offPf: item.offPf,
          totalPF: item.totalPF,
          totalSalAndAllowances: item.totalSalAndAllowances,
          comment: item.comment,
        },
        $addToSet: { salaryDates: salaryDate },
      };
      const options = { upsert: true, new: true };
      return WorkerSalary.findOneAndUpdate(filter, update, options);
    });

    const docs = await Promise.all(updatePromises);
    res.status(200).json({ message: "Salary data saved successfully", docs });
  } catch (error) {
    console.error("Error saving salary data:", error);
    res
      .status(500)
      .json({ message: "Error saving salary data", error: error.message });
  }
});

// Salary Callback For Selected Month

app.get("/get-salary-data", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    const salaryData = await WorkerSalary.find({
      month: month,
    });

    res.status(200).json(salaryData);
  } catch (error) {
    console.error("Error fetching salary data:", error);
    res.status(500).json({ message: "Error fetching salary data" });
  }
});

// Salary Callback For Selected Worker and Selected Month ----------------------------------------------------------------
app.get("/worker-salary/:workerID/:month", async (req, res) => {
  const { workerID, month } = req.params;

  if (!workerID || !month) {
    return res.status(400).json({ message: "WorkerID and month are required" });
  }

  try {
    const workerSalary = await WorkerSalary.findOne({ workerID: workerID });

    if (workerSalary) {
      const monthIndex = workerSalary.month.indexOf(month);

      if (monthIndex !== -1) {
        const salaryData = {
          workerID: workerSalary.workerID,
          workerName: workerSalary.workerName,
          designation: workerSalary.designation,
          advance: workerSalary.advance[monthIndex],
          basic: workerSalary.basic[monthIndex],
          bonus: workerSalary.bonus[monthIndex],
          totalSalary: workerSalary.totalSalary[monthIndex],
          netPay: workerSalary.netPay[monthIndex],
          comment: workerSalary.comment[monthIndex],
          commission: workerSalary.commission[monthIndex],
          deameSlance: workerSalary.deameSlance[monthIndex],
          distance: workerSalary.distance[monthIndex],
          earned: workerSalary.earned[monthIndex],
          fsf: workerSalary.fsf[monthIndex],
          healthFund: workerSalary.healthFund[monthIndex],
          houseRent: workerSalary.houseRent[monthIndex],
          loan: workerSalary.loan[monthIndex],
          medAllow: workerSalary.medAllow[monthIndex],
          mobileBill: workerSalary.mobileBill[monthIndex],
          offGrt: workerSalary.offGrt[monthIndex],
          offPf: workerSalary.offPf[monthIndex],
          other: workerSalary.other[monthIndex],
          pf: workerSalary.pf[monthIndex],
          special: workerSalary.special[monthIndex],
          totalPF: workerSalary.totalPF[monthIndex],
          totalSalAndAllowances: workerSalary.totalSalAndAllowances[monthIndex],
          transAllow: workerSalary.transAllow[monthIndex],
          month: workerSalary.month, // Include the month array in the response
        };

        res.status(200).json(salaryData);
      } else {
        res
          .status(404)
          .json({ message: "No data found for the selected worker and month" });
      }
    } else {
      res
        .status(404)
        .json({ message: "No data found for the selected worker" });
    }
  } catch (error) {
    console.error("Error fetching salary data:", error);
    res.status(500).json({ message: "Error fetching salary data" });
  }
});

// For Saalry Update ----------------------------------------------------------------

app.put("/update-worker-salary", async (req, res) => {
  const { workerID, month, monthIndex, data } = req.body;

  if (!workerID || monthIndex === undefined || !data) {
    return res
      .status(400)
      .json({ message: "WorkerID, monthIndex, and data are required" });
  }

  try {
    const filter = { workerID: workerID };
    const update = {};

    // Create update operations for each field, specifically for the given month index
    Object.keys(data).forEach((field) => {
      const updateField = `${field}.${monthIndex}`;
      update[updateField] = data[field];
    });

    const updatedWorkerSalary = await WorkerSalary.findOneAndUpdate(
      filter,
      {
        $set: update,
      },
      { new: true }
    ); // Return the updated document

    if (!updatedWorkerSalary) {
      return res.status(404).json({ message: "Worker salary data not found" });
    }

    res.status(200).json({
      message: "Salary data updated successfully",
      updatedWorkerSalary,
    });
  } catch (error) {
    console.error("Error updating salary data:", error);
    res
      .status(500)
      .json({ message: "Error updating salary data", error: error.message });
  }
});

//----------------------------------------------------------------

// Worker Admission End

//----------------------------------------------------------------

//----------------------------------------------------------------

//  Designation Start

//----------------------------------------------------------------

// For Generate ID-------------------------------------------------------------------

const generateDesignationID = async () => {
  const count = await Designation.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `D${paddedCount}`;
};

app.get("/designation/count", async (req, res) => {
  try {
    const count = await Designation.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching Designation count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Designation Information-----------------------------------------------------
app.post("/designation", async (req, res) => {
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
app.get("/designation-callback", async (req, res) => {
  try {
    const DesignationIDs = await Designation.find();

    // Send the retrieved dates as a response
    res.status(200).json(DesignationIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/designation-callback/:ID", async (req, res) => {
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

//----------------------------------------------------------------

// Designation End

//----------------------------------------------------------------

//----------------------------------------------------------------

// Open Branch Start

//----------------------------------------------------------------

// For Generate ID

const generateBranchID = async () => {
  const count = await OpenBranch.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `B${paddedCount}`;
};

app.get("/openbranch/count", async (req, res) => {
  try {
    const count = await OpenBranch.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/openbranch", async (req, res) => {
  try {
    const { BranchName, BranchAddress, selectedManager, BranchMobile } =
      req.body;
    const BranchID = await generateBranchID();
    const newBranchApplication = new OpenBranch({
      BranchID,
      BranchName,
      BranchAddress,

      BranchMobile,
    });
    await newBranchApplication.save();
    res.status(201).json({ message: "Branch Create successfully" });
  } catch (error) {
    console.error("Branch Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch Callback----------------------------------------------------------------

app.get("/branch-callback", async (req, res) => {
  try {
    // Fetch all centers and return only CenterName
    const branchs = await OpenBranch.find(
      {},
      "BranchID BranchName BranchAddress  BranchMobile"
    );
    res.json(branchs);
  } catch (error) {
    console.error("Branch Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch ID Get--------------------------------------------------------

app.get("/branch-callback/:ID", async (req, res) => {
  try {
    const branchID = req.params.ID; // Retrieve BranchID from route parameter

    const query = { _id: new ObjectId(branchID) };

    const branch = await OpenBranch.findOne(
      query,
      " BranchID BranchName BranchAddress  BranchMobile"
    );

    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.error("Branch Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch Update
app.put("/branch-callback/:ID", async (req, res) => {
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

//----------------------------------------------------------------

// Open Branch End

//----------------------------------------------------------------

//----------------------------------------------------------------

// Open Center Start

//----------------------------------------------------------------

// For Generate ID -----------------------------------------------
const generateCenterID = async () => {
  const count = await OpenCenter.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `C${paddedCount}`;
};

app.get("/opencenter/count", async (req, res) => {
  try {
    const count = await OpenCenter.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Center Data------------------------------------------------------
app.post("/opencenter", async (req, res) => {
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
    const newCenterApplication = new OpenCenter({
      centerID,
      CenterName,
      CenterAddress,
      CenterMnumber,
      centerWorker,
      centerBranch,
      CenterDay,
    });
    await newCenterApplication.save();
    res.status(201).json({ message: "Center Create successfully" });
  } catch (error) {
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Center Callback---------------------------------------------------------------

app.get("/center-callback", async (req, res) => {
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
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Center Callback By CenterID------------------------------------------------

app.get("/center-callback-id/:center", async (req, res) => {
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

app.get("/center-callback/:ID", async (req, res) => {
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
    console.error("center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Center Callbacks by Branch----------------------------------------------------------------

app.get("/center-callback-by-branch", async (req, res) => {
  try {
    const BranchIDs = await OpenCenter.find();

    // Send the retrieved dates as a response
    res.status(200).json(BranchIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/center-callback-by-branch/:centerBranch", async (req, res) => {
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

app.get("/center-callback-by-CenterDay", async (req, res) => {
  try {
    const CenterDays = await OpenCenter.find();

    // Send the retrieved dates as a response
    res.status(200).json(CenterDays);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/center-callback-by-CenterDay/:CenterDay", async (req, res) => {
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
app.put("/center-callback/:ID", async (req, res) => {
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

//----------------------------------------------------------------

// Open Center End

//----------------------------------------------------------------

//----------------------------------------------------------------

// Open loan  Start

//-------------------------------------------------------------------

// For Generate ID
const generateLoanID = async (memberID) => {
  try {
    const count = await Loan.countDocuments({ memberID: memberID });
    const paddedCount = (count + 1).toString().padStart(2, "0");
    return `${memberID}L${paddedCount}`;
  } catch (error) {
    console.error("Error generating loan ID:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
};

app.get("/openloan/save-dates/count", async (req, res) => {
  try {
    const count = await Loan.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Loan Information----------------------------------------------------------------
app.post("/openloan/save-dates", async (req, res) => {
  try {
    const {
      memberID,
      OLname,
      fathername,
      OLbranch,
      OLcenter,
      OLmobile,
      loanType,
      OLamount,
      OLtotal,
      installment,
      withoutInterst,
      onlyInterest,
      macroloan,
      fromFee,
      CenterDay,
      installmentStart,
      nextDates,
      totalInstallment,
    } = req.body;

    const loanID = await generateLoanID(memberID);

    // Create a new document using the DateModel
    const dateDocument = new Loan({
      memberID,
      loanID,
      OLname,
      fathername,
      OLbranch,
      OLcenter,
      OLmobile,
      loanType,
      OLamount,
      OLtotal,
      installment,
      withoutInterst,
      onlyInterest,
      macroloan,
      fromFee,
      CenterDay,
      installmentStart,
      nextDates,
      totalInstallment,
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

// For installemt ----------------------------------------------------------------
app.get("/get-installmentDate", async (req, res) => {
  try {
    const dates = await Loan.find();

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/get-installmentDate/:center", async (req, res) => {
  try {
    const selectedCenter = req.params.center; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const dates = await Loan.find({ OLcenter: selectedCenter });

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Loan date callback----------------------------------------------------------------

app.get("/get-dates", async (req, res) => {
  try {
    const dates = await Loan.find();

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/get-dates/:nextDate", async (req, res) => {
  const nextDate = req.params.nextDate;

  try {
    // Retrieve documents from the DateModel collection where nextDate array contains the provided value
    const dates = await Loan.find(
      { nextDates: { $in: [nextDate] } },
      {
        _id: 0,
        OLname: 1,
        memberID: 1,
        loanID: 1,
        fathername: 1,
        OLbranch: 1,
        OLcenter: 1,
        OLmobile: 1,
        loanType: 1,
        OLamount: 1,
        OLtotal: 1,
        installment: 1,
        withoutInterst: 1,
        onlyInterest: 1,
        totalInstallment: 1,
        CenterDay: 1,
        macroloan: 1,
        selectedDate: 1,
        nextDates: { $elemMatch: { $eq: nextDate } },
      }
    );

    if (dates.length === 0) {
      res
        .status(404)
        .json({ error: "No dates found for the provided nextDate" });
    } else {
      // Send the retrieved dates as a response
      res.status(200).json(dates);
    }
  } catch (error) {
    // If an error occurs during the retrieval process, send an error response
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//get microLoan Callback by center and date ---------------------------------------------------------------------

app.get("/sum-macroloan/:OLcenter/:createdAt", async (req, res) => {
  try {
    const { OLcenter, createdAt } = req.params;

    // Create a date range for the entire day
    const startOfDay = new Date(createdAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(createdAt);
    endOfDay.setHours(23, 59, 59, 999);

    // Find documents matching the provided OLcenter and createdAt within the day range
    const loans = await Loan.find({
      OLcenter: OLcenter,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Calculate the sum of macroloan values
    const sumMacroloan = loans.reduce((sum, loan) => sum + loan.macroloan, 0);
    const sumfromFee = loans.reduce((sum, loan) => sum + loan.fromFee, 0);

    // Send the result as a JSON response
    res.status(200).json({ sumMacroloan, sumfromFee });
  } catch (error) {
    console.error("Error fetching macroloan data:", error.message);
    res.status(500).json({ error: "Failed to fetch macroloan data" });
  }
});

//Loan Callback by LoanID------------------------------------------------

app.get("/get-loan-loanid/:loanID", async (req, res) => {
  try {
    const selectedLoan = req.params.loanID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const LoanIDs = await Loan.find({
      loanID: selectedLoan,
    });

    // Send the retrieved dates as a response
    res.status(200).json(LoanIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Loan Callback by MemberID------------------------------------------------

app.get("/get-loan-MemberID/:memberID", async (req, res) => {
  try {
    const selectedmemberID = req.params.memberID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected MemberID
    const memberIDs = await Loan.find({
      memberID: selectedmemberID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(memberIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Just Loan Call Back----------------------------------------------------
app.get("/loan-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // If center parameter is provided, filter loans by center
    const query = center ? { OLcenter: center } : {};

    const loans = await Loan.find(
      query,
      "memberID loanID OLname fathername OLbranch OLcenter OLmobile loanType installmentStart OLamount  CenterDay OLtotal totalInstallment macroloan"
    );

    res.json(loans);
  } catch (error) {
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Loan Calback by Branch----------------------------------------------------

app.get("/loan-callback-by-branch", async (req, res) => {
  try {
    const OLbranchs = await Loan.find();

    // Send the retrieved dates as a response
    res.status(200).json(OLbranchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/loan-callback-by-branch/:OLbranch", async (req, res) => {
  try {
    const selectedID = req.params.OLbranch; //

    // Filter documents based on the selected ID
    const OLbranchs = await Loan.find({
      OLbranch: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(OLbranchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Loan Update-----------------------------------------

app.put("/loan-callback/:ID", async (req, res) => {
  try {
    const loanID = req.params.ID; // Retrieve loanID from route parameter
    const query = { _id: new ObjectId(loanID) };
    const updatedData = req.body;

    const updatedLoan = await Loan.findOneAndUpdate(
      { _id: query },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedLoan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }

    res.json({
      success: true,
      message: "Loan updated successfully",
      updatedLoan,
    });
  } catch (error) {
    console.error("Loan Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------

// Open loan  End

//-------------------------------------------------------------------

//----------------------------------------------------------------

//Installment Collection Start

//-------------------------------------------------------------------
app.post("/save-installments-collection", async (req, res) => {
  const { centerName, installmentDate, data } = req.body;

  try {
    const updatePromises = data.map(async (item) => {
      const filter = { loanID: item.loanID, memberID: item.memberID };
      const update = {
        $set: {
          loanID: item.loanID,
          memberID: item.memberID,
          OLname: item.OLname,
          OLmobile: item.OLmobile,
          loanType: item.loanType,
          installment: item.installment,
          onlyInterest: item.onlyInterest,
          centerName: centerName,
        },
        $addToSet: { installmentDate: installmentDate },
      };
      const options = { upsert: true, new: true };
      return InstallmentCollection.findOneAndUpdate(filter, update, options);
    });

    const docs = await Promise.all(updatePromises);
    res.status(200).json({ message: "Data saved successfully", docs });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
});

// data update from other page (OfficeCollection) ---------------------------------------

app.patch("/update-installments-collection/:loanID", async (req, res) => {
  const { loanID } = req.params;
  const { installmentDate } = req.body;

  if (!loanID || !installmentDate) {
    return res
      .status(400)
      .send("Bad Request: Missing loanID or installmentDate");
  }

  try {
    // Update the document by pushing the new date into the array
    const updatedDocument = await InstallmentCollection.findOneAndUpdate(
      { loanID: loanID },
      { $addToSet: { installmentDate: installmentDate } }, // Add new date to the array if it doesn't exist
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).send("Document not found");
    }

    res.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error); // Log the error for debugging
    res.status(500).send(`Error: ${error.message}`);
  }
});

//Total instalment Date count--------------------------------

app.get("/installment-dates-count", async (req, res) => {
  try {
    const results = await InstallmentCollection.aggregate([
      {
        $project: {
          loanID: 1,
          memberID: 1,
          OLname: 1,
          OLmobile: 1,
          loanType: 1,
          installment: 1,
          centerName: 1,

          installmentDateCount: { $size: "$installmentDate" },
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.get("/installment-dates-count/:loanID", async (req, res) => {
  const loanID = req.params.loanID;

  try {
    const results = await InstallmentCollection.aggregate([
      { $match: { loanID: loanID } },
      {
        $project: {
          loanID: 1,
          memberID: 1,
          OLname: 1,
          OLmobile: 1,
          loanType: 1,
          installment: 1,
          centerName: 1,

          installmentDateCount: { $size: "$installmentDate" },
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Installment Collection Date ----------------------------------------------------------------

app.get("/installment-collection-dates", async (req, res) => {
  try {
    const dates = await InstallmentCollection.find();

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/installment-collection-dates/:installmentDate", async (req, res) => {
  const installmentDate = req.params.installmentDate;

  try {
    // Retrieve documents where installmentDate array contains the provided value
    const dates = await InstallmentCollection.find(
      { installmentDates: { $in: [installmentDate] } },
      {
        loanID: 1,
        memberID: 1,
        OLname: 1,
        OLmobile: 1,
        loanType: 1,
        installment: 1,
        centerName: 1,

        installmentDates: { $elemMatch: { $eq: installmentDate } },
      }
    );

    // Check if no dates are found
    if (dates.length === 0) {
      res
        .status(404)
        .json({ error: "No dates found for the provided installmentDate" });
    }

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Callback All date --------------------------------
app.get("/loan-collection-date/:loanID", async (req, res) => {
  const { loanID } = req.params;

  try {
    const LoanDetails = await InstallmentCollection.findOne({ loanID });

    if (LoanDetails) {
      res.status(200).json({
        message: "Saving details retrieved successfully",
        LoanDetails,
      });
    } else {
      res
        .status(404)
        .json({ message: "No document found with the given loanID" });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

// Loan Collection data by Center and Date-------------------------------------

const loanTypeTranslations = {
  normal: "সাধারণ ঋণ",
  tubewell: "নলকূপ ঋণ",
  farmer: "কৃষি ঋণ",
  sme: "এস এম ই ঋণ",
  emergency: "জরুরী ঋণ",
  disaster: "দুর্যোগ ঋণ",
  daily: "দৈনিক ঋণ",
};

app.get("/loan-collection-by-center/:centerName/:date", async (req, res) => {
  try {
    const { centerName, date } = req.params;

    // Find all loans collections for the given center
    const loans = await InstallmentCollection.find({ centerName });

    // Initialize an object to keep the sum of the installments for each loan type
    const loanTypeSums = {};
    Object.keys(loanTypeTranslations).forEach((key) => {
      loanTypeSums[loanTypeTranslations[key]] = 0;
    });

    // Loop through each loan collection
    for (const loan of loans) {
      // Find the index of the specified date in installmentDate array
      const dateIndex = loan.installmentDate.indexOf(date);

      // If the date is found, add the corresponding value from installment to the sum
      if (dateIndex !== -1) {
        const loanType = loan.loanType;
        if (loanTypeSums[loanType] !== undefined) {
          loanTypeSums[loanType] += parseFloat(loan.installment);
        }
      }
    }

    // Send the loan type sums as a response
    res.status(200).json(loanTypeSums);
  } catch (error) {
    console.error("Error fetching loans data:", error.message);
    res.status(500).json({ error: "Failed to fetch loans data" });
  }
});

// onlyInterest Collection data by Center and Date-------------------------------------

app.get(
  "/interest-collection-by-center/:centerName/:date",
  async (req, res) => {
    try {
      const { centerName, date } = req.params;

      // Find all loans collections for the given center
      const loans = await InstallmentCollection.find({ centerName });

      // Initialize the sum of onlyInterest
      let totalInterest = 0;

      // Loop through each loan collection
      for (const loan of loans) {
        // Find the index of the specified date in installmentDate array
        const dateIndex = loan.installmentDate.indexOf(date);

        // If the date is found, add the corresponding value of onlyInterest to the sum
        if (dateIndex !== -1) {
          totalInterest += parseFloat(loan.onlyInterest);
        }
      }

      // Send the total interest as a response
      res.status(200).json({ totalInterest });
    } catch (error) {
      console.error("Error fetching loans data:", error.message);
      res.status(500).json({ error: "Failed to fetch loans data" });
    }
  }
);

//----------------------------------------------------------------

//Installment Collection End

//-------------------------------------------------------------------

//----------------------------------------------------------------

//Saving Start

//-------------------------------------------------------------------

// Function to generate unique Saving ID
// const generateSavingID = async (memberID) => {
//   try {
//     const count = await OpenSaving.countDocuments({ memberID });
//     const paddedCount = (count + 1).toString().padStart(2, "0");
//     return `${memberID}S${paddedCount}`;
//   } catch (error) {
//     console.error("Error generating saving ID:", error.message);
//     throw error;
//   }
// };

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
app.get("/opensaving/count", async (req, res) => {
  try {
    const count = await OpenSaving.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching saving count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/opensaving", async (req, res) => {
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

app.get("/saving-callback", async (req, res) => {
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
app.get("/get-saving-savingid/:SavingID", async (req, res) => {
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

app.get("/saving-callback-center/:center", async (req, res) => {
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

app.get("/savingtype-callback/:SavingType", async (req, res) => {
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

app.get("/saving-callback-memberid/:memberID", async (req, res) => {
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

app.get("/saving-callback-by-branch", async (req, res) => {
  try {
    const SavingBranchs = await OpenSaving.find();

    // Send the retrieved dates as a response
    res.status(200).json(SavingBranchs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/saving-callback-by-branch/:SavingBranch", async (req, res) => {
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

app.put("/saving-callback/:ID", async (req, res) => {
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

//----------------------------------------------------------------

//Saving End

//-------------------------------------------------------------------

//----------------------------------------------------------------

// Saving Collection Start

//----------------------------------------------------------------

app.post("/save-savings-collection", async (req, res) => {
  const { centerName, savingDate, data } = req.body;

  try {
    const updatePromises = data.map(async (item) => {
      const filter = { savingID: item.SavingID, memberID: item.memberID };
      const update = {
        $set: {
          savingID: item.SavingID,
          memberID: item.memberID,
          savingName: item.SavingName,
          savingMobile: item.SavingMobile,
          centerName: centerName,
          savingType: item.SavingType,
          savingTime: item.SavingTime,
          savingAmount: item.SavingAmount,
        },
        $push: {
          savingCollecting: item.SavingCollecting,
        },
        $addToSet: { savingCollectionDate: savingDate },
      };
      const options = { upsert: true, new: true };
      return SavingCollection.findOneAndUpdate(filter, update, options);
    });

    const docs = await Promise.all(updatePromises);
    res.status(200).json({ message: "Data saved successfully", docs });
  } catch (error) {
    console.error("Error saving data:", error);
    res
      .status(500)
      .json({ message: "Error saving data", error: error.message });
  }
});

app.patch("/update-savings-collection/:savingID", async (req, res) => {
  const { savingID } = req.params;
  const { savingCollectionDate, savingCollecting } = req.body;

  if (!savingID || !savingCollectionDate || savingCollecting === undefined) {
    return res
      .status(400)
      .send(
        "Bad Request: Missing savingID, savingCollectionDate, or savingCollecting"
      );
  }

  try {
    // Update the document by adding the new date to the array if it doesn't exist
    const updatedDocument = await SavingCollection.findOneAndUpdate(
      { savingID: savingID },
      {
        $addToSet: { savingCollectionDate: savingCollectionDate }, // Add new date to the array if it doesn't exist
        $push: { savingCollecting: savingCollecting }, // Add new collecting value to the array
      },
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).send("Document not found");
    }

    res.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error); // Log the error for debugging
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Toal Saving Calculation--------------- ----------------

app.get("/saving-collection-total/:savingID", async (req, res) => {
  const { savingID } = req.params;

  try {
    const result = await SavingCollection.aggregate([
      { $match: { savingID } },
      {
        $project: {
          totalSavingCollecting: {
            $sum: {
              $map: {
                input: "$savingCollecting",
                as: "collecting",
                in: { $toDouble: "$$collecting" },
              },
            },
          },
        },
      },
    ]);

    if (result.length > 0) {
      res.status(200).json({
        message: "Sum of savingCollecting retrieved successfully",
        total: result[0].totalSavingCollecting,
      });
    } else {
      res
        .status(404)
        .json({ message: "No document found with the given savingID" });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

// Callback All date and Amount --------------------------------
app.get("/saving-collection-date-amount/:savingID", async (req, res) => {
  const { savingID } = req.params;

  try {
    const savingDetails = await SavingCollection.findOne({ savingID });

    if (savingDetails) {
      res.status(200).json({
        message: "Saving details retrieved successfully",
        savingDetails,
      });
    } else {
      res
        .status(404)
        .json({ message: "No document found with the given savingID" });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

// Saving Collection Callback By Center and Date --------------------------------

app.get("/saving-collection-by-center/:centerName/:date", async (req, res) => {
  try {
    const { centerName, date } = req.params;

    // Find all savings collections for the given center
    const savings = await SavingCollection.find({ centerName });

    // Initialize a variable to keep the sum of the savings
    let sum = 0;

    // Loop through each saving collection
    for (const saving of savings) {
      // Find the index of the specified date in savingCollectionDate array
      const dateIndex = saving.savingCollectionDate.indexOf(date);

      // If the date is found, add the corresponding value from savingCollecting to the sum
      if (dateIndex !== -1) {
        sum += parseFloat(saving.savingCollecting[dateIndex]);
      }
    }

    // Send the sum as a response
    res.status(200).json({ totalSavings: sum });
  } catch (error) {
    console.error("Error fetching savings data:", error.message);
    res.status(500).json({ error: "Failed to fetch savings data" });
  }
});

//----------------------------------------------------------------

// Saving Withdrawing ----------------------------------------------------------------

//----------------------------------------------------------------

// POST request to save withdrawal data
app.post("/saving-withdraw", async (req, res) => {
  try {
    const data = req.body;

    // Convert empty string values to 0
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key] = data[key].map((value) => (value === "" ? 0 : value));
      } else {
        data[key] = data[key] === "" ? 0 : data[key];
      }
    });

    const { savingID, memberID } = data;

    const filter = { savingID, memberID };
    const update = {
      $set: {
        savingID: data.savingID,
        memberID: data.memberID,
        SavingName: data.SavingName,
        fathername: data.fathername,
        SavingBranch: data.SavingBranch,
        SavingCenter: data.SavingCenter,
        SavingMobile: data.SavingMobile,
        SavingType: data.SavingType,
        SavingTime: data.SavingTime,
      },
      $push: {
        SavingCurrentBlance: { $each: data.SavingCurrentBlance },
        withdrawDate: { $each: data.withdrawDate },
        totalSavingAmount: { $each: data.totalSavingAmount },
        withDrawAmount: { $each: data.withDrawAmount },
        calculatedInterest: { $each: data.calculatedInterest },
      },
    };
    const options = { upsert: true, new: true };

    const doc = await Withdrawal.findOneAndUpdate(filter, update, options);
    res.status(200).json({ message: "Withdrawal successful!", doc });
  } catch (error) {
    console.error("Error in withdrawal process:", error);
    res.status(500).send({ message: "Error in withdrawal process" });
  }
});

// GET request to fetch saving details including the last withdrawal amount
app.get("/get-withDrawAmount-savingid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const saving = await Withdrawal.findOne({ savingID: id });

    if (saving) {
      const lastWithdrawAmount = saving.withDrawAmount
        ? saving.withDrawAmount[saving.withDrawAmount.length - 1]
        : 0;
      res.status(200).json({ ...saving._doc, lastWithdrawAmount });
    } else {
      res.status(404).send({ message: "Saving not found" });
    }
  } catch (error) {
    console.error("Error fetching saving details:", error);
    res.status(500).send({ message: "Error fetching saving details" });
  }
});

//----------------------------------------------------------------

// Saving Collection End

//----------------------------------------------------------------

//----------------------------------------------------------------

// member admission Start

//----------------------------------------------------------------

// For Generate ID
const generateMemberID = async () => {
  const count = await Member.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `M${paddedCount}`;
};

app.get("/memberdmission/count", async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Member Data ----------------------------------------------------

app.post("/memberdmission", async (req, res) => {
  try {
    const memberData = req.body;
    const memberID = await generateMemberID();
    memberData.agreementChecked = memberData.agreementChecked === "true";
    memberData.memberID = memberID;

    const newMember = new Member(memberData);

    await newMember.save();
    res.status(201).json({ message: "Member data saved successfully" });
  } catch (error) {
    console.error("Error saving member data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//member callback-------------------------------

app.get("/member-callback", async (req, res) => {
  try {
    const selectedCenter = req.query.selectedCenter;
    const selectedNID = req.query.selectedNID;
    let query = {};

    if (selectedCenter) {
      query = { CenterIDMember: selectedCenter };
    }
    if (selectedNID) {
      query.MemberNIDnumber = selectedNID;
    }
    const members = await Member.find(
      query,
      "BranchMember  CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizaiotnloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee "
    );
    res.json(members);
  } catch (error) {
    console.error("Member Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Member ID Get----------------------------------------------------------------

app.get("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };

    const member = await Member.findOne(
      query,
      "BranchMember CenterIDMember CenterNameMember memberID AdmissionDate memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizationloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation AdmissionFee FormFee"
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error("Member Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Member Callback By selected Branch --------------------------------

app.get("/member-callback-by-branch", async (req, res) => {
  try {
    const BranchMembers = await Member.find();

    // Send the retrieved dates as a response
    res.status(200).json(BranchMembers);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

app.get("/member-callback-by-branch/:BranchMember", async (req, res) => {
  try {
    const selectedID = req.params.BranchMember; //

    // Filter documents based on the selected ID
    const BranchMembers = await Member.find({
      BranchMember: selectedID,
    });

    // Send the retrieved dates as a response
    res.status(200).json(BranchMembers);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//get-AdmissionFee-by-center-and-date

app.get(
  "/get-AdmissionFee-by-center-and-date/:CenterIDMember/:AdmissionDate",
  async (req, res) => {
    try {
      const { CenterIDMember, AdmissionDate } = req.params;

      // Find documents matching the provided OLcenter and AdmissionDate
      const AdmissionFees = await Member.find({
        CenterIDMember: CenterIDMember,
        AdmissionDate: AdmissionDate,
      });

      // Calculate the sum of macroloan values
      const sumAdmissionFees = AdmissionFees.reduce(
        (sum, member) => sum + member.AdmissionFee,
        0
      );
      // Calculate the sum of macroloan values
      const sumFormFee = AdmissionFees.reduce(
        (sum, member) => sum + member.FormFee,
        0
      );

      // Send the result as a JSON response
      res.status(200).json({ sumAdmissionFees, sumFormFee });
    } catch (error) {
      console.error("Error fetching macroloan data:", error.message);
      res.status(500).json({ error: "Failed to fetch macroloan data" });
    }
  }
);

//Member Update-----------------------------------------

app.put("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };
    const updatedData = req.body;

    console.log("Update Query:", query);
    console.log("Updated Data:", updatedData); // Check if CenterMember is present

    const updatedMember = await Member.findOneAndUpdate(
      query,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      updatedMember,
    });
  } catch (error) {
    console.error("Member Update Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------

// member admission End

//----------------------------------------------------------------

//----------------------------------------------------------------

// Voucher Start

//----------------------------------------------------------------

const saveData = async (Model, data) => {
  try {
    const { productCode, productName, sellCost, comment, date, branch } = data; // Include branch in destructuring

    const existingDocument = await Model.findOne({ productCode });

    if (existingDocument) {
      existingDocument.sellCost.push(sellCost);
      existingDocument.comment.push(comment);
      existingDocument.date.push(date);
      existingDocument.branch = branch; // Update the branch field if necessary
      await existingDocument.save();
    } else {
      const newDocument = new Model({
        productCode,
        productName,
        sellCost: [sellCost],
        comment: [comment],
        date: [date],
        branch, // Include branch in the new document
      });
      await newDocument.save();
    }

    return { status: 200, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

app.post("/save-debit", async (req, res) => {
  const result = await saveData(Debit, req.body);
  res.status(result.status).json({ message: result.message });
});

app.post("/save-credit", async (req, res) => {
  const result = await saveData(Credit, req.body);
  res.status(result.status).json({ message: result.message });
});

// Find ALl data By Date----------------------------------------------------------------

const findDataByDateAndBranch = async (Model, date, branch) => {
  try {
    // Find documents matching the branch
    const documents = await Model.find({ branch });

    // Iterate over all documents to find matching date
    const results = documents
      .map((doc) => {
        const dateIndex = doc.date.findIndex((d) => d === date);

        // If the date is found, return the sellCost and comment at that index
        if (dateIndex !== -1) {
          return {
            productCode: doc.productCode,
            productName: doc.productName,
            branch: doc.branch,
            sellCost: doc.sellCost[dateIndex],
            comment: doc.comment[dateIndex],
            date: doc.date[dateIndex],
          };
        } else {
          return null; // Date not found in this document
        }
      })
      .filter((result) => result !== null); // Filter out null results

    if (results.length === 0) {
      return {
        status: 404,
        message: "No data found for the specified date and branch",
      };
    }

    return { status: 200, data: results };
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

app.get("/find-data-by-date-branch", async (req, res) => {
  const { date, branch } = req.query; // Use query parameters for date and branch

  const debitData = await findDataByDateAndBranch(Debit, date, branch);
  const creditData = await findDataByDateAndBranch(Credit, date, branch);

  if (debitData.status === 404 && creditData.status === 404) {
    res
      .status(404)
      .json({ message: "No data found for the specified date and branch" });
  } else if (debitData.status === 500 || creditData.status === 500) {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    res.status(200).json({
      debitData: debitData.data,
      creditData: creditData.data,
    });
  }
});

// Update data by Date----------------------------------------------------------------

const updateData = async (Model, data) => {
  try {
    const { productCode, sellCost, comment, date } = data;

    const existingDocument = await Model.findOne({ productCode });

    if (!existingDocument) {
      return { status: 404, message: "Document not found" };
    }

    const dateIndex = existingDocument.date.findIndex(
      (storedDate) => storedDate === date
    );

    if (dateIndex !== -1) {
      existingDocument.sellCost[dateIndex] = sellCost;
      existingDocument.comment[dateIndex] = comment;
    } else {
      existingDocument.sellCost.push(sellCost);
      existingDocument.comment.push(comment);
      existingDocument.date.push(date);
    }

    await existingDocument.save();
    return { status: 200, message: "Data updated successfully" };
  } catch (error) {
    console.error("Error updating data:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

app.put("/update-data", async (req, res) => {
  const { productCode } = req.body;
  let Model;

  if (
    [
      "1205",
      "1206",
      "1207",
      "1208",
      "1209",
      "1210",
      "1211",
      "1212",
      "1213",
      "1214",
      "1215",
      "1216",
      "1217",
      "1218",
      "1219",
      "1220",
      "1221",
      "1222",
      "1223",
      "1224",
      "1225",
      "1226",
      "1227",
      "1228",
      "1229",
    ].includes(productCode)
  ) {
    Model = Debit;
  } else {
    Model = Credit;
  }

  const result = await updateData(Model, req.body);

  res.status(result.status).json({ message: result.message });
});

//----------------------------------------------------------------

// Voucher End

//----------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`expresss running on port ${port}`);
});
