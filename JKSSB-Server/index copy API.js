const dotenv = require("dotenv");
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const memberRoutes = require("./API/member.api.js");
const SavingRouters = require("./API/saving.api.js");
const SavingCollectionRoutes = require("./API/savingcollection.api.js");
const SavingWithdrawRoutes = require("./API/withdraw.api.js");
const VoucheRouters = require("./API/Voucher.api.js");
const IncomeExpense = require("./API/incomeexpense.api.js");
const InstallmentCollection = require("./API/installment.api.js");
const LoanRouters = require("./API/loan.api.js");
const CenterRouters = require("./API/center.api.js");
const BranchRouters = require("./API/branch.api.js");
const DesignationRouters = require("./API/designation.api.js");
const SalaryRouters = require("./API/salary.api.js");
const WorkerRouters = require("./API/worker.api.js");
const LoginRouters = require("./API/login.api.js");
const SingupRouters = require("./API/signup.api.js");

require("dotenv").config();
const app = express();
app.use(express.json());
const port = 5000;
// app.use(cors({ origin: "https://ashalata.gandhipoka.com" }));
app.use(cors());
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

app.use("/", SingupRouters);

// Login Start

app.use("/", LoginRouters);

// Worker Admission Satart

app.use("/", WorkerRouters);

// For wroker Salary

app.use("/", SalaryRouters);

//  Designation Start

app.use("/", DesignationRouters);

// Open Branch Start

app.use("/", BranchRouters);

// Open Center Start

app.use("/", CenterRouters);

// Open Loan

app.use("/", LoanRouters);

//Installment Collection Start

app.use("/", InstallmentCollection);

//Saving Start

app.use("/", SavingRouters);

// Saving Collection Start

app.use("/", SavingCollectionRoutes);

// Saving Withdrawing

app.use("/", SavingWithdrawRoutes);

// member admission

app.use("/", memberRoutes);

// Voucher Start

app.use("/", VoucheRouters);

// IncomeExpenseReport Start

app.use("/", IncomeExpense);

//----------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`expresss running on port ${port}`);
});
