// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const dayMapping = {
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
  Saturday: "শনিবার",
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}-${month}-${String(year).slice(-2)}`;
};

const formatDateAdmissionFee = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${year}-${month}-${day}`; // Changed to YYYY-MM-DD format
};

const DailyDepositRegister = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Fetch branches on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  // Fetch and filter data based on selectedCenter and selectedDate
  useEffect(() => {
    const fetchTotalSavings = async (centerID, date) => {
      try {
        //Get data for totalSavings

        const formattedDate = formatDate(date);

        const response = await axios.get(
          `http://localhost:5000/saving-collection-by-center/${centerID}/${formattedDate}`
        );

        return response.data.totalSavings;
      } catch (error) {
        console.error(
          `Error fetching total savings for center ${centerID} on ${date}:`,
          error
        );
        return 0;
      }
    };

    //Get data for totalInterest

    const fetchTotalInterest = async (centerID, date) => {
      try {
        const formattedDate = formatDate(date);

        const response = await axios.get(
          `http://localhost:5000/interest-collection-by-center/${centerID}/${formattedDate}`
        );

        return response.data.totalInterest;
      } catch (error) {
        console.error(
          `Error fetching total savings for center ${centerID} on ${date}:`,
          error
        );
        return 0;
      }
    };

    //Get data for sumAdmissionFees

    const fetchTotalAdmissionFees = async (centerID, date) => {
      try {
        const formattedDate = formatDateAdmissionFee(date);

        const response = await axios.get(
          `http://localhost:5000/get-AdmissionFee-by-center-and-date/${centerID}/${formattedDate}`
        );

        return response.data.sumAdmissionFees;
      } catch (error) {
        console.error(
          `Error fetching total savings for center ${centerID} on ${date}:`,
          error
        );
        return 0;
      }
    };

    //Get data for sumMacroloan

    const fetchTotalMicroloan = async (centerID, date) => {
      try {
        const formattedDate = formatDate(date);

        const response = await axios.get(
          `http://localhost:5000/sum-macroloan/${centerID}/${formattedDate}`
        );

        return response.data.sumMacroloan;
      } catch (error) {
        console.error(
          `Error fetching total savings for center ${centerID} on ${date}:`,
          error
        );
        return 0;
      }
    };

    //Get data for LoanData

    const fetchLoanData = async (centerID, date) => {
      try {
        const formattedDate = formatDate(date);

        const response = await axios.get(
          `http://localhost:5000/loan-collection-by-center/${centerID}/${formattedDate}`
        );

        return response.data;
      } catch (error) {
        console.error(
          `Error fetching loan data for center ${centerID} on ${date}:`,
          error
        );
        return {
          normal: 0,
          tubewell: 0,
          farmer: 0,
          sme: 0,
          emergency: 0,
          disaster: 0,
          daily: 0,
        };
      }
    };

    if (selectedBranch && selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
      const translatedDay = dayMapping[dayOfWeek];

      axios
        .get(
          `http://localhost:5000/center-callback-by-branch/${selectedBranch}`
        )
        .then(async (branchResponse) => {
          const branchData = branchResponse.data;

          axios
            .get(
              `http://localhost:5000/center-callback-by-CenterDay/${translatedDay}`
            )
            .then(async (dayResponse) => {
              const dayData = dayResponse.data;

              if (!dayData || dayData.length === 0) {
                console.warn(`No data found for the day: ${translatedDay}`);
              }

              // Filter data that matches both selectedBranch and translatedDay
              const filteredData = branchData.filter((item) =>
                dayData.some((dayItem) => dayItem._id === item._id)
              );

              // Fetch total savings, Interest, Macro loan and loan data for each center in filteredData
              const enrichedData = await Promise.all(
                filteredData.map(async (item) => {
                  // For TotalSaving
                  const totalSavings = await fetchTotalSavings(
                    item.centerID,
                    selectedDate
                  );

                  // For sumAdmissionFees
                  const sumAdmissionFees = await fetchTotalAdmissionFees(
                    item.centerID,
                    selectedDate
                  );

                  // For TotalInterest
                  const totalInterest = await fetchTotalInterest(
                    item.centerID,
                    selectedDate
                  );

                  // For TotalMacroloan
                  const sumMacroloan = await fetchTotalMicroloan(
                    item.centerID,
                    selectedDate
                  );

                  // For TotalloanData
                  const loanData = await fetchLoanData(
                    item.centerID,
                    selectedDate
                  );

                  // Calculate the total sum
                  const total =
                    totalSavings +
                    (loanData["সাধারণ ঋণ"] || 0) +
                    (loanData["কৃষি ঋণ"] || 0) +
                    (loanData["এস এম ই ঋণ"] || 0) +
                    (loanData["নলকূপ ঋণ"] || 0) +
                    (loanData["জরুরী ঋণ"] || 0) +
                    (loanData["দুর্যোগ ঋণ"] || 0) +
                    (loanData["দৈনিক ঋণ"] || 0) +
                    totalInterest +
                    (loanData.formsAndFormat || 0) +
                    sumAdmissionFees +
                    sumMacroloan +
                    (loanData.secondLedger || 0) +
                    (loanData.fine || 0) +
                    (loanData.dfsAmount || 0);

                  return {
                    ...item,
                    totalSavings,
                    ...loanData,
                    sumMacroloan,
                    totalInterest,
                    sumAdmissionFees,
                    total,
                  };
                })
              );

              setTableData(enrichedData);
            })
            .catch((error) => {
              console.error("Error fetching data by day:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data by branch:", error);
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
              <th colSpan="7" className="text-center">
                Loan Account Realized
              </th>
              <th colSpan="7"></th>
            </tr>
            <tr>
              <th>General </th>
              <th>Agriculture </th>
              <th>SME</th>
              <th>Water & Sanitation</th>
              <th>Disaster </th>
              <th>Emergency</th>
              <th>Daily</th>

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
                  <td>{row.centerWorker}</td>
                  <td>{row.centerID}</td>
                  <td>{row.totalSavings}</td>

                  <td>{row["সাধারণ ঋণ"] || 0}</td>
                  <td>{row["কৃষি ঋণ"] || 0}</td>
                  <td>{row["এস এম ই ঋণ"] || 0}</td>
                  <td>{row["নলকূপ ঋণ"] || 0}</td>
                  <td>{row["জরুরী ঋণ"] || 0}</td>
                  <td>{row["দুর্যোগ ঋণ"] || 0}</td>
                  <td>{row["দৈনিক ঋণ"] || 0}</td>

                  <td>{row.totalInterest}</td>
                  <td>{row.formsAndFormat}</td>
                  <td>{row.sumAdmissionFees}</td>
                  <td>{row.sumMacroloan}</td>
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
