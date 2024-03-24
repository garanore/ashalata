const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("./models/user.model.js");
const OpenCenter = require("./models/center.model.js");
const OpenBranch = require("./models/branch.model.js");
const OpenLoan = require("./models/openloan.model.js");
const AddWorker = require("./models/worker.model.js");
const addOfficeWorker = require("./models/officeWorker.model.js");
const Member = require("./models/member.model.js");
const OpenSaving = require("./models/saving.model.js");
const Installment = require("./models/installment.model.js");

const { ObjectId } = require("mongoose").Types;

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// eslint-disable-next-line no-undef
const port = process.env.PORT || 9000;

// for loaclhost ---------------------------------------------------------

app.use(cors({ origin: "http://localhost:5173" }));

// database connection

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/jkssb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
})();

//for server----------------------------------------------------------

// app.use(cors({ origin: "https://ashalata.gandhipoka.com" }));

// const MONGODB_URI = `mongodb+srv://ashallota:Rajibkadir2203@ashalota.9okzvk9.mongodb.net/mongoMongooseTest?retryWrites=true&w=majority`;

// mongoose.connect(MONGODB_URI);
// mongoose.connection.on("connected", () => {
//   console.log("Connected to MongooseDB");
// });

// mongoose.connection.on("error", (err) => {
//   console.error(`MongooseDB connection error: ${err}`);
// });

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    console.error("Multer Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } else {
    next(err);
  }
});

//----------------------------------------------------------------

// Sign up Start

//----------------------------------------------------------------

app.post("/signup", async (req, res) => {
  try {
    const { phoneNumber, username, password, rank } = req.body;
    const newUser = new User({
      phoneNumber,
      username,
      password,
      rank,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//----------------------------------------------------------------

// WorkerAdmission section Start

//----------------------------------------------------------------

const generateWorkerID = async () => {
  const count = await AddWorker.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `W${paddedCount}`;
};
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
      agreementChecked,
    });
    await newWorker.save();
    res.status(201).json({ message: "Worker data saved successfully" });
  } catch (error) {
    console.error("Worker Admission Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker Callback
app.get("/worker-callback", async (req, res) => {
  try {
    const selectedBranch = req.query.selectedBranch;
    let query = {};
    if (selectedBranch) {
      query = { WorkerBranchAdd: selectedBranch };
    }
    const workers = await AddWorker.find(
      query,
      "workerID WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd Designation agreementChecked"
    );

    res.json(workers);
  } catch (error) {
    console.error("Worker Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Worker ID get

app.get("/worker-callback/:ID", async (req, res) => {
  try {
    const workerID = req.params.ID; // Retrieve workerID from route parameter
    const query = { _id: new ObjectId(workerID) };

    const worker = await AddWorker.findOne(
      query,
      "workerID WorkerName WorkerParent WdateOfBirth WorkerJob WorkerHome WorkerUnion WorkerPost WorkerSubDic WorkerDic WorkerMarital WorkerStudy WorkerNID WorkerMobile WorkerMail Workerimage WorkerCenterAdd WorkerBranchAdd agreementChecked"
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

//worker Update

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

//----------------------------------------------------------------

//Office Worker Start
//----------------------------------------------------------------

const generateOfficeWorkerID = async () => {
  const count = await addOfficeWorker.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `OW${paddedCount}`;
};

app.post("/OfficeWorkerAdd", async (req, res) => {
  try {
    const {
      officeWorkerName,
      OfficeWorkerParent,
      OfficeWorkerJob,
      officeWorkerHome,
      OfficeWorkerUnion,
      OfficeWdateOfBirth,
      officeWorkerPost,
      OfficeWorkerSubDic,
      OfficeWorkerDic,
      OfficeWorkerMarital,
      OfficeWorkerStudy,
      OfficeWorkerNID,
      OfficeWorkerMobile,
      OfficeWorkerMail,
      OfficeWorkerCenter,
      OfficeWorkerBranch,
      Designation,
      agreementChecked,
    } = req.body;
    const officeworkerID = await generateOfficeWorkerID();
    const newOfficeWorker = new addOfficeWorker({
      officeworkerID,
      officeWorkerName,
      OfficeWorkerParent,
      OfficeWorkerJob,
      officeWorkerHome,
      OfficeWorkerUnion,
      OfficeWdateOfBirth,
      officeWorkerPost,
      OfficeWorkerSubDic,
      OfficeWorkerDic,
      OfficeWorkerMarital,
      OfficeWorkerStudy,
      OfficeWorkerNID,
      OfficeWorkerMobile,
      OfficeWorkerMail,
      OfficeWorkerCenter,
      OfficeWorkerBranch,
      Designation,
      agreementChecked,
    });
    await newOfficeWorker.save();
    res.status(201).json({ message: "Office Worker data saved successfully" });
  } catch (error) {
    console.error("Office Worker Admission Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Open Branch Start

//----------------------------------------------------------------

const generateBranchID = async () => {
  const count = await OpenBranch.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `B${paddedCount}`;
};
app.post("/openbranch", async (req, res) => {
  try {
    const { BranchName, BranchAddress, selectedManager, BranchMobile } =
      req.body;
    const BranchID = await generateBranchID();
    const newBranchApplication = new OpenBranch({
      BranchID,
      BranchName,
      BranchAddress,
      selectedManager,
      BranchMobile,
    });
    await newBranchApplication.save();
    res.status(201).json({ message: "Branch Create successfully" });
  } catch (error) {
    console.error("Branch Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch Callback
app.get("/branch-callback", async (req, res) => {
  try {
    // Fetch all centers and return only CenterName
    const branchs = await OpenBranch.find(
      {},
      "BranchID BranchName BranchAddress selectedManager BranchMobile"
    );
    res.json(branchs);
  } catch (error) {
    console.error("Branch Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Branch ID Get

app.get("/branch-callback/:ID", async (req, res) => {
  try {
    const branchID = req.params.ID; // Retrieve BranchID from route parameter
    const query = { _id: new ObjectId(branchID) };

    const branch = await OpenBranch.findOne(
      query,
      " BranchID BranchName BranchAddress selectedManager BranchMobile"
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

// Open Branch End

//----------------------------------------------------------------

// Open Center Start

//----------------------------------------------------------------

const generateCenterID = async () => {
  const count = await OpenCenter.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `C${paddedCount}`;
};

app.post("/opencenter", async (req, res) => {
  try {
    const {
      CenterName,
      AddressCenter,
      CenterMnumber,
      centerWorker,
      centerBranch,
    } = req.body;
    const centerID = await generateCenterID();
    const newCenterApplication = new OpenCenter({
      centerID,
      CenterName,
      AddressCenter,
      CenterMnumber,
      centerWorker,
      centerBranch,
    });
    await newCenterApplication.save();
    res.status(201).json({ message: "Center Create successfully" });
  } catch (error) {
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Center Callback
app.get("/center-callback", async (req, res) => {
  try {
    const selectedBranch = req.query.selectedBranch;

    let query = {}; // Default query (no filtering)

    if (selectedBranch) {
      query = { centerBranch: selectedBranch };
    }

    const centers = await OpenCenter.find(
      query,
      "centerID CenterName AddressCenter CenterMnumber centerWorker centerBranch"
    );

    res.json(centers);
  } catch (error) {
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Center ID Get

app.get("/center-callback/:ID", async (req, res) => {
  try {
    const centerID = req.params.ID; // Retrieve centerID from route parameter
    const query = { _id: new ObjectId(centerID) };

    const center = await OpenCenter.findOne(
      query,
      " centerID CenterName AddressCenter CenterMnumber centerWorker centerBranch"
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

//Center Update
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

// Open Center End

//----------------------------------------------------------------

// Open loan  Start

//----------------------------------------------------------------

const generateLoanID = async () => {
  try {
    const count = await OpenLoan.countDocuments();
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `L${paddedCount}`;
  } catch (error) {
    console.error("Error generating loan ID:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
};

app.post("/openloan", async (req, res) => {
  try {
    const { memberID, selectedMember, loanType, OLamount, OLtotal } = req.body;
    const loanID = await generateLoanID();

    // Calculate installment amount
    const loanAmount = parseFloat(OLamount); // Convert to number if necessary
    const weeks = 41; // Assuming 41 weeks
    const installmentAmount = loanAmount / weeks;

    // Save loan application data
    const newLoanApplication = new OpenLoan({
      memberID,
      loanID,
      OLname: selectedMember.memberName,
      fathername: selectedMember.MfhName,
      OLbranch: selectedMember.BranchMember,
      OLcenter: selectedMember.CenterMember,
      OLmobile: selectedMember.MemberMobile,
      loanType,
      OLamount,
      OLtotal,
    });
    await newLoanApplication.save();

    // Save installment details
    for (let i = 1; i <= weeks; i++) {
      const newInstallment = new Installment({
        center: selectedMember.CenterMember,
        memberName: selectedMember.memberName,
        mobile: selectedMember.MemberMobile,
        loanType,
        amount: installmentAmount,
        week: i,
      });
      await newInstallment.save();
    }

    res
      .status(201)
      .json({ message: "Loan application data saved successfully" });
  } catch (error) {
    console.error("Loan Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/loan-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // If center parameter is provided, filter loans by center
    const query = center ? { OLcenter: center } : {};

    const loans = await OpenLoan.find(
      query,
      "memberID loanID OLname fathername OLbranch OLcenter OLmobile loanType OLamount OLtotal"
    );

    res.json(loans);
  } catch (error) {
    console.error("Center Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Open loan  End

//----------------------------------------------------------------

//Saving Start

//----------------------------------------------------------------

const generateSavingID = async () => {
  try {
    const count = await OpenSaving.countDocuments();
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `S${paddedCount}`;
  } catch (error) {
    console.error("Error generating saving ID:", error.message);
    throw error;
  }
};

app.post("/opensaving", async (req, res) => {
  try {
    const { memberID, selectedMember, savingType, Samount, timePeriod } =
      req.body;
    const savingID = await generateSavingID();

    const newSavingApplication = new OpenSaving({
      memberID,
      savingID,
      OSname: selectedMember.memberName,
      fathername: selectedMember.MfhName,
      OSbranch: selectedMember.BranchMember,
      OScenter: selectedMember.CenterMember,
      OSmobile: selectedMember.MemberMobile,
      savingType,
      timePeriod,
      Samount,
    });

    await newSavingApplication.save();

    res
      .status(201)
      .json({ message: "Saving application data saved successfully" });
  } catch (error) {
    console.error("Saving Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/saving-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // If center parameter is provided, filter savings by center
    const query = center ? { OScenter: center } : {};

    const savings = await OpenSaving.find(
      query,
      "memberID savingID OSname fathername OSbranch OScenter OSmobile savingType Samount "
    );

    res.json(savings);
  } catch (error) {
    console.error("Saving Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//----------------------------------------------------------------

// member admission Start

//----------------------------------------------------------------

const generateMemberID = async () => {
  const count = await Member.countDocuments();
  const paddedCount = (count + 1).toString().padStart(4, "0");
  return `M${paddedCount}`;
};

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

//member callback

app.get("/member-callback", async (req, res) => {
  try {
    const selectedCenter = req.query.selectedCenter;
    const selectedNID = req.query.selectedNID;
    let query = {};

    if (selectedCenter) {
      query = { CenterMember: selectedCenter };
    }
    if (selectedNID) {
      query.MemberNIDnumber = selectedNID;
    }
    const members = await Member.find(
      query,
      "BranchMember  CenterMember memberID memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizaiotnloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation "
    );
    res.json(members);
  } catch (error) {
    console.error("Member Application Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//Member ID Get
app.get("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };

    const member = await Member.findOne(
      query,
      "BranchMember CenterMember memberID memberName MfhName MdateOfBirth memberJob memberVillage memberUnion memberPost memberSubDic memberDic memberMarital memberStudy memberFhead memberfMM memberfMF memberfMTotal EarningMember FamilyMemberENO loanamount nonorganizationloan YearlyIncome LandProperty TotalMoney MemberNIDnumber MemberMobile NominiName NominiFather MemberNominiRelation"
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

//Member Update

app.put("/member-callback/:ID", async (req, res) => {
  try {
    const memberID = req.params.ID; // Retrieve memberID from route parameter
    const query = { _id: new ObjectId(memberID) };
    const updatedData = req.body;

    const updatedMember = await Member.findOneAndUpdate(
      { _id: query },
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

// member admission End

//----------------------------------------------------------------

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//----------------------------------------------------------------

// 404 Error handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Error handling
app
  .listen(port, () => {
    console.log(`server run at ${port}`);
  })
  .on("error", (error) => {
    console.error(`Error starting server: ${error.message}`);
  });
