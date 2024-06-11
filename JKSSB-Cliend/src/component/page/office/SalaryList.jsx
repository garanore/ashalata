// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SalaryList = () => {
  const [workers, setWorkers] = useState([]);
  const [month, setMonth] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch salary data for the selected month
  const fetchSalaryData = async (selectedMonth) => {
    try {
      const response = await axios.get(
        "https://ashalota.gandhipoka.com/get-salary-data",
        {
          params: { month: selectedMonth },
        }
      );
      if (Array.isArray(response.data)) {
        setWorkers(response.data);
        setError("");
      } else {
        console.error("Unexpected response format", response.data);
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("There was an error fetching the worker salaries!", error);
      setError(
        "There was an error fetching the worker salaries! " + error.message
      );
    }
  };

  useEffect(() => {
    if (month) {
      fetchSalaryData(month);
    }
  }, [month]);

  useEffect(() => {
    if (month) {
      const filteredData = workers
        .map((worker) => {
          const monthIndex = worker.month.indexOf(month);
          if (monthIndex !== -1) {
            return {
              ...worker,
              basic: worker.basic[monthIndex],
              houseRent: worker.houseRent[monthIndex],
              medAllow: worker.medAllow[monthIndex],
              transAllow: worker.transAllow[monthIndex],
              special: worker.special[monthIndex],
              distance: worker.distance[monthIndex],
              deameSlance: worker.deameSlance[monthIndex],
              mobileBill: worker.mobileBill[monthIndex],
              commission: worker.commission[monthIndex],
              bonus: worker.bonus[monthIndex],
              totalSalary: worker.totalSalary[monthIndex],
              netPay: worker.netPay[monthIndex],
              pf: worker.pf[monthIndex],
              advance: worker.advance[monthIndex],
              loan: worker.loan[monthIndex],
              fsf: worker.fsf[monthIndex],
              healthFund: worker.healthFund[monthIndex],
              other: worker.other[monthIndex],
              offGrt: worker.offGrt[monthIndex],
              earned: worker.earned[monthIndex],
              offPf: worker.offPf[monthIndex],
              totalSalAndAllowances: worker.totalSalAndAllowances[monthIndex],
              comment: worker.comment[monthIndex],
            };
          }
          return null;
        })
        .filter((worker) => worker !== null);
      setFilteredWorkers(filteredData);
    }
  }, [month, workers]);

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

  const handleEdit = (worker) => {
    navigate("/home/SalaryEdit", {
      state: { workerID: worker.workerID, month },
    });
  };

  return (
    <div className="bg-light container-fluid p-2">
      <h2 className="text-center mt-4">Salary List</h2>
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
            id="salarymonth"
            value={month}
            onChange={handleMonthChange}
          />
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker) => (
              <tr key={worker.workerID}>
                <td>{worker.workerID}</td>
                <td>{worker.workerName}</td>
                <td>{worker.designation}</td>
                <td>{worker.basic}</td>
                <td>{worker.houseRent}</td>
                <td>{worker.medAllow}</td>
                <td>{worker.transAllow}</td>
                <td>{worker.special}</td>
                <td>{worker.distance}</td>
                <td>{worker.deameSlance}</td>
                <td>{worker.mobileBill}</td>
                <td>{worker.commission}</td>
                <td>{worker.bonus}</td>
                <td>{worker.totalSalary}</td>
                <td>{worker.pf}</td>
                <td>{worker.advance}</td>
                <td>{worker.loan}</td>
                <td>{worker.fsf}</td>
                <td>{worker.healthFund}</td>
                <td>{worker.other}</td>
                <td>{worker.netPay}</td>
                <td>{worker.offGrt}</td>
                <td>{worker.earned}</td>
                <td>{worker.offPf}</td>
                <td>{worker.offPf}</td>
                <td>{worker.totalSalAndAllowances}</td>
                <td>{worker.comment}</td>
                <td>
                  <button
                    type="button"
                    className="ms-3 btn btn-primary btn-sm"
                    onClick={() => handleEdit(worker)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryList;
