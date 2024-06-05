// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const LoanPortfolioStatement = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
    if (selectedBranch && selectedMonth) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/branch-data?branch=${selectedBranch}&month=${selectedMonth}`
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
  }, [selectedBranch, selectedMonth]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-light container-fluid p-2">
      <h1 className="text-center my-4">আশা লতা সংস্থা</h1>
      <h3 className="text-center mb-4">
        Branch Loan Portfolio Statement (Asha Lata)
      </h3>
      <h4 className="text-center mb-4">Office Name: {selectedBranch}</h4>
      <h5 className="text-center mb-4">
        Month Name: {selectedMonth ? formatMonthYear(selectedMonth) : ""}
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
          <label htmlFor="monthSelect" className="form-label">
            মাস নির্বাচন করুণ
          </label>
          <input
            type="month"
            className="form-control"
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover mt-5">
          <thead>
            <tr>
              <th rowSpan="2">Product</th>
              <th colSpan="6" className="text-center">
                Opening Information
              </th>
              <th colSpan="6" className="text-center">
                Current Month
              </th>
              <th colSpan="8" className="text-center">
                Closing Information
              </th>
            </tr>
            <tr>
              <th>No of Center</th>
              <th>Active Loanee</th>
              <th>Over Due Loanee</th>
              <th>Over Due Amount</th>
              <th>Loan Outstanding</th>
              <th>Rate of Recovery</th>
              <th>PAR Amount</th>
              <th>PAR %</th>
              <th>Disburse Cur Month</th>
              <th>Realized Cur Month</th>
              <th>Realizable Amount</th>
              <th>Advance Realized</th>
              <th>Over Due Amount</th>
              <th>Rebate Amount</th>
              <th>Loan Outstanding</th>
              <th>PAR Amount</th>
              <th>PAR %</th>
              <th>Rate of Recovery</th>
              <th>Active Loanee</th>
              <th>Over Due Loanee</th>
            </tr>
          </thead>
          <tbody>
            {selectedBranch && selectedMonth && tableData.length === 0 && (
              <tr>
                <td colSpan="20" className="text-center">
                  No data available for the selected branch and month.
                </td>
              </tr>
            )}
            {selectedBranch &&
              selectedMonth &&
              tableData.length > 0 &&
              tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.product}</td>
                  <td>{row.noOfCenter}</td>
                  <td>{row.activeLoanee}</td>
                  <td>{row.overDueLoanee}</td>
                  <td>{row.overDueAmount}</td>
                  <td>{row.loanOutstanding}</td>
                  <td>{row.rateOfRecovery}</td>
                  <td>{row.parAmount}</td>
                  <td>{row.parPercentage}</td>
                  <td>{row.disburseCurMonth}</td>
                  <td>{row.realizedCurMonth}</td>
                  <td>{row.realizableAmount}</td>
                  <td>{row.advanceRealized}</td>
                  <td>{row.overDueAmount}</td>
                  <td>{row.rebateAmount}</td>
                  <td>{row.loanOutstanding}</td>
                  <td>{row.parAmount}</td>
                  <td>{row.parPercentage}</td>
                  <td>{row.rateOfRecovery}</td>
                  <td>{row.activeLoanee}</td>
                  <td>{row.overDueLoanee}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanPortfolioStatement;
