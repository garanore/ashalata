// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, navigate } from "react";

const incomeData = {
  1101: "Service Charge",
  1102: "Principle Amount",
  1103: "Sales of Forms",
  1104: "Admission Fee",
  1105: "Bank Interest",
  1106: "Fine/Remittance Commission",
  1107: "Interest on Head Office General A/C Fund",
  1108: "Miscellaneous Income",
  1109: "House Rent (Income)",
  1110: "Salary and Allowances (Income)",
};

const expenseData = {
  1205: "Interest on Head Office Fund",
  1206: "Interest on BO cum. Profit",
  1207: "Interest on Bank Loan",
  1208: "Loan Loss Provision",
};

const IncomeExpenseReport = () => {
  const [formData, setFormData] = useState({});
  const [branchs, setBranchs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`; // Default to current month
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalMonthPrinciple, settotalMonthPrinciple] = useState(0);
  const [sumMacroloanBranchMonth, setSumMacroloanBranchMonth] = useState(0);
  const [sumfromFeeBranchLoanMonth, setSumfromFeeBranchLoanMonth] = useState(0);
  const [sumFormFeeBranchMonth, setsumFormFeeBranchMonth] = useState(0);
  const [sumAdmissionFeesBranchMonth, setsumAdmissionFeesBranchMonth] =
    useState(0);

  // Fro Previous Month

  const [PreviousMonth1101, setPreviousMonth1101] = useState(0);
  const [PreviousMonth1102, setPreviousMonth1102] = useState(0);

  const [PreviousMonth1103, setPreviousMonth1103] = useState(0);
  const [PreviousMonth1104, setPreviousMonth1104] = useState(0);
  const [PreviousMonth1105, setPreviousMonth1105] = useState(0);
  const [PreviousMonth1106, setPreviousMonth1106] = useState(0);
  const [PreviousMonth1107, setPreviousMonth1107] = useState(0);
  const [PreviousMonth1108, setPreviousMonth1108] = useState(0);
  const [PreviousMonth1109, setPreviousMonth1109] = useState(0);
  const [PreviousMonth1110, setPreviousMonth1110] = useState(0);

  const [PreviousMonth1205, setPreviousMonth1205] = useState(0);
  const [PreviousMonth1206, setPreviousMonth1206] = useState(0);
  const [PreviousMonth1207, setPreviousMonth1207] = useState(0);
  const [PreviousMonth1208, setPreviousMonth1208] = useState(0);

  // For Current Month

  const [C1109, setC1109] = useState(0);
  const [C1110, setC1110] = useState(0);
  const [D1205, setD1205] = useState(0);
  const [D1206, setD1206] = useState(0);
  const [D1207, setD1207] = useState(0);
  const [D1208, setD1208] = useState(0);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/branch-callback");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBranchs(data);
      } catch (error) {
        console.error("Error fetching branch options:", error.message);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedMonth) {
      fetchBranchData(selectedBranch, selectedMonth);
    }
  }, [selectedBranch, selectedMonth]);

  const fetchBranchData = async (branch, month) => {
    if (!branch || !month) return;

    const formattedMonth = month.split("-").reverse().join("-");
    const encodedBranch = encodeURIComponent(branch);

    try {
      const responses = await Promise.all([
        fetch(
          `http://localhost:5000/interest-collection-by-branch/${encodedBranch}/${formattedMonth}`
        ),
        fetch(
          `http://localhost:5000/sum-macroloan-by-branch-month/${encodedBranch}/${formattedMonth}`
        ),
        fetch(
          `http://localhost:5000/get-AdmissionFee-by-branch-and-month/${encodedBranch}/${formattedMonth}`
        ),
        fetch(
          `http://localhost:5000/sum-sell-cost-by-month-branch/${encodedBranch}/${formattedMonth}`
        ),
        fetch(
          `http://localhost:5000/get-income-expense/${encodedBranch}/${formattedMonth}`
        ),
      ]);

      const [
        interestData,
        macroloanData,
        admissionFeeData,
        creditData,
        previousMonthData,
      ] = await Promise.all(
        responses.map((response) => {
          if (!response.ok) throw new Error("Failed to fetch");
          return response.json();
        })
      );

      setTotalInterest(interestData.totalInterest);
      settotalMonthPrinciple(interestData.totalMonthPrinciple);
      setSumMacroloanBranchMonth(macroloanData.sumMacroloanBranchMonth);
      setSumfromFeeBranchLoanMonth(macroloanData.sumfromFeeBranchLoanMonth);
      setsumAdmissionFeesBranchMonth(
        admissionFeeData.sumAdmissionFeesBranchMonth
      );
      setsumFormFeeBranchMonth(admissionFeeData.sumFormFeeBranchMonth);
      setD1205(creditData.D1205);
      setD1206(creditData.D1206);
      setD1207(creditData.D1207);
      setD1208(creditData.D1208);
      setC1109(creditData.C1109);
      setC1110(creditData.C1110);

      setPreviousMonth1101(previousMonthData.P1101);
      setPreviousMonth1102(previousMonthData.P1102);
      setPreviousMonth1103(previousMonthData.P1103);
      setPreviousMonth1104(previousMonthData.P1104);
      setPreviousMonth1105(previousMonthData.P1105);
      setPreviousMonth1106(previousMonthData.P1106);
      setPreviousMonth1107(previousMonthData.P1107);
      setPreviousMonth1108(previousMonthData.P1108);
      setPreviousMonth1109(previousMonthData.P1109);
      setPreviousMonth1110(previousMonthData.P1110);
      setPreviousMonth1205(previousMonthData.P1205);
      setPreviousMonth1206(previousMonthData.P1206);
      setPreviousMonth1207(previousMonthData.P1207);
      setPreviousMonth1208(previousMonthData.P1208);
    } catch (error) {
      console.error("Error fetching branch data:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));

    if (name === "centerBranch") {
      setSelectedBranch(value);
    }
  };

  useEffect(() => {
    fetchBranchData(selectedBranch, selectedMonth);
  }, [selectedBranch, selectedMonth]);

  const getMonthRange = (month) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(year, monthNum - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // Calculate totals for Income
  const totalIncomePreviousMonth = Object.entries(incomeData).reduce(
    (acc, [code]) => {
      let previousMonth = 0;

      if (code === "1101") previousMonth = parseFloat(PreviousMonth1101) || 0;
      if (code === "1102") previousMonth = parseFloat(PreviousMonth1102) || 0;
      if (code === "1103") previousMonth = parseFloat(PreviousMonth1103) || 0;
      if (code === "1104") previousMonth = parseFloat(PreviousMonth1104) || 0;
      if (code === "1105") previousMonth = parseFloat(PreviousMonth1105) || 0;
      if (code === "1106") previousMonth = parseFloat(PreviousMonth1106) || 0;
      if (code === "1107") previousMonth = parseFloat(PreviousMonth1107) || 0;
      if (code === "1108") previousMonth = parseFloat(PreviousMonth1108) || 0;
      if (code === "1109") previousMonth = parseFloat(PreviousMonth1109) || 0;
      if (code === "1110") previousMonth = parseFloat(PreviousMonth1110) || 0;

      return acc + previousMonth;
    },
    0
  );

  const totalIncomeCurrentMonth = Object.entries(incomeData).reduce(
    (acc, [code]) => {
      let currentMonth = 0;

      if (code === "1101") currentMonth = parseFloat(totalInterest) || 0;
      if (code === "1102") currentMonth = parseFloat(totalMonthPrinciple) || 0;
      if (code === "1103")
        currentMonth =
          (parseFloat(sumfromFeeBranchLoanMonth) || 0) +
          (parseFloat(sumFormFeeBranchMonth) || 0);
      if (code === "1108")
        currentMonth = parseFloat(sumMacroloanBranchMonth) || 0;
      if (code === "1104")
        currentMonth = parseFloat(sumAdmissionFeesBranchMonth) || 0;
      if (code === "1109") currentMonth = parseFloat(C1109) || 0;
      if (code === "1110") currentMonth = parseFloat(C1110) || 0;

      return acc + currentMonth;
    },
    0
  );

  const totalIncomeToDate = totalIncomePreviousMonth + totalIncomeCurrentMonth;

  // Calculate totals for Expense
  const totalExpensePreviousMonth = Object.entries(expenseData).reduce(
    (acc, [code]) => {
      let previousMonth = 0;

      if (code === "1205") previousMonth = parseFloat(PreviousMonth1205) || 0;
      if (code === "1206") previousMonth = parseFloat(PreviousMonth1206) || 0;
      if (code === "1207") previousMonth = parseFloat(PreviousMonth1207) || 0;
      if (code === "1208") previousMonth = parseFloat(PreviousMonth1208) || 0;

      return acc + previousMonth;
    },
    0
  );

  const totalExpenseCurrentMonth = Object.entries(expenseData).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "1205") currentMonth = parseFloat(D1205) || 0;
      if (code === "1206") currentMonth = parseFloat(D1206) || 0;
      if (code === "1207") currentMonth = parseFloat(D1207) || 0;
      if (code === "1208") currentMonth = parseFloat(D1208) || 0;

      return acc + currentMonth;
    },
    0
  );

  const totalExpenseToDate =
    totalExpensePreviousMonth + totalExpenseCurrentMonth;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = [];

    // Helper function to process and ensure toDateAmount is an integer
    const processAmount = (amount) => {
      return parseInt(amount, 10) || 0;
    };

    // Prepare income data
    Object.entries(incomeData).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code
      if (code === "1101")
        currentMonth =
          processAmount(totalInterest) + processAmount(PreviousMonth1101);
      if (code === "1102")
        currentMonth =
          processAmount(totalMonthPrinciple) + processAmount(PreviousMonth1102);
      if (code === "1103")
        currentMonth =
          processAmount(sumfromFeeBranchLoanMonth) +
          processAmount(sumFormFeeBranchMonth) +
          processAmount(PreviousMonth1103);
      if (code === "1108")
        currentMonth =
          processAmount(sumMacroloanBranchMonth) +
          processAmount(PreviousMonth1108);
      if (code === "1104")
        currentMonth =
          processAmount(sumAdmissionFeesBranchMonth) +
          processAmount(PreviousMonth1104);
      if (code === "1109")
        currentMonth = processAmount(C1109) + processAmount(PreviousMonth1109);
      if (code === "1110")
        currentMonth = processAmount(C1110) + processAmount(PreviousMonth1110);

      currentMonthAmount.push(currentMonth);
      toDateAmount.push(currentMonth); // Process and ensure integer

      payload.push({
        branch: selectedBranch,
        productCode: code,
        productName,
        month: months,
        currentMonthAmount,
        toDateAmount,
      });
    });

    // Prepare expense data
    Object.entries(expenseData).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code
      if (code === "1205")
        currentMonth = processAmount(D1205) + processAmount(PreviousMonth1205);
      if (code === "1206")
        currentMonth = processAmount(D1206) + processAmount(PreviousMonth1206);
      if (code === "1207")
        currentMonth = processAmount(D1207) + processAmount(PreviousMonth1207);
      if (code === "1208")
        currentMonth = processAmount(D1208) + processAmount(PreviousMonth1208);

      currentMonthAmount.push(currentMonth);
      toDateAmount.push(currentMonth); // Process and ensure integer

      payload.push({
        branch: selectedBranch,
        productCode: code,
        productName,
        month: months,
        currentMonthAmount,
        toDateAmount,
      });
    });

    try {
      const response = await fetch(
        "http://localhost:5000/save-income-expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSubmitMessage("Data saved successfully!");
      } else {
        setSubmitMessage(`Error saving data: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving data:", error.message);
      setSubmitMessage(`Error saving data: ${error.message}`);
    }
  };

  const handleEditClick = () => {
    navigate("/home/VoucherEdit");
  };
  const handleDownloadClick = () => {
    navigate("/home/VoucherDownload");
  };

  return (
    <div className="container-fluid mt-5">
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <h2>Ashalata</h2>
          <h4>Branch Name: {selectedBranch}</h4>
          <h6>Month: {getMonthRange(selectedMonth)}</h6>
          <h5>Income Expense</h5>
        </div>

        <div className="row mb-5 mt-5">
          <div className="col-6 text-center">
            <label htmlFor="monthInput" className="form-label">
              মাস নির্বাচন করুণ
            </label>
            <input
              type="month"
              id="monthInput"
              className="form-control"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </div>
          <div className="mb-3 col-6 col-md-6">
            <label htmlFor="centerBranch" className="form-label">
              শাঁখা নির্বাচন করুণ
            </label>
            <select
              id="centerBranch"
              className="form-select"
              value={formData.centerBranch || ""}
              onChange={handleChange}
              name="centerBranch"
            >
              <option value="">Choose...</option>
              {branchs.map((branch) => (
                <option key={branch._id} value={branch.BranchName}>
                  {branch.BranchName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h5>Incomes</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>To Previous Month</th>
                  <th>Current Month</th>
                  <th>To Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(incomeData).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "1101") previousMonth = PreviousMonth1101 || 0;
                  if (code === "1102") previousMonth = PreviousMonth1102 || 0;
                  if (code === "1103") previousMonth = PreviousMonth1103 || 0;
                  if (code === "1104") previousMonth = PreviousMonth1104 || 0;
                  if (code === "1105") previousMonth = PreviousMonth1105 || 0;
                  if (code === "1106") previousMonth = PreviousMonth1106 || 0;
                  if (code === "1107") previousMonth = PreviousMonth1107 || 0;
                  if (code === "1108") previousMonth = PreviousMonth1108 || 0;
                  if (code === "1109") previousMonth = PreviousMonth1109 || 0;
                  if (code === "1110") previousMonth = PreviousMonth1110 || 0;

                  // Assign values based on code
                  if (code === "1101") currentMonth = totalInterest || 0;
                  if (code === "1102") currentMonth = totalMonthPrinciple || 0;
                  if (code === "1103")
                    currentMonth =
                      (sumfromFeeBranchLoanMonth || 0) +
                      (sumFormFeeBranchMonth || 0);
                  if (code === "1108")
                    currentMonth = sumMacroloanBranchMonth || 0;
                  if (code === "1104")
                    currentMonth = sumAdmissionFeesBranchMonth || 0;
                  if (code === "1109") currentMonth = C1109 || 0;
                  if (code === "1110") currentMonth = C1110 || 0;
                  // Ensure they are numbers
                  previousMonth = Number(previousMonth);
                  currentMonth = Number(currentMonth);

                  const toDate = previousMonth + currentMonth;

                  return (
                    <tr key={code}>
                      <td>{code}</td>
                      <td>{description}</td>
                      <td>{previousMonth}</td>
                      <td>{currentMonth}</td>
                      <td>{toDate}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total
                  </td>

                  <td>{totalIncomePreviousMonth}</td>
                  <td>{totalIncomeCurrentMonth}</td>
                  <td>{totalIncomeToDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 mt-4">
            <h5>Expenses</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>To Previous Month</th>
                  <th>Current Month</th>
                  <th>To Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(expenseData).map(([code, description]) => {
                  let previousMonth = 0;
                  let currentMonth = 0;

                  // Assign values for previous month based on code
                  if (code === "1205") previousMonth = PreviousMonth1205 || 0;
                  if (code === "1206") previousMonth = PreviousMonth1206 || 0;
                  if (code === "1207") previousMonth = PreviousMonth1207 || 0;
                  if (code === "1208") previousMonth = PreviousMonth1208 || 0;

                  // Assign values for current month based on code
                  if (code === "1205") currentMonth = D1205 || 0;
                  if (code === "1206") currentMonth = D1206 || 0;
                  if (code === "1207") currentMonth = D1207 || 0;
                  if (code === "1208") currentMonth = D1208 || 0;
                  // Ensure they are numbers
                  previousMonth = Number(previousMonth);
                  currentMonth = Number(currentMonth);
                  const toDate = previousMonth + currentMonth;

                  return (
                    <tr key={code}>
                      <td>{code}</td>
                      <td>{description}</td>
                      <td>{previousMonth}</td>
                      <td>{currentMonth}</td>
                      <td>{toDate}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total
                  </td>
                  <td>{totalExpensePreviousMonth}</td>
                  <td>{totalExpenseCurrentMonth}</td>
                  <td>{totalExpenseToDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 mt-4">
            <div className="d-flex justify-content-between">
              <h5>Total Expenditure</h5>
              <h5>Net Profit (Loss): </h5>
            </div>
            <p>
              Here you can add the calculation of the totals and net profit/loss
              based on the provided data.
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-5">
          <button className="btn btn-primary">Submit</button>

          <button
            type="button"
            className="ms-3 btn btn-primary btn-sm"
            onClick={() => handleDownloadClick()}
          >
            Download
          </button>

          <button
            type="button"
            className="ms-3 btn btn-primary btn-sm"
            onClick={() => handleEditClick()}
          >
            Edit
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
      </form>
    </div>
  );
};

export default IncomeExpenseReport;
