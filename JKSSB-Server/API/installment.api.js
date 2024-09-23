const express = require("express");
const router = express.Router();
const InstallmentCollection = require("../models/installment.collection.model.js");
const { ObjectId } = require("mongoose").Types;

router.post("/save-installments-collection", async (req, res) => {
  const { centerName, installmentDate, data, centerBranch, submittedBy } =
    req.body;

  try {
    const updatePromises = data.map(async (item) => {
      const filter = { loanID: item.loanID, memberID: item.memberID };

      // Prepare the update to save data every time, even if they are duplicates
      const update = {
        $set: {
          loanID: item.loanID,
          memberID: item.memberID,
          OLname: item.OLname,
          OLmobile: item.OLmobile,
          loanType: item.loanType,
          onlyInterest: item.onlyInterest,
          centerName: centerName,
          centerBranch: centerBranch,
        },
        $push: {
          installmentDate: installmentDate, // Allow duplicate dates
          submittedBy: { $each: submittedBy }, // Allow duplicate submitters
          installment: { $each: item.installment }, // Allow duplicate installments
          installmentCount: { $each: item.installmentCount }, // Allow duplicate installments
        },
      };

      // Use upsert to insert a new document if no match is found, otherwise update the existing one
      const result = await InstallmentCollection.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
          upsert: true, // Create a new document if no match is found
        }
      );

      return result;
    });

    // Execute all the promises for saving/updating the data
    const docs = await Promise.all(updatePromises);
    res.status(200).json({ message: "Data saved successfully", docs });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error });
  }
});

// data update from other page (OfficeCollection) ---------------------------------------

router.patch("/update-installments-collection/:loanID", async (req, res) => {
  const { loanID } = req.params;
  const { installmentDate, installment, submittedBy, installmentCount } =
    req.body; // added installment and submittedBy

  if (
    !loanID ||
    !installmentDate ||
    !installment ||
    !submittedBy ||
    !installmentCount
  ) {
    return res
      .status(400)
      .send(
        "Bad Request: Missing loanID, installmentDate, installment, or submittedBy"
      );
  }

  try {
    // Update the document by pushing the new data into their respective arrays
    const updatedDocument = await InstallmentCollection.findOneAndUpdate(
      { loanID: loanID },
      {
        $addToSet: { installmentDate: installmentDate },
        $push: {
          installment: installment, // Push new installment to the array
          submittedBy: submittedBy, // Push new submittedBy to the array
          installmentCount: installmentCount, // Push new submittedBy to the array
        },
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

//Total instalment Date count--------------------------------

router.get("/installment-dates-count", async (req, res) => {
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

router.get("/installment-dates-count/:loanID", async (req, res) => {
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

router.get("/installment-collection-dates", async (req, res) => {
  try {
    const dates = await InstallmentCollection.find();

    // Send the retrieved dates as a response
    res.status(200).json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error.message);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

router.get(
  "/installment-collection-dates/:installmentDate",
  async (req, res) => {
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
  }
);

// Callback All date --------------------------------
router.get("/loan-collection-date/:loanID", async (req, res) => {
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

router.get("/loan-collection-by-center/:centerName/:date", async (req, res) => {
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

// onlyInterest Collection and Principle data by Branch and Month-------------------------------------

router.get(
  "/interest-collection-by-branch/:centerBranch/:monthYear",
  async (req, res) => {
    try {
      const { centerBranch, monthYear } = req.params;

      // Find all loan collections for the given branch
      const loans = await InstallmentCollection.find({ centerBranch });

      // Initialize the sum of onlyInterest and TotalMonthPrinciple for the current month
      let totalInterest = 0;
      let totalMonthPrinciple = 0;

      // Extract current month and year
      const [currentMonth, currentYear] = monthYear.split("-");

      // Loop through each loan collection
      for (const loan of loans) {
        // Check if installmentDate exists and is an array
        if (Array.isArray(loan.installmentDate)) {
          // Loop through each installmentDate
          for (const date of loan.installmentDate) {
            // Extract the day, month, and year from the installmentDate
            const [day, month, year] = date.split("-");

            // Format the year to "YYYY" assuming the year is in the "YY" format
            const formattedYear = `20${year}`;
            const formattedDate = `${month}-${formattedYear}`;

            // Check if the formattedDate matches the current monthYear
            if (formattedDate === monthYear) {
              const interest = parseFloat(loan.onlyInterest) || 0;
              const installment = parseFloat(loan.installment) || 0;

              totalInterest += interest;
              totalMonthPrinciple += installment - interest;
            }
          }
        }
      }

      // Send the total interest and total principle as a response
      res.status(200).json({ totalInterest, totalMonthPrinciple });
    } catch (error) {
      console.error("Error fetching loans data:", error.message);
      res.status(500).json({ error: "Failed to fetch loans data" });
    }
  }
);

// onlyInterest Collection data by Center and Date-------------------------------------

router.get(
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

// onlyInterest Collection and Principle data by Branch and Date-------------------------------------

router.get(
  "/interest-collection-by-branch-date/:centerBranch/:date",
  async (req, res) => {
    try {
      const { centerBranch, date } = req.params;

      // Find all loan collections for the given centerBranch
      const loans = await InstallmentCollection.find({ centerBranch });

      // Initialize the sum of onlyInterest and Principle
      let totalInterestBranch = 0;
      let totalPrincipleBranch = 0;

      // Loop through each loan collection
      for (const loan of loans) {
        // Find the index of the specified date in the installmentDate array
        const dateIndex = loan.installmentDate.indexOf(date);

        // If the date is found, calculate interest and principle
        if (dateIndex !== -1) {
          const onlyInterest = parseFloat(loan.onlyInterest);
          const installment = parseFloat(loan.installment);

          // Calculate principle as: installment - onlyInterest
          const principle = installment - onlyInterest;

          // Add to the total sums
          totalInterestBranch += onlyInterest;
          totalPrincipleBranch += principle;
        }
      }

      // Send the total interest and principle as a response
      res.status(200).json({ totalInterestBranch, totalPrincipleBranch });
    } catch (error) {
      console.error("Error fetching loans data:", error.message);
      res.status(500).json({ error: "Failed to fetch loans data" });
    }
  }
);

module.exports = router;
