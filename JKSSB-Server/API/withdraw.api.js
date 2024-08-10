const express = require("express");
const router = express.Router();
const Withdrawal = require("../models/withdraw.model.js");
const { ObjectId } = require("mongoose").Types;

router.post("/saving-withdraw", async (req, res) => {
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
router.get("/get-withDrawAmount-savingid/:id", async (req, res) => {
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

module.exports = router;
