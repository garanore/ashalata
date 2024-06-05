// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const MonthlyServiceChargeStatement = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    fetchData(event.target.value, startDate, endDate);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    fetchData(selectedBranch, event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    fetchData(selectedBranch, startDate, event.target.value);
  };

  const fetchData = (branch, startDate, endDate) => {
    if (branch && startDate && endDate) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/monthly-service-charge?branch=${branch}&startDate=${startDate}&endDate=${endDate}`
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
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const amPm = isPM ? "PM" : "AM";

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${amPm}`;
  };

  const currentTime = getCurrentTime();

  return (
    <div className="bg-light container-fluid p-2">
      <header className="text-center mb-4">
        <h1>আশা লতা সংস্থা</h1>
        <p>
          House No: 12/A, Block No. CEN(F), Road No. 104, Gulshan-2, Dhaka-1212
        </p>
        <h2>Branch Name: {selectedBranch}</h2>
        <h2>Monthly Service Charge Statement</h2>
        <p className="mt-3">
          Date Range: {startDate} {currentTime} to {endDate} {currentTime}
        </p>
      </header>

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
          <label htmlFor="startDateSelect" className="form-label">
            প্রথম তারিখ নির্বাচন করুণ
          </label>
          <input
            type="date"
            className="form-control"
            id="startDateSelect"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="endDateSelect" className="form-label">
            শেষ তারিখ নির্বাচন করুণ
          </label>
          <input
            type="date"
            className="form-control"
            id="endDateSelect"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th rowSpan="2">Product</th>
              <th colSpan="3" className="text-center">
                Opening Realizable Information
              </th>
              <th colSpan="3" className="text-center">
                Current Month Disburse
              </th>
              <th colSpan="3" className="text-center">
                Total Realizable
              </th>
              <th colSpan="2" className="text-center">
                Current Month Realized
              </th>
              <th colSpan="3" className="text-center">
                Closing Information
              </th>
            </tr>
            <tr>
              <th>Loan Outstanding Principal</th>
              <th>Service Charge</th>
              <th>Total Outstanding (P+I)</th>
              <th>No. of Loanee</th>
              <th>Loan Disburse Principal</th>
              <th>Service Charge</th>
              <th>No. of Loanee</th>
              <th>Principal</th>
              <th>Service Charge</th>
              <th>Principal</th>
              <th>Service Charge</th>
              <th>Principal</th>
              <th>Service Charge</th>
              <th>Total Outstanding (P+I)</th>
              <th>No. of Loanee</th>
            </tr>
          </thead>
          <tbody>
            {selectedBranch &&
              startDate &&
              endDate &&
              tableData.length === 0 && (
                <tr>
                  <td colSpan="17" className="text-center">
                    No data available for the selected branch and date range.
                  </td>
                </tr>
              )}
            {tableData.length > 0 &&
              tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.product}</td>
                  <td>{row.loanOutstandingPrincipal}</td>
                  <td>{row.serviceCharge}</td>
                  <td>{row.totalOutstanding}</td>
                  <td>{row.noOfLoanee}</td>
                  <td>{row.loanDisbursePrincipal}</td>
                  <td>{row.serviceChargeDisburse}</td>
                  <td>{row.noOfLoaneeDisburse}</td>
                  <td>{row.principalTotal}</td>
                  <td>{row.serviceChargeTotal}</td>
                  <td>{row.principalRealized}</td>
                  <td>{row.serviceChargeRealized}</td>
                  <td>{row.principalClosing}</td>
                  <td>{row.serviceChargeClosing}</td>
                  <td>{row.totalOutstandingClosing}</td>
                  <td>{row.noOfLoaneeClosing}</td>
                </tr>
              ))}
            {tableData.length > 0 && (
              <>
                <tr>
                  <td colSpan="8" className="text-end fw-bold">
                    Total:
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.loanOutstandingPrincipal,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce((sum, row) => sum + row.serviceCharge, 0)}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.totalOutstanding,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce((sum, row) => sum + row.noOfLoanee, 0)}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.loanDisbursePrincipal,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.serviceChargeDisburse,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.noOfLoaneeDisburse,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.principalTotal,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.serviceChargeTotal,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.principalRealized,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.serviceChargeRealized,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.principalClosing,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.serviceChargeClosing,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.totalOutstandingClosing,
                      0
                    )}
                  </td>
                  <td>
                    {tableData.reduce(
                      (sum, row) => sum + row.noOfLoaneeClosing,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="13" className="text-end">
                    Others Service Charge
                  </td>
                  <td colSpan="2">3103</td>
                  <td colSpan="5"></td>
                </tr>
                <tr>
                  <td colSpan="13" className="text-end">
                    Others Service Charge from 2nd Ledger Realized
                  </td>
                  <td colSpan="2">300</td>
                  <td colSpan="5"></td>
                </tr>
                <tr>
                  <td colSpan="13" className="text-end">
                    Others Service Charge Loan Fine Realized
                  </td>
                  <td colSpan="2">232</td>
                  <td colSpan="5"></td>
                </tr>
                <tr>
                  <td colSpan="13" className="text-end">
                    Total Service Charge
                  </td>
                  <td colSpan="2">816357</td>
                  <td colSpan="5"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyServiceChargeStatement;
