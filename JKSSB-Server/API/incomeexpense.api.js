const express = require("express");
const router = express.Router();
const IncomeExpense = require("../models/incomeExpense.model.js");
const { ObjectId } = require("mongoose").Types;

router.post("/save-income-expense", async (req, res) => {
  try {
    const payload = req.body;

    for (const item of payload) {
      // Check if a document already exists for the branch and productCode
      const existingEntry = await IncomeExpense.findOne({
        branch: item.branch,
        productCode: item.productCode,
      });

      if (existingEntry) {
        // Update the existing document
        existingEntry.month.push(...item.month);
        existingEntry.currentMonthAmount.push(...item.currentMonthAmount);
        existingEntry.toDateAmount.push(...item.toDateAmount);
        await existingEntry.save();
      } else {
        // Create a new document
        const newEntry = new IncomeExpense(item);
        await newEntry.save();
      }
    }

    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res
      .status(500)
      .json({ message: "Error saving data", error: error.message });
  }
});

// get toDateAmoun for previous month with Branch and Month----------------------------------------------------------------

router.get("/get-income-expense/:branch/:month", async (req, res) => {
  try {
    const { branch, month } = req.params;

    // Convert the incoming MM-YYYY format to a Date object
    const [monthPart, yearPart] = month.split("-");
    let monthIndex = parseInt(monthPart, 10) - 1; // Convert month to zero-based index

    // Adjust the Date object to the previous month
    let previousMonthIndex = monthIndex - 1;
    let previousYear = parseInt(yearPart, 10);

    // If the previous month is negative (i.e., before January), adjust the year and set to December
    if (previousMonthIndex < 0) {
      previousMonthIndex = 11; // December
      previousYear -= 1; // Subtract one year
    }

    // Format the previous month back to YYYY-MM
    const formattedPreviousMonth = `${previousYear}-${String(
      previousMonthIndex + 1
    ).padStart(2, "0")}`;

    // Find all documents matching the branch
    const entries = await IncomeExpense.find({ branch });

    // Initialize an object to store the sums by productCode
    let totalsByProductCode = {};

    // Iterate over the retrieved entries
    for (const entry of entries) {
      // Find the last index of the previous month in the 'month' array
      const monthIndex = entry.month.lastIndexOf(formattedPreviousMonth);

      // If the month is found, add the corresponding 'toDateAmount' to the total for that productCode
      if (monthIndex !== -1) {
        const productCode = `P${entry.productCode}`; // Prefix with "P"
        const amount = parseFloat(entry.toDateAmount[monthIndex] || 0);

        // Sum the amounts by productCode
        if (totalsByProductCode[productCode]) {
          totalsByProductCode[productCode] += amount;
        } else {
          totalsByProductCode[productCode] = amount;
        }
      }
    }

    // Format the totals to two decimal places
    for (let productCode in totalsByProductCode) {
      totalsByProductCode[productCode] =
        totalsByProductCode[productCode].toFixed(2);
    }

    res.status(200).json(totalsByProductCode);
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

module.exports = router;
