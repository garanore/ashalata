// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";

const Salary = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);
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
    comment: {},
  });
  const [month, setMonth] = useState("");

  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/worker-callback-salary")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setWorkers(response.data);
        } else {
          setError("Unexpected response format");
          console.error("Unexpected response format", response.data);
        }
      })
      .catch((error) => {
        setError("There was an error fetching the workers!");
        console.error("There was an error fetching the workers!", error);
      });
  }, []);

  const handleChange = (field, id, value) => {
    const basic = field === "basic" ? value : fields.basic[id] || 0;
    const houseRent = (basic * 100) / 100; // 100% of Basic
    const medAllow = (basic * 6.66666667) / 100; // 6.66666667% of Basic
    const transAllow = (basic * 6.66666667) / 100; // 6.66666667% of Basic

    setFields((prevFields) => ({
      ...prevFields,
      [field]: { ...prevFields[field], [id]: value },
      houseRent: { ...prevFields.houseRent, [id]: houseRent },
      medAllow: { ...prevFields.medAllow, [id]: medAllow },
      transAllow: { ...prevFields.transAllow, [id]: transAllow },
    }));
  };

  const calculateTotal = (field) => {
    return Object.values(fields[field]).reduce(
      (total, amount) => total + (parseFloat(amount) || 0),
      0
    );
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
      return workers.reduce((total, worker) => {
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

  const calculateTotalNetPay = () => {
    return workers.reduce((total, worker) => {
      const id = worker.workerID;
      return total + calculateNetPay(id);
    }, 0);
  };

  const calculateTotalPF = (id) => {
    const pf = parseFloat(fields.pf[id]) || 0;
    const offGrt = parseFloat(fields.offGrt[id]) || 0;
    const earned = parseFloat(fields.earned[id]) || 0;
    const offPf = parseFloat(fields.offPf[id]) || 0;
    return pf + offGrt + earned + offPf;
  };

  const calculateTotalPFAll = () => {
    return workers.reduce((total, worker) => {
      const id = worker.workerID;
      return total + calculateTotalPF(id);
    }, 0);
  };

  const calculateTotalSalAndAllowances = (id) => {
    const netPay = calculateNetPay(id);
    const totalPF = calculateTotalPF(id);
    return netPay - totalPF;
  };

  const calculateTotalSalAndAllowancesAll = () => {
    return workers.reduce((total, worker) => {
      const id = worker.workerID;
      return total + calculateTotalSalAndAllowances(id);
    }, 0);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const getFormattedMonth = (month) => {
    if (!month) return "Select a month";
    const date = new Date(month);
    return (
      date.toLocaleString("default", { month: "long" }) +
      `, ${date.getFullYear()}`
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleSubmit = async () => {
    const data = workers.map((worker) => ({
      workerID: worker.workerID,
      workerName: worker.WorkerName, // Ensure this matches the actual field name in your workers data
      designation: worker.Designation,
      basic: fields.basic[worker.workerID] || 0,
      houseRent: fields.houseRent[worker.workerID] || 0,
      medAllow: fields.medAllow[worker.workerID] || 0,
      transAllow: fields.transAllow[worker.workerID] || 0,
      special: fields.special[worker.workerID] || 0,
      distance: fields.distance[worker.workerID] || 0,
      deameSlance: fields.deameSlance[worker.workerID] || 0,
      mobileBill: fields.mobileBill[worker.workerID] || 0,
      commission: fields.commission[worker.workerID] || 0,
      bonus: fields.bonus[worker.workerID] || 0,
      totalSalary: calculateTotalSalary(worker.workerID),
      pf: fields.pf[worker.workerID] || 0,
      advance: fields.advance[worker.workerID] || 0,
      loan: fields.loan[worker.workerID] || 0,
      fsf: fields.fsf[worker.workerID] || 0,
      healthFund: fields.healthFund[worker.workerID] || 0,
      other: fields.other[worker.workerID] || 0,
      netPay: calculateNetPay(worker.workerID),
      offGrt: fields.offGrt[worker.workerID] || 0,
      earned: fields.earned[worker.workerID] || 0,
      offPf: fields.offPf[worker.workerID] || 0,
      totalPF: calculateTotalPF(worker.workerID),
      totalSalAndAllowances: calculateTotalSalAndAllowances(worker.workerID),
      comment: fields.comment[worker.workerID] || "",
      month, // Add the month here
    }));

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "https://ashalota.gandhipoka.com/save-worker-salary",
        { salaryDate: month, data }
      );
      setSubmitMessage("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setSubmitMessage("Error saving data!");
    }
  };

  return (
    <div className="bg-light container-fluid p-2">
      <h2 className="text-center mt-4">Salary Sheet</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          For the month of: <strong>{getFormattedMonth(month)}</strong>
        </div>
        <div className="col-md-3">
          <label className="form-label" htmlFor="salarymonth">
            মাস নির্বাচন করুণ
          </label>
          <input
            className="form-control"
            type="month"
            id="msalarymonth"
            value={month}
            onChange={handleMonthChange}
          />
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th rowSpan="2">ID</th>
              <th rowSpan="2">Employee Name</th>
              <th rowSpan="2">Designation</th>
              <th colSpan="5">Salary</th>
              <th colSpan="5">Other Benefits</th>
              <th rowSpan="2">Total Salary</th>
              <th colSpan="6">Deductions</th>
              <th rowSpan="2">Net Pay</th>
              <th colSpan="5">Administrative</th>
            </tr>
            <tr>
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
              <th>PF</th>
              <th>Advance</th>
              <th>Loan</th>
              <th>FSF</th>
              <th>Health Fund</th>
              <th>Other</th>
              <th>Off. Grt</th>
              <th>Earned</th>
              <th>Off. PF</th>
              <th>Total PF</th>
              <th rowSpan="2">Total Sal. & Allowances</th>
              <th colSpan="5">Comment</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.workerID}>
                <td>{worker.workerID}</td>
                <td>{worker.WorkerName}</td>
                <td>{worker.Designation}</td>
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
                <td>{fields.houseRent[worker.workerID]?.toFixed(2) || "-"}</td>
                <td>{fields.medAllow[worker.workerID]?.toFixed(2) || "-"}</td>
                <td>{fields.transAllow[worker.workerID]?.toFixed(2) || "-"}</td>
                <td>
                  <input
                    type="number"
                    value={fields.special[worker.workerID] || ""}
                    placeholder="Enter Special Allowance"
                    onChange={(e) =>
                      handleChange("special", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.distance[worker.workerID] || ""}
                    placeholder="Enter Distance Allowance"
                    onChange={(e) =>
                      handleChange("distance", worker.workerID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={fields.deameSlance[worker.workerID] || ""}
                    placeholder="Enter Deame s/lance"
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
                    placeholder="Enter PF Amount"
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
                    placeholder="put you comment "
                    onChange={(e) =>
                      handleChange("comment", worker.workerID, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3">Total</td>
              <td>{calculateTotal("basic")}</td>
              <td>{calculateTotal("houseRent")}</td>
              <td>{calculateTotal("medAllow")}</td>
              <td>{calculateTotal("transAllow")}</td>
              <td>{calculateTotal("special")}</td>
              <td>{calculateTotal("distance")}</td>
              <td>{calculateTotal("deameSlance")}</td>
              <td>{calculateTotal("mobileBill")}</td>
              <td>{calculateTotal("commission")}</td>
              <td>{calculateTotal("bonus")}</td>
              <td>{calculateTotalSalary()}</td>
              <td>{calculateTotal("pf")}</td>
              <td>{calculateTotal("advance")}</td>
              <td>{calculateTotal("loan")}</td>
              <td>{calculateTotal("fsf")}</td>
              <td>{calculateTotal("healthFund")}</td>
              <td>{calculateTotal("other")}</td>
              <td>{calculateTotalNetPay()}</td>
              <td>{calculateTotal("offGrt")}</td>
              <td>{calculateTotal("earned")}</td>
              <td>{calculateTotal("offPf")}</td>
              <td>{calculateTotalPFAll()}</td>
              <td>{calculateTotalSalAndAllowancesAll()}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save All
        </button>
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

export default Salary;
