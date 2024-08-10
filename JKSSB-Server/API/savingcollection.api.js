const express = require("express");
const router = express.Router();
const SavingCollection = require("../models/saving.collection.model.js");
const { ObjectId } = require("mongoose").Types;

router.post("/save-savings-collection", async (req, res) => {
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

router.patch("/update-savings-collection/:savingID", async (req, res) => {
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

router.get("/saving-collection-total/:savingID", async (req, res) => {
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
router.get("/saving-collection-date-amount/:savingID", async (req, res) => {
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

router.get(
  "/saving-collection-by-center/:centerName/:date",
  async (req, res) => {
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
  }
);

module.exports = router;
