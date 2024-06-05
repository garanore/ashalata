// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const DailyDepositRegister = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedDate) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/branch-data?branch=${selectedBranch}&date=${selectedDate}`
        )
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table data:", error);
        });
    } else {
      setTableData([]);
    }
  }, [selectedBranch, selectedDate]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="bg-light container-fluid p-2">
      <h1 className="text-center my-4">আশা লতা সংস্থা</h1>
      <h3 className="text-center mb-4">Daily Deposit Register New</h3>
      <h4 className="text-center mb-4">Branch Name: {selectedBranch}</h4>
      <h5 className="text-center mb-4">
        Date:{" "}
        {selectedDate
          ? new Date(selectedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </h5>

      <div className="row mb-5">
        <div className="col-md-3">
          <label htmlFor="branchSelect" className="form-label">
            শাঁখা নির্বাচন করুণ
          </label>
          <select
            className="form-select"
            id="branchSelect"
            value={selectedBranch}
            onChange={handleBranchChange}
          >
            <option value="">Choose...</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch.BranchName}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="dateSelect" className="form-label">
            তারিখ নির্বাচন করুণ
          </label>
          <input
            type="date"
            className="form-control"
            id="dateSelect"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover mt-5">
          <thead>
            <tr>
              <th rowSpan="2">Sl. No.</th>
              <th rowSpan="2">Program Organizer</th>
              <th rowSpan="2">Center/Sanity</th>
              <th rowSpan="2">Savings Account</th>
              <th colSpan="16" className="text-center">
                Loan Account Realized
              </th>
              <th colSpan="7"></th>
            </tr>
            <tr>
              <th>General Loan Weekly</th>
              <th>General Loan (Monthly)</th>
              <th>Agriculture Loan</th>
              <th>Agriculture Loan (Monthly)</th>
              <th>SME Loan Weekly</th>
              <th>SME Loan (Monthly)</th>
              <th>Seasonal Loan Weekly</th>
              <th>Seasonal Loan (Monthly)</th>
              <th>ICT Loan Weekly</th>
              <th>ICT Loan (Monthly)</th>
              <th>Agriculture (SMAP)</th>
              <th>Water & Sanitation</th>
              <th>Disaster Loan</th>
              <th>Hand Emergency Loan</th>
              <th>Total Service Charge</th>
              <th>Forms and Format</th>
              <th>Admission Fee</th>
              <th>Micro Insurance</th>
              <th>2nd Ledger</th>
              <th>Fine</th>
              <th>DFS Amount</th>
              <th>Total</th>
              <th>Sign</th>
            </tr>
          </thead>
          <tbody>
            {selectedBranch && selectedDate && tableData.length === 0 && (
              <tr>
                <td colSpan="24" className="text-center">
                  No data available for the selected branch and date.
                </td>
              </tr>
            )}
            {selectedBranch &&
              selectedDate &&
              tableData.length > 0 &&
              tableData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.programOrganizer}</td>
                  <td>{row.centerSanity}</td>
                  <td>{row.savingsAccount}</td>
                  <td>{row.generalLoanWeekly}</td>
                  <td>{row.generalLoanMonthly}</td>
                  <td>{row.agricultureLoan}</td>
                  <td>{row.agricultureLoanMonthly}</td>
                  <td>{row.smeLoanWeekly}</td>
                  <td>{row.smeLoanMonthly}</td>
                  <td>{row.seasonalLoanWeekly}</td>
                  <td>{row.seasonalLoanMonthly}</td>
                  <td>{row.ictLoanWeekly}</td>
                  <td>{row.ictLoanMonthly}</td>
                  <td>{row.agricultureSMAP}</td>
                  <td>{row.waterSanitation}</td>
                  <td>{row.disasterLoan}</td>
                  <td>{row.handEmergencyLoan}</td>
                  <td>{row.totalServiceCharge}</td>
                  <td>{row.formsAndFormat}</td>
                  <td>{row.admissionFee}</td>
                  <td>{row.microInsurance}</td>
                  <td>{row.secondLedger}</td>
                  <td>{row.fine}</td>
                  <td>{row.dfsAmount}</td>
                  <td>{row.total}</td>
                  <td>{row.sign}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyDepositRegister;
