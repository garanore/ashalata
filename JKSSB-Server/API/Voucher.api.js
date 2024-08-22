const express = require("express");
const router = express.Router();
const Credit = require("../models/credit.model.js");
const Debit = require("../models/debit.model.js");
const { ObjectId } = require("mongoose").Types;

const saveData = async (Model, data) => {
  try {
    const { productCode, productName, sellCost, comment, date, centerBranch } =
      data;

    const existingDocument = await Model.findOne({ productCode });

    if (existingDocument) {
      existingDocument.sellCost.push(sellCost);
      existingDocument.comment.push(comment);
      existingDocument.date.push(date);
      existingDocument.centerBranch = centerBranch; // Update the branch field if necessary
      await existingDocument.save();
    } else {
      const newDocument = new Model({
        productCode,
        centerBranch,
        productName,
        sellCost: [sellCost],
        comment: [comment],
        date: [date],
      });
      await newDocument.save();
    }

    return { status: 200, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error saving data:", error);
    // Log the error with more details
    console.error("Detailed error:", error.stack || error);
    return { status: 500, message: "Internal Server Error" };
  }
};

router.post("/save-debit", async (req, res) => {
  try {
    const result = await saveData(Debit, req.body);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in /save-debit route:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/save-credit", async (req, res) => {
  try {
    const result = await saveData(Credit, req.body);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in /save-credit route:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Find ALl data By Date----------------------------------------------------------------

const findDataByDateAndBranch = async (Model, date, centerBranch) => {
  try {
    // Find documents matching the branch
    const documents = await Model.find({ centerBranch });

    // Iterate over all documents to find matching date
    const results = documents
      .map((doc) => {
        const dateIndex = doc.date.findIndex((d) => d === date);

        // If the date is found, return the sellCost and comment at that index
        if (dateIndex !== -1) {
          return {
            centerBranch: doc.centerBranch,
            productCode: doc.productCode,
            productName: doc.productName,
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

router.get("/find-data-by-date-branch", async (req, res) => {
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

const sumSellCostByMonthAndBranch = async (
  Model,
  monthYear,
  centerBranch,
  prefix
) => {
  try {
    // Find documents matching the branch
    const documents = await Model.find({ centerBranch });

    let productCodeSums = {};

    // Iterate over all documents to sum sellCost for matching dates
    documents.forEach((doc) => {
      doc.date.forEach((date, index) => {
        const [year, month] = date.split("-");

        // Check if the date matches the selected month and year
        if (`${month}-${year}` === monthYear) {
          const productCode = doc.productCode;
          if (!productCodeSums[productCode]) {
            productCodeSums[productCode] = 0;
          }
          productCodeSums[productCode] += doc.sellCost[index];
        }
      });
    });

    // Add prefix to each productCode key
    let resultsWithPrefix = {};
    Object.keys(productCodeSums).forEach((productCode) => {
      resultsWithPrefix[`${prefix}${productCode}`] =
        productCodeSums[productCode];
    });

    return { status: 200, data: resultsWithPrefix };
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

router.get(
  "/sum-sell-cost-by-month-branch/:branch/:monthYear",
  async (req, res) => {
    const { branch, monthYear } = req.params; // Use URL parameters

    const debitResult = await sumSellCostByMonthAndBranch(
      Debit,
      monthYear,
      branch,
      "D" // Prefix for Debit
    );
    const creditResult = await sumSellCostByMonthAndBranch(
      Credit,
      monthYear,
      branch,
      "C" // Prefix for Credit
    );

    if (debitResult.status === 500 || creditResult.status === 500) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      const combinedData = { ...debitResult.data, ...creditResult.data };
      res.status(200).json(combinedData);
    }
  }
);

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

router.put("/update-data", async (req, res) => {
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

module.exports = router;
