// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const MEMBER_LIST_CENTER_ROUTE = "/home/SalaryList";

const SalaryEdit = () => {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const { workerID, month: selectedMonth } = location.state || {};
  const navigate = useNavigate();
  const [submitMessage, setSubmitMessage] = useState("");
  const [fields, setFields] = useState({
    basic: {},
    houseRent: {},
    medAllow: {},
    transAllow: {},
    special: {},
    distance: {},
    deameSlance: {},
    mobileBill: {},
    commission: {},
    bonus: {},
    totalsalary: {},
    pf: {},
    advance: {},
    loan: {},
    fsf: {},
    healthFund: {},
    other: {},
    offGrt: {},
    earned: {},
    offPf: {},
    totalPF: {},
    totalSalAndAllowances: {},
    comment: {},
  });

  useEffect(() => {
    if (workerID && selectedMonth) {
      fetchSalaryData(workerID, selectedMonth);
    }
  }, [workerID, selectedMonth]);

  const handleChange = (field, id, value) => {
    if (field === "comment") {
      // Handle text input for comments
      setFields((prevFields) => ({
        ...prevFields,
        [field]: { ...prevFields[field], [id]: value },
      }));
    } else {
      // Handle numerical input for other fields
      const basic =
        field === "basic" ? parseFloat(value) : fields.basic[id] || 0;
      const houseRent = basic * 1; // 100% of Basic
      const medAllow = basic * 0.15; // 15% of Basic
      const transAllow = basic * 0.15; // 15% of Basic

      setFields((prevFields) => ({
        ...prevFields,
        [field]: { ...prevFields[field], [id]: parseFloat(value) },
        houseRent: { ...prevFields.houseRent, [id]: houseRent },
        medAllow: { ...prevFields.medAllow, [id]: medAllow },
        transAllow: { ...prevFields.transAllow, [id]: transAllow },
      }));
    }
  };

  const calculateTotalSalary = (id) => {
    if (id) {
      const basic = parseFloat(fields.basic[id]) || 0;
      const houseRent = parseFloat(fields.houseRent[id]) || 0;
      const medAllow = parseFloat(fields.medAllow[id]) || 0;
      const transAllow = parseFloat(fields.transAllow[id]) || 0;
      const special = parseFloat(fields.special[id]) || 0;
      const distance = parseFloat(fields.distance[id]) || 0;
      const deameSlance = parseFloat(fields.deameSlance[id]) || 0;
      const mobileBill = parseFloat(fields.mobileBill[id]) || 0;
      const commission = parseFloat(fields.commission[id]) || 0;
      const bonus = parseFloat(fields.bonus[id]) || 0;

      return Math.round(
        basic +
          houseRent +
          medAllow +
          transAllow +
          special +
          distance +
          deameSlance +
          mobileBill +
          commission +
          bonus
      );
    } else {
      // Calculate the total salary for all workers
      return worker.reduce((total, worker) => {
        const id = worker.workerID;
        return total + calculateTotalSalary(id);
      }, 0);
    }
  };

  const calculateNetPay = (id) => {
    const totalSalary = calculateTotalSalary(id);
    const pf = parseFloat(fields.pf[id]) || 0;
    const advance = parseFloat(fields.advance[id]) || 0;
    const loan = parseFloat(fields.loan[id]) || 0;
    const fsf = parseFloat(fields.fsf[id]) || 0;
    const healthFund = parseFloat(fields.healthFund[id]) || 0;
    const other = parseFloat(fields.other[id]) || 0;

    return totalSalary - (pf + advance + loan + fsf + healthFund + other);
  };

  const calculateTotalPF = (id) => {
    const pf = parseFloat(fields.pf[id]) || 0;
    const offGrt = parseFloat(fields.offGrt[id]) || 0;
    const earned = parseFloat(fields.earned[id]) || 0;
    const offPf = parseFloat(fields.offPf[id]) || 0;
    return pf + offGrt + earned + offPf;
  };

  const calculateTotalSalAndAllowances = (id) => {
    const netPay = calculateNetPay(id);
    const totalPF = calculateTotalPF(id);
    return netPay - totalPF;
  };

  const getFormattedMonth = (month) => {
    if (!month) return "Select a month";
    const date = new Date(month);
    return (
      date.toLocaleString("default", { month: "long" }) +
      `, ${date.getFullYear()}`
    );
  };

  const fetchSalaryData = async (workerID, selectedMonth) => {
    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/worker-salary/${workerID}/${selectedMonth}`
      );
      // console.log("API Response:", response.data);
      if (response.data) {
        setWorker(response.data);

        const monthIndex = response.data.month.indexOf(selectedMonth);

        if (monthIndex !== -1) {
          // Initialize fields with fetched data
          setFields((prevFields) => ({
            ...prevFields,
            basic: { [response.data.workerID]: response.data.basic },
            houseRent: { [response.data.workerID]: response.data.houseRent },
            medAllow: { [response.data.workerID]: response.data.medAllow },
            transAllow: { [response.data.workerID]: response.data.transAllow },
            special: { [response.data.workerID]: response.data.special },
            distance: { [response.data.workerID]: response.data.distance },
            deameSlance: {
              [response.data.workerID]: response.data.deameSlance,
            },
            mobileBill: { [response.data.workerID]: response.data.mobileBill },
            commission: { [response.data.workerID]: response.data.commission },
            bonus: { [response.data.workerID]: response.data.bonus },
            pf: { [response.data.workerID]: response.data.pf },
            advance: { [response.data.workerID]: response.data.advance },
            loan: { [response.data.workerID]: response.data.loan },
            fsf: { [response.data.workerID]: response.data.fsf },
            healthFund: { [response.data.workerID]: response.data.healthFund },
            other: { [response.data.workerID]: response.data.other },
            offGrt: { [response.data.workerID]: response.data.offGrt },
            earned: { [response.data.workerID]: response.data.earned },
            offPf: { [response.data.workerID]: response.data.offPf },
            comment: { [response.data.workerID]: response.data.comment },
          }));
          setError("");
        } else {
          setError("Selected month not found in the data.");
        }
      } else {
        console.error("Unexpected response format", response.data);
        setError("Unexpected response format");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found for the selected worker and month.");
      } else {
        console.error(
          "There was an error fetching the worker salaries!",
          error
        );
        setError(
          "There was an error fetching the worker salaries! " + error.message
        );
      }
    }
  };

  const handleSubmit = async () => {
    const workerID = worker?.workerID;
    const month = selectedMonth;

    if (!workerID || !month) {
      setSubmitMessage("WorkerID or month is missing!");
      return;
    }

    // Ensure that fields for the worker are properly initialized
    if (!fields.basic[workerID]) {
      setSubmitMessage("Fields for the worker are not initialized!");
      return;
    }

    // Find the index of the selected month in the `month` array
    const monthIndex = worker.month.findIndex((m) => m === selectedMonth);

    const data = {
      basic: fields.basic[workerID] || 0,
      houseRent: fields.houseRent[workerID] || 0,
      medAllow: fields.medAllow[workerID] || 0,
      transAllow: fields.transAllow[workerID] || 0,
      special: fields.special[workerID] || 0,
      distance: fields.distance[workerID] || 0,
      deameSlance: fields.deameSlance[workerID] || 0,
      mobileBill: fields.mobileBill[workerID] || 0,
      commission: fields.commission[workerID] || 0,
      bonus: fields.bonus[workerID] || 0,
      totalSalary: calculateTotalSalary(workerID),
      pf: fields.pf[workerID] || 0,
      advance: fields.advance[workerID] || 0,
      loan: fields.loan[workerID] || 0,
      fsf: fields.fsf[workerID] || 0,
      healthFund: fields.healthFund[workerID] || 0,
      other: fields.other[workerID] || 0,
      netPay: calculateNetPay(workerID),
      offGrt: fields.offGrt[workerID] || 0,
      earned: fields.earned[workerID] || 0,
      offPf: fields.offPf[workerID] || 0,
      totalPF: calculateTotalPF(workerID),
      totalSalAndAllowances: calculateTotalSalAndAllowances(workerID),
      comment: fields.comment[workerID] || "",
    };

    try {
      const response = await axios.put(
        `https://ashalota.gandhipoka.com/update-worker-salary`,
        { workerID, month, monthIndex, data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setSubmitMessage("Data updated successfully!");
      } else {
        setSubmitMessage("Failed to update data.");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setSubmitMessage(
        "There was an error updating the data! " + error.message
      );
    }
  };

  if (!worker) {
    return <div>Loading...</div>;
  }
  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="bg-light container-fluid p-2">
      <h2 className="text-center mt-4">Salary Edit</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          For the month of: <strong>{getFormattedMonth(selectedMonth)}</strong>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {worker && (
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Basic</th>
                <th>House Rent</th>
                <th>Med. Allow.</th>
                <th>Trans. Allow.</th>
                <th>Special</th>
                <th>Distance</th>
                <th>Deame s/lance</th>
                <th>Mobile Bill</th>
                <th>Commission</th>
                <th>Bonus</th>
                <th>Total Salary</th>
                <th>PF</th>
                <th>Advance</th>
                <th>Loan</th>
                <th>FSF</th>
                <th>Health Fund</th>
                <th>Other</th>
                <th>Net Pay</th>
                <th>Off. Grt</th>
                <th>Earned</th>
                <th>Off. PF</th>
                <th>Total PF</th>
                <th>Total Sal. & Allowances</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr key={worker.workerID}>
                <td>{worker.workerID}</td>
                <td>{worker.workerName}</td>
                <td>{worker.designation}</td>

                <td>
                  <input
                    type="number"
                    value={fields.basic[worker.workerID] || ""}
                    placeholder="Enter Basic"
                    onChange={(e) =>
                      handleChange("basic", worker.workerID, e.target.value)
                    }
                  />
                </td>

                <td>{fields.houseRent[worker.workerID] || "-"}</td>
                <td>{fields.medAllow[worker.workerID] || "-"}</td>
                <td>{fields.transAllow[worker.workerID] || "-"}</td>
                <td>
                  <input
                    type="number"
                    value={fields.special[worker.workerID] || ""}
                    placeholder="Enter Special"
                    onChange={(e) =>
                      handleChange("special", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.distance[worker.workerID] || ""}
                    placeholder="Enter Distance"
                    onChange={(e) =>
                      handleChange("distance", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.deameSlance[worker.workerID] || ""}
                    placeholder="Enter Deame S/lance"
                    onChange={(e) =>
                      handleChange(
                        "deameSlance",
                        worker.workerID,
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.mobileBill[worker.workerID] || ""}
                    placeholder="Enter Mobile Bill"
                    onChange={(e) =>
                      handleChange(
                        "mobileBill",
                        worker.workerID,
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.commission[worker.workerID] || ""}
                    placeholder="Enter Commission"
                    onChange={(e) =>
                      handleChange(
                        "commission",
                        worker.workerID,
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.bonus[worker.workerID] || ""}
                    placeholder="Enter Bonus"
                    onChange={(e) =>
                      handleChange("bonus", worker.workerID, e.target.value)
                    }
                  />
                </td>

                <td>{calculateTotalSalary(worker.workerID)}</td>

                <td>
                  <input
                    type="number"
                    value={fields.pf[worker.workerID] || ""}
                    placeholder="Enter PF"
                    onChange={(e) =>
                      handleChange("pf", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.advance[worker.workerID] || ""}
                    placeholder="Enter Advance"
                    onChange={(e) =>
                      handleChange("advance", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.loan[worker.workerID] || ""}
                    placeholder="Enter Loan"
                    onChange={(e) =>
                      handleChange("loan", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.fsf[worker.workerID] || ""}
                    placeholder="Enter FSF"
                    onChange={(e) =>
                      handleChange("fsf", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.healthFund[worker.workerID] || ""}
                    placeholder="Enter Health Fund"
                    onChange={(e) =>
                      handleChange(
                        "healthFund",
                        worker.workerID,
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.other[worker.workerID] || ""}
                    placeholder="Enter Other"
                    onChange={(e) =>
                      handleChange("other", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>{calculateNetPay(worker.workerID)}</td>
                <td>
                  <input
                    type="number"
                    value={fields.offGrt[worker.workerID] || ""}
                    placeholder="Enter Off. Grt"
                    onChange={(e) =>
                      handleChange("offGrt", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.earned[worker.workerID] || ""}
                    placeholder="Enter Earned"
                    onChange={(e) =>
                      handleChange("earned", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.offPf[worker.workerID] || ""}
                    placeholder="Enter Off. PF"
                    onChange={(e) =>
                      handleChange("offPf", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>{calculateTotalPF(worker.workerID)}</td>
                <td>{calculateTotalSalAndAllowances(worker.workerID)}</td>
                <td>
                  <input
                    type="text"
                    value={fields.comment[worker.workerID] || ""}
                    placeholder="Enter Comment"
                    onChange={(e) =>
                      handleChange("comment", worker.workerID, e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="row">
        <div className="text-center mt-4 col">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Update
          </button>
        </div>
        <div className="text-center mt-4 col">
          <button className="btn btn-primary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
      {submitMessage && (
        <div
          className={`alert ${
            submitMessage.includes("Error") ? "alert-danger" : "alert-success"
          } mt-3`}
          role="alert"
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default SalaryEdit;
