const express = require("express");
const router = express.Router();
const WorkerSalary = require("../models/salary.model.js");
const { ObjectId } = require("mongoose").Types;

router.post("/save-worker-salary", async (req, res) => {
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

router.get("/get-salary-data", async (req, res) => {
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
router.get("/worker-salary/:workerID/:month", async (req, res) => {
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

router.put("/update-worker-salary", async (req, res) => {
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

module.exports = router;
