const express = require("express");
const router = express.Router();
const Loan = require("../models/loan.model.js");
const { ObjectId } = require("mongoose").Types;

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

router.get("/openloan/save-dates/count", async (req, res) => {
  try {
    const count = await Loan.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching branch count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Save Loan Information----------------------------------------------------------------
router.post("/openloan/save-dates", async (req, res) => {
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
      approvalStatus,
      ActiveStatus,
      submittedBy,
      GrantedBy,
      DeletedBy,
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
      approvalStatus,
      ActiveStatus,
      submittedBy,
      GrantedBy,
      DeletedBy,
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

// For Permission

router.post("/openloan/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Loans = await Loan.findByIdAndUpdate(
      id,
      { approvalStatus: "Approved" },
      { new: true }
    );

    if (!Loans) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json({ message: "Loans approved", Loans });
  } catch (error) {
    console.error("Error approving Loans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// For Pending

router.get("/openloan/approved", async (req, res) => {
  try {
    const pendingLoans = await Loan.find({ approvalStatus: "Pending" });
    res.json(pendingLoans);
  } catch (error) {
    console.error("Error fetching pending Loans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/openloan/grant/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const Loans = await Loan.findByIdAndUpdate(
      id,
      { approvalStatus: "Granted", GrantedBy: username },
      { new: true }
    );

    if (!Loans) {
      return res.status(404).json({ message: "Loans not found" });
    }

    res.json({ message: "Loans granted", Loans });
  } catch (error) {
    console.error("Error granting Loans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/openloan/grant", async (req, res) => {
  try {
    const grantLoans = await Loan.find({ approvalStatus: "Approved" });
    res.json(grantLoans);
  } catch (error) {
    console.error("Error fetching pending Loans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/openloan/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Loans = await Loan.findByIdAndDelete(id);

    if (!Loans) {
      return res.status(404).json({ message: "Loans not found" });
    }

    res.json({ message: "Loans canceled" });
  } catch (error) {
    console.error("Error canceling Loans:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/openloan/review", async (req, res) => {
  try {
    const { submittedBy } = req.query;

    const query = { approvalStatus: "Needs Correction" };
    if (submittedBy) {
      query.submittedBy = submittedBy;
    }

    const Loans = await Loan.find(query);
    res.json(Loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Loans needing correction" });
  }
});

// Update Loans approval status to Needs Correction
router.post("/openloan/review/:id", async (req, res) => {
  try {
    const Loans = await Loan.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Needs Correction" },
      { new: true }
    );
    res.json({ message: "Loans sent back for correction", Loans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending Loans back for correction" });
  }
});

// For installemt ----------------------------------------------------------------

router.get("/get-installmentDate/:center", async (req, res) => {
  try {
    const selectedCenter = req.params.center; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const dates = await Loan.find({
      OLcenter: selectedCenter,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Loan date callback----------------------------------------------------------------

router.get("/get-dates", async (req, res) => {
  try {
    const dates = await Loan.find();

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get("/get-dates/:nextDate", async (req, res) => {
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

//get microLoan  and form fee Callback by center and date ---------------------------------------------------------------------

router.get("/sum-macroloan/:OLcenter/:createdAt", async (req, res) => {
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

//get microLoan  and form fee Callback by branch and date ---------------------------------------------------------------------

router.get(
  "/sum-macroloan-by-branch/:OLbranch/:createdAt",
  async (req, res) => {
    try {
      const { OLbranch, createdAt } = req.params;

      // Create a date range for the entire day
      const startOfDay = new Date(createdAt);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(createdAt);
      endOfDay.setHours(23, 59, 59, 999);

      // Find documents matching the provided OLcenter and createdAt within the day range
      const loans = await Loan.find({
        OLbranch: OLbranch,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      // Calculate the sum of macroloan values
      const sumMacroloanBranch = loans.reduce(
        (sum, loan) => sum + loan.macroloan,
        0
      );
      const sumfromFeeBranchLoan = loans.reduce(
        (sum, loan) => sum + loan.fromFee,
        0
      );

      // Send the result as a JSON response
      res.status(200).json({ sumMacroloanBranch, sumfromFeeBranchLoan });
    } catch (error) {
      console.error("Error fetching macroloan data:", error.message);
      res.status(500).json({ error: "Failed to fetch macroloan data" });
    }
  }
);

//get microLoan  and form fee Callback by branch and Month ---------------------------------------------------------------------

router.get(
  "/sum-macroloan-by-branch-month/:OLbranch/:monthYear",
  async (req, res) => {
    try {
      const { OLbranch, monthYear } = req.params;

      // Parse month and year from the parameter
      const [month, year] = monthYear.split("-");

      // Create a date range for the entire month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Find documents matching the provided OLbranch and createdAt within the month range
      const loans = await Loan.find({
        OLbranch: OLbranch,
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      // Calculate the sum of macroloan values and fromFee for the month
      const sumMacroloanBranchMonth = loans.reduce(
        (sum, loan) => sum + loan.macroloan,
        0
      );
      const sumfromFeeBranchLoanMonth = loans.reduce(
        (sum, loan) => sum + loan.fromFee,
        0
      );

      // Send the result as a JSON response
      res
        .status(200)
        .json({ sumMacroloanBranchMonth, sumfromFeeBranchLoanMonth });
    } catch (error) {
      console.error("Error fetching macroloan data:", error.message);
      res.status(500).json({ error: "Failed to fetch macroloan data" });
    }
  }
);

//Loan Callback by LoanID------------------------------------------------

router.get("/get-loan-loanid/:loanID", async (req, res) => {
  try {
    const selectedLoan = req.params.loanID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected center
    const LoanIDs = await Loan.find({
      loanID: selectedLoan,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(LoanIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

//Loan Callback by MemberID------------------------------------------------

router.get("/get-loan-MemberID/:memberID", async (req, res) => {
  try {
    const selectedmemberID = req.params.memberID; // Use req.params.center to get the center from URL path

    // Filter documents based on the selected MemberID
    const memberIDs = await Loan.find({
      memberID: selectedmemberID,
      approvalStatus: "Granted",
    });

    // Send the retrieved dates as a response
    res.status(200).json(memberIDs);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Just Loan Call Back----------------------------------------------------
router.get("/loan-callback", async (req, res) => {
  try {
    const { center } = req.query;

    // Filter loans by center if provided and also by approvalStatus = 'Granted'
    const query = {
      ...(center ? { OLcenter: center } : {}), // Add center filter if specified
      approvalStatus: "Granted", // Only include loans with 'Granted' approval status
    };

    // Select only the necessary fields
    const loans = await Loan.find(
      query,
      "DeleteDate DeletedBy GrantedBy submittedBy approvalStatus ActiveStatus memberID loanID OLname fathername OLbranch OLcenter OLmobile loanType installmentStart OLamount CenterDay OLtotal totalInstallment macroloan"
    );

    res.json(loans);
  } catch (error) {
    console.error("Loan Callback Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Loan Calback by Branch----------------------------------------------------

router.get("/loan-callback-by-branch/:OLbranch", async (req, res) => {
  try {
    const selectedID = req.params.OLbranch; // Retrieve OLbranch from route parameter

    // Filter documents based on the selected branch and approvalStatus = 'Granted'
    const OLbranchs = await Loan.find({
      OLbranch: selectedID, // Match the specific branch
      approvalStatus: "Granted", // Only include loans with 'Granted' approval status
    });

    // Send the retrieved data as a response
    res.status(200).json(OLbranchs);
  } catch (error) {
    console.error("Error fetching loans by branch:", error.message);
    res.status(500).json({ error: "Failed to fetch loans by branch" });
  }
});

//Loan Update-----------------------------------------

router.put("/loan-callback/:ID", async (req, res) => {
  try {
    const _id = req.params.ID; // Retrieve _id from route parameter
    const query = { _id: new ObjectId(_id) };
    const updatedData = req.body;

    const updatedLoan = await Loan.findOneAndUpdate(
      query, // Correctly use the query with _id
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

router.put("/openloan/ActiveStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, deleteDate } = req.body; // Get the username and deleteDate from the request body

    const Loans = await Loan.findByIdAndUpdate(
      id,
      {
        ActiveStatus: "False",
        DeletedBy: username, // Save the username in the DeletedStatus field
        DeleteDate: deleteDate, // Save the current date in the DeleteDate field
      },
      { new: true } // Return the updated document
    );

    if (!Loans) {
      return res.status(404).json({ message: "Loans not found" });
    }

    res.json({ message: "Loans status updated", Loans });
  } catch (error) {
    console.error("Error updating Loans status:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
