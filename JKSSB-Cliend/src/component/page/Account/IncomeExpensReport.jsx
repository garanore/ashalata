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
  1209: "Salary & Allowance",
  1210: "National Exchequer",
  1211: "Office Rent",
  1212: "Printing",
  1213: "Stationaries",
  1214: "Entertainment",
  1215: "Conveyance",
  1216: "Bank Charge",
  1217: "Electricity, Gas & Water Bill",
  1218: "Depreciation",
  1219: "Training & Workshop Expenses",
  1220: "Fuel",
  1221: "Postage & Telegram",
  1222: "Telephone, Fax & Email",
  1223: "Miscellaneous Expenses",
  1224: "Interest on JICA (SMAP)",
  1225: "Gardening & Beautification",
  1226: "Computer Accessories",
  1227: "Maintainance",
  1228: "Newspaper",
  1229: "Residence Rent",
};
const InterestSavings = {
  1201: "Interest on General Savings",
  1202: "Interest on Contractual Savings",
  1203: "Interest on Regular Voluntary Savings",
  1204: "Interest on Time Deposit",
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
  const [PreviousMonth1209, setPreviousMonth1209] = useState(0);
  const [PreviousMonth1210, setPreviousMonth1210] = useState(0);
  const [PreviousMonth1211, setPreviousMonth1211] = useState(0);
  const [PreviousMonth1212, setPreviousMonth1212] = useState(0);
  const [PreviousMonth1213, setPreviousMonth1213] = useState(0);
  const [PreviousMonth1214, setPreviousMonth1214] = useState(0);
  const [PreviousMonth1215, setPreviousMonth1215] = useState(0);
  const [PreviousMonth1216, setPreviousMonth1216] = useState(0);
  const [PreviousMonth1217, setPreviousMonth1217] = useState(0);
  const [PreviousMonth1218, setPreviousMonth1218] = useState(0);
  const [PreviousMonth1219, setPreviousMonth1219] = useState(0);
  const [PreviousMonth1220, setPreviousMonth1220] = useState(0);
  const [PreviousMonth1221, setPreviousMonth1221] = useState(0);
  const [PreviousMonth1222, setPreviousMonth1222] = useState(0);
  const [PreviousMonth1223, setPreviousMonth1223] = useState(0);
  const [PreviousMonth1224, setPreviousMonth1224] = useState(0);
  const [PreviousMonth1225, setPreviousMonth1225] = useState(0);
  const [PreviousMonth1226, setPreviousMonth1226] = useState(0);
  const [PreviousMonth1227, setPreviousMonth1227] = useState(0);
  const [PreviousMonth1228, setPreviousMonth1228] = useState(0);
  const [PreviousMonth1229, setPreviousMonth1229] = useState(0);

  // For Saving

  // const [PreviousMonth1201, setPreviousMonth1201] = useState(0);
  // const [PreviousMonth1202, setPreviousMonth1202] = useState(0);
  // const [PreviousMonth1203, setPreviousMonth1203] = useState(0);
  // const [PreviousMonth1204, setPreviousMonth1204] = useState(0);

  // For Current Month

  const [C1105, setC1105] = useState(0);
  const [C1106, setC1106] = useState(0);
  const [C1107, setC1107] = useState(0);
  const [C1109, setC1109] = useState(0);
  const [C1110, setC1110] = useState(0);
  const [D1205, setD1205] = useState(0);
  const [D1206, setD1206] = useState(0);
  const [D1207, setD1207] = useState(0);
  const [D1208, setD1208] = useState(0);
  const [D1209, setD1209] = useState(0);
  const [D1210, setD1210] = useState(0);
  const [D1211, setD1211] = useState(0);
  const [D1212, setD1212] = useState(0);
  const [D1213, setD1213] = useState(0);
  const [D1214, setD1214] = useState(0);
  const [D1215, setD1215] = useState(0);
  const [D1216, setD1216] = useState(0);
  const [D1217, setD1217] = useState(0);
  const [D1218, setD1218] = useState(0);
  const [D1219, setD1219] = useState(0);
  const [D1220, setD1220] = useState(0);
  const [D1221, setD1221] = useState(0);
  const [D1222, setD1222] = useState(0);
  const [D1223, setD1223] = useState(0);
  const [D1224, setD1224] = useState(0);
  const [D1225, setD1225] = useState(0);
  const [D1226, setD1226] = useState(0);
  const [D1227, setD1227] = useState(0);
  const [D1228, setD1228] = useState(0);
  const [D1229, setD1229] = useState(0);

  // // For Saving
  // const [D1201, setD1201] = useState(0);
  // const [D1202, setD1202] = useState(0);
  // const [D1203, setD1203] = useState(0);
  // const [D1204, setD1204] = useState(0);

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
      setD1209(creditData.D1209);
      setD1210(creditData.D1210);
      setD1211(creditData.D1211);
      setD1212(creditData.D1212);
      setD1213(creditData.D1213);
      setD1214(creditData.D1214);
      setD1215(creditData.D1215);
      setD1216(creditData.D1216);
      setD1217(creditData.D1217);
      setD1218(creditData.D1218);
      setD1219(creditData.D1219);
      setD1220(creditData.D1220);
      setD1221(creditData.D1221);
      setD1222(creditData.D1222);
      setD1223(creditData.D1223);
      setD1224(creditData.D1224);
      setD1225(creditData.D1225);
      setD1226(creditData.D1226);
      setD1227(creditData.D1227);
      setD1228(creditData.D1228);
      setD1229(creditData.D1229);

      setC1105(creditData.C1105);
      setC1106(creditData.C1106);
      setC1107(creditData.C1107);
      setC1109(creditData.C1109);
      setC1110(creditData.C1110);

      // setD1201(creditData.D1201);
      // setD1202(creditData.D1202);
      // setD1203(creditData.D1203);
      // setD1204(creditData.D1204);

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
      setPreviousMonth1209(previousMonthData.P1209);
      setPreviousMonth1210(previousMonthData.P1210);
      setPreviousMonth1219(previousMonthData.P1219);
      setPreviousMonth1211(previousMonthData.P1211);
      setPreviousMonth1212(previousMonthData.P1212);
      setPreviousMonth1213(previousMonthData.P1213);
      setPreviousMonth1214(previousMonthData.P1214);
      setPreviousMonth1215(previousMonthData.P1215);
      setPreviousMonth1216(previousMonthData.P1216);
      setPreviousMonth1217(previousMonthData.P1217);
      setPreviousMonth1218(previousMonthData.P1218);
      setPreviousMonth1220(previousMonthData.P1220);
      setPreviousMonth1221(previousMonthData.P1221);
      setPreviousMonth1222(previousMonthData.P1222);
      setPreviousMonth1223(previousMonthData.P1223);
      setPreviousMonth1224(previousMonthData.P1224);
      setPreviousMonth1225(previousMonthData.P1225);
      setPreviousMonth1226(previousMonthData.P1226);
      setPreviousMonth1227(previousMonthData.P1227);
      setPreviousMonth1228(previousMonthData.P1228);
      setPreviousMonth1229(previousMonthData.P1229);

      // setPreviousMonth1201(previousMonthData.D1201);
      // setPreviousMonth1202(previousMonthData.D1202);
      // setPreviousMonth1203(previousMonthData.D1203);
      // setPreviousMonth1204(previousMonthData.D1204);
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

  // Calculate totals for Income Previous Month

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

  // Calculate totals for Income Current Month

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
      if (code === "1105") currentMonth = parseFloat(C1105) || 0;
      if (code === "1106") currentMonth = parseFloat(C1106) || 0;
      if (code === "1107") currentMonth = parseFloat(C1107) || 0;

      return acc + currentMonth;
    },
    0
  );

  const totalIncomeToDate = totalIncomePreviousMonth + totalIncomeCurrentMonth;

  // Calculate totals for Expense Previous Month

  const totalExpensePreviousMonth = Object.entries(expenseData).reduce(
    (acc, [code]) => {
      let previousMonth = 0;

      if (code === "1205") previousMonth = parseFloat(PreviousMonth1205) || 0;
      if (code === "1206") previousMonth = parseFloat(PreviousMonth1206) || 0;
      if (code === "1207") previousMonth = parseFloat(PreviousMonth1207) || 0;
      if (code === "1208") previousMonth = parseFloat(PreviousMonth1208) || 0;
      if (code === "1209") previousMonth = parseFloat(PreviousMonth1209) || 0;
      if (code === "1210") previousMonth = parseFloat(PreviousMonth1210) || 0;
      if (code === "1219") previousMonth = parseFloat(PreviousMonth1219) || 0;
      if (code === "1211") previousMonth = parseFloat(PreviousMonth1211) || 0;
      if (code === "1212") previousMonth = parseFloat(PreviousMonth1212) || 0;
      if (code === "1213") previousMonth = parseFloat(PreviousMonth1213) || 0;
      if (code === "1214") previousMonth = parseFloat(PreviousMonth1214) || 0;
      if (code === "1215") previousMonth = parseFloat(PreviousMonth1215) || 0;
      if (code === "1216") previousMonth = parseFloat(PreviousMonth1216) || 0;
      if (code === "1217") previousMonth = parseFloat(PreviousMonth1217) || 0;
      if (code === "1218") previousMonth = parseFloat(PreviousMonth1218) || 0;
      if (code === "1220") previousMonth = parseFloat(PreviousMonth1220) || 0;
      if (code === "1221") previousMonth = parseFloat(PreviousMonth1221) || 0;
      if (code === "1222") previousMonth = parseFloat(PreviousMonth1222) || 0;
      if (code === "1223") previousMonth = parseFloat(PreviousMonth1223) || 0;
      if (code === "1224") previousMonth = parseFloat(PreviousMonth1224) || 0;
      if (code === "1225") previousMonth = parseFloat(PreviousMonth1225) || 0;
      if (code === "1226") previousMonth = parseFloat(PreviousMonth1226) || 0;
      if (code === "1227") previousMonth = parseFloat(PreviousMonth1227) || 0;
      if (code === "1228") previousMonth = parseFloat(PreviousMonth1228) || 0;
      if (code === "1229") previousMonth = parseFloat(PreviousMonth1229) || 0;

      return acc + previousMonth;
    },
    0
  );

  // Calculate totals for Expense Current  Month

  const totalExpenseCurrentMonth = Object.entries(expenseData).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "1205") currentMonth = parseFloat(D1205) || 0;
      if (code === "1206") currentMonth = parseFloat(D1206) || 0;
      if (code === "1207") currentMonth = parseFloat(D1207) || 0;
      if (code === "1208") currentMonth = parseFloat(D1208) || 0;
      if (code === "1209") currentMonth = parseFloat(D1209) || 0;
      if (code === "1210") currentMonth = parseFloat(D1210) || 0;
      if (code === "1211") currentMonth = parseFloat(D1211) || 0;
      if (code === "1212") currentMonth = parseFloat(D1212) || 0;
      if (code === "1213") currentMonth = parseFloat(D1213) || 0;
      if (code === "1214") currentMonth = parseFloat(D1214) || 0;
      if (code === "1215") currentMonth = parseFloat(D1215) || 0;
      if (code === "1216") currentMonth = parseFloat(D1216) || 0;
      if (code === "1217") currentMonth = parseFloat(D1217) || 0;
      if (code === "1218") currentMonth = parseFloat(D1218) || 0;
      if (code === "1219") currentMonth = parseFloat(D1219) || 0;
      if (code === "1220") currentMonth = parseFloat(D1220) || 0;
      if (code === "1221") currentMonth = parseFloat(D1221) || 0;
      if (code === "1222") currentMonth = parseFloat(D1222) || 0;
      if (code === "1223") currentMonth = parseFloat(D1223) || 0;
      if (code === "1224") currentMonth = parseFloat(D1224) || 0;
      if (code === "1225") currentMonth = parseFloat(D1225) || 0;
      if (code === "1226") currentMonth = parseFloat(D1226) || 0;
      if (code === "1227") currentMonth = parseFloat(D1227) || 0;
      if (code === "1228") currentMonth = parseFloat(D1228) || 0;
      if (code === "1229") currentMonth = parseFloat(D1229) || 0;

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
      if (code === "1105")
        currentMonth = processAmount(C1105) + processAmount(PreviousMonth1105);
      if (code === "1106")
        currentMonth = processAmount(C1106) + processAmount(PreviousMonth1106);
      if (code === "1107")
        currentMonth = processAmount(C1107) + processAmount(PreviousMonth1107);

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
      if (code === "1209")
        currentMonth = processAmount(D1209) + processAmount(PreviousMonth1209);
      if (code === "1210")
        currentMonth = processAmount(D1210) + processAmount(PreviousMonth1210);
      if (code === "1211")
        currentMonth = processAmount(D1211) + processAmount(PreviousMonth1211);
      if (code === "1212")
        currentMonth = processAmount(D1212) + processAmount(PreviousMonth1212);
      if (code === "1213")
        currentMonth = processAmount(D1213) + processAmount(PreviousMonth1213);
      if (code === "1214")
        currentMonth = processAmount(D1214) + processAmount(PreviousMonth1214);
      if (code === "1215")
        currentMonth = processAmount(D1215) + processAmount(PreviousMonth1215);
      if (code === "1216")
        currentMonth = processAmount(D1216) + processAmount(PreviousMonth1216);
      if (code === "1217")
        currentMonth = processAmount(D1217) + processAmount(PreviousMonth1217);
      if (code === "1218")
        currentMonth = processAmount(D1218) + processAmount(PreviousMonth1218);
      if (code === "1219")
        currentMonth = processAmount(D1219) + processAmount(PreviousMonth1219);
      if (code === "1220")
        currentMonth = processAmount(D1220) + processAmount(PreviousMonth1220);
      if (code === "1221")
        currentMonth = processAmount(D1221) + processAmount(PreviousMonth1221);
      if (code === "1222")
        currentMonth = processAmount(D1222) + processAmount(PreviousMonth1222);
      if (code === "1223")
        currentMonth = processAmount(D1223) + processAmount(PreviousMonth1223);
      if (code === "1224")
        currentMonth = processAmount(D1224) + processAmount(PreviousMonth1224);
      if (code === "1225")
        currentMonth = processAmount(D1225) + processAmount(PreviousMonth1225);
      if (code === "1226")
        currentMonth = processAmount(D1226) + processAmount(PreviousMonth1226);
      if (code === "1227")
        currentMonth = processAmount(D1227) + processAmount(PreviousMonth1227);
      if (code === "1228")
        currentMonth = processAmount(D1228) + processAmount(PreviousMonth1228);
      if (code === "1229")
        currentMonth = processAmount(D1229) + processAmount(PreviousMonth1229);

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

    // Prepare InterestSavings data
    Object.entries(InterestSavings).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // // Calculating based on the product code
      // if (code === "1201")
      //   currentMonth = processAmount(D1201) + processAmount(PreviousMonth1201);
      // if (code === "1202")
      //   currentMonth = processAmount(D1202) + processAmount(PreviousMonth1202);
      // if (code === "1203")
      //   currentMonth = processAmount(D1203) + processAmount(PreviousMonth1203);
      // if (code === "1204")
      //   currentMonth = processAmount(D1204) + processAmount(PreviousMonth1204);

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
                  if (code === "1105") currentMonth = C1105 || 0;
                  if (code === "1106") currentMonth = C1106 || 0;
                  if (code === "1107") currentMonth = C1107 || 0;
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
                    Total Incomes
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
                  if (code === "1209") previousMonth = PreviousMonth1209 || 0;
                  if (code === "1210") previousMonth = PreviousMonth1210 || 0;
                  if (code === "1211") previousMonth = PreviousMonth1211 || 0;
                  if (code === "1212") previousMonth = PreviousMonth1212 || 0;
                  if (code === "1213") previousMonth = PreviousMonth1213 || 0;
                  if (code === "1214") previousMonth = PreviousMonth1214 || 0;
                  if (code === "1215") previousMonth = PreviousMonth1215 || 0;
                  if (code === "1216") previousMonth = PreviousMonth1216 || 0;
                  if (code === "1217") previousMonth = PreviousMonth1217 || 0;
                  if (code === "1218") previousMonth = PreviousMonth1218 || 0;
                  if (code === "1219") previousMonth = PreviousMonth1219 || 0;
                  if (code === "1220") previousMonth = PreviousMonth1220 || 0;
                  if (code === "1221") previousMonth = PreviousMonth1221 || 0;
                  if (code === "1222") previousMonth = PreviousMonth1222 || 0;
                  if (code === "1223") previousMonth = PreviousMonth1223 || 0;
                  if (code === "1224") previousMonth = PreviousMonth1224 || 0;
                  if (code === "1225") previousMonth = PreviousMonth1225 || 0;
                  if (code === "1226") previousMonth = PreviousMonth1226 || 0;
                  if (code === "1227") previousMonth = PreviousMonth1227 || 0;
                  if (code === "1228") previousMonth = PreviousMonth1228 || 0;
                  if (code === "1229") previousMonth = PreviousMonth1229 || 0;

                  // Assign values for current month based on code
                  if (code === "1205") currentMonth = D1205 || 0;
                  if (code === "1206") currentMonth = D1206 || 0;
                  if (code === "1207") currentMonth = D1207 || 0;
                  if (code === "1208") currentMonth = D1208 || 0;
                  if (code === "1209") currentMonth = D1209 || 0;
                  if (code === "1210") currentMonth = D1210 || 0;
                  if (code === "1211") currentMonth = D1211 || 0;
                  if (code === "1212") currentMonth = D1212 || 0;
                  if (code === "1213") currentMonth = D1213 || 0;
                  if (code === "1214") currentMonth = D1214 || 0;
                  if (code === "1215") currentMonth = D1215 || 0;
                  if (code === "1216") currentMonth = D1216 || 0;
                  if (code === "1217") currentMonth = D1217 || 0;
                  if (code === "1218") currentMonth = D1218 || 0;
                  if (code === "1219") currentMonth = D1219 || 0;
                  if (code === "1220") currentMonth = D1220 || 0;
                  if (code === "1221") currentMonth = D1221 || 0;
                  if (code === "1222") currentMonth = D1222 || 0;
                  if (code === "1223") currentMonth = D1223 || 0;
                  if (code === "1224") currentMonth = D1224 || 0;
                  if (code === "1225") currentMonth = D1225 || 0;
                  if (code === "1226") currentMonth = D1226 || 0;
                  if (code === "1227") currentMonth = D1227 || 0;
                  if (code === "1228") currentMonth = D1228 || 0;
                  if (code === "1229") currentMonth = D1229 || 0;
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
                    Total Expenses
                  </td>
                  <td>{totalExpensePreviousMonth}</td>
                  <td>{totalExpenseCurrentMonth}</td>
                  <td>{totalExpenseToDate}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total Expenditure
                  </td>
                  <td className=" fw-bold">
                    {totalIncomePreviousMonth - totalExpensePreviousMonth}
                  </td>
                  <td className=" fw-bold">
                    {totalIncomeCurrentMonth - totalExpenseCurrentMonth}
                  </td>
                  <td className=" fw-bold">
                    {totalIncomeToDate - totalExpenseToDate}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-end fw-bold">
                    Net Profit (Loss) :
                  </td>
                  <td className=" fw-bold">
                    {totalIncomePreviousMonth - totalExpensePreviousMonth}
                  </td>
                  <td className=" fw-bold">
                    {totalIncomeCurrentMonth - totalExpenseCurrentMonth}
                  </td>
                  <td className=" fw-bold">
                    {totalIncomeToDate - totalExpenseToDate}
                  </td>
                </tr>
              </tbody>
            </table>
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
