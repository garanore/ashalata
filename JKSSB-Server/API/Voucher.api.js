const express = require("express");
const router = express.Router();
const Credit = require("../models/credit.model.js");
const Debit = require("../models/debit.model.js");

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

router.post("/save-debit", async (req, res) => {
  const result = await saveData(Debit, req.body);
  res.status(result.status).json({ message: result.message });
});

router.post("/save-credit", async (req, res) => {
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

  if (["1205", "1206", "1207", "1213", "1220"].includes(productCode)) {
    Model = Debit;
  } else {
    Model = Credit;
  }

  const result = await updateData(Model, req.body);

  res.status(result.status).json({ message: result.message });
});

module.exports = router;
