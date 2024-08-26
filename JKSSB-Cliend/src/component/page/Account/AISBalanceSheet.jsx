// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FixedAsset = {
  300: "Fixed Asset",
};

const LoanPortfolio = {
  401: "General Loan",
  402: "Micro Enterprise Loan",
  403: "Agriculture Loan",
  404: "Hand/Emergency Loan",
  405: "Disaster Loan",
  406: "Water and Sanitation Loan",
  407: "Housing Loan",
  408: "Agriculture (SMAP) Loan",
  409: "Season Loan",
  410: "ICT Loann",
};

const CurrentAsset = {
  201: "Investment at FDR",
  500: "Advance",
};

const CashInHand = {
  100: "Cash in Hand",
};

const CashatBank = {
  200: "Cash at Bank",
};

const OthersLiabilities = {
  700: "Inter Branch Transaction",
  701: "Other Liabilties",
  1000: "Customer Emergency Fund",
  1300: "Loan Loss Reserve",
  1400: "Accumulated Profit",
  1500: "Accumulated Depreciation",
  1600: "Micro Insurance",
};

const CustomerSavings = {
  801: "General Savings",
  802: "Contractual Savings",
  803: "Voluntary Savings",
  804: "Time Deposit",
};

const HeadOfficeGeneralAccount = {
  601: "ASHALATA Bangladesh",
};

const BalanceSheet = () => {
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

  const pdfRef = useRef();
  // Fro Previous Month ..............................................................

  // Fixed Asset

  const [PreviousMonth300, setPreviousMonth300] = useState(0);

  //  Loan Portfolio

  const [PreviousMonth401, setPreviousMonth401] = useState(0);
  const [PreviousMonth402, setPreviousMonth402] = useState(0);
  const [PreviousMonth403, setPreviousMonth403] = useState(0);
  const [PreviousMonth404, setPreviousMonth404] = useState(0);
  const [PreviousMonth405, setPreviousMonth405] = useState(0);
  const [PreviousMonth406, setPreviousMonth406] = useState(0);
  const [PreviousMonth407, setPreviousMonth407] = useState(0);
  const [PreviousMonth408, setPreviousMonth408] = useState(0);
  const [PreviousMonth409, setPreviousMonth409] = useState(0);
  const [PreviousMonth410, setPreviousMonth410] = useState(0);

  // Current Asset

  const [PreviousMonth201, setPreviousMonth201] = useState(0);
  const [PreviousMonth500, setPreviousMonth500] = useState(0);

  // Cash In Hand

  const [PreviousMonth100, setPreviousMonth100] = useState(0);

  // Cash At Bank

  const [PreviousMonth200, setPreviousMonth200] = useState(0);

  // Others Liabilities

  const [PreviousMonth700, setPreviousMonth700] = useState(0);
  const [PreviousMonth701, setPreviousMonth701] = useState(0);
  const [PreviousMonth1000, setPreviousMonth1000] = useState(0);
  const [PreviousMonth1300, setPreviousMonth1300] = useState(0);
  const [PreviousMonth1400, setPreviousMonth1400] = useState(0);
  const [PreviousMonth1500, setPreviousMonth1500] = useState(0);
  const [PreviousMonth1600, setPreviousMonth1600] = useState(0);

  // Customer Savings

  const [PreviousMonth801, setPreviousMonth801] = useState(0);
  const [PreviousMonth802, setPreviousMonth802] = useState(0);
  const [PreviousMonth803, setPreviousMonth803] = useState(0);
  const [PreviousMonth804, setPreviousMonth804] = useState(0);

  // Head Office General Account

  const [PreviousMonth601, setPreviousMonth601] = useState(0);

  // For Current Month................................................................

  // Fixe dAsset

  const [D300, setD300] = useState(0);

  //  Loan Portfolio

  const [D401, setD401] = useState(0);
  const [D402, setD402] = useState(0);
  const [D403, setD403] = useState(0);
  const [D404, setD404] = useState(0);
  const [D405, setD405] = useState(0);
  const [D406, setD406] = useState(0);
  const [D407, setD407] = useState(0);
  const [D408, setD408] = useState(0);
  const [D409, setD409] = useState(0);
  const [D410, setD410] = useState(0);

  // Current Asset

  const [D201, setD201] = useState(0);
  const [D500, setD500] = useState(0);

  // Cash In Hand

  const [D100, setD100] = useState(0);

  // Cash At Bank

  const [D200, setD200] = useState(0);

  // Others Liabilities

  const [C700, setC700] = useState(0);
  const [C701, setC701] = useState(0);
  const [C1000, setC1000] = useState(0);
  const [C1300, setC1300] = useState(0);
  const [C1400, setC1400] = useState(0);
  const [C1500, setC1500] = useState(0);
  const [C1600, setC1600] = useState(0);

  // Customer Savings

  const [D801, setD801] = useState(0);
  const [D802, setD802] = useState(0);
  const [D803, setD803] = useState(0);
  const [D804, setD804] = useState(0);

  // Head Office General Account

  const [C601, setC601] = useState(0);

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
          `http://localhost:5000/sum-sell-cost-by-month-branch/${encodedBranch}/${formattedMonth}`
        ),
        fetch(
          `http://localhost:5000/get-balance-sheet/${encodedBranch}/${formattedMonth}`
        ),
      ]);

      const [creditData, previousMonthData] = await Promise.all(
        responses.map((response) => {
          if (!response.ok) throw new Error("Failed to fetch");
          return response.json();
        })
      );

      // Current Month ........................................................................

      // Fixed Asset

      setD300(creditData.D300);

      // for Loan Portfolio

      setD401(creditData.D401);
      setD402(creditData.D402);
      setD403(creditData.D403);
      setD404(creditData.D404);
      setD405(creditData.D405);
      setD406(creditData.D406);
      setD407(creditData.D407);
      setD408(creditData.D408);
      setD409(creditData.D409);
      setD410(creditData.D410);

      // Curremt  Asset

      setD201(creditData.D201);
      setD500(creditData.D500);

      // Cash In Hand

      setD100(creditData.D100);

      // Cash At Bank

      setD200(creditData.D200);

      // Others Liabilities

      setC700(creditData.C700);
      setC701(creditData.C701);
      setC1000(creditData.C1000);
      setC1300(creditData.C1300);
      setC1400(creditData.C1400);
      setC1500(creditData.C1500);
      setC1600(creditData.C1600);

      // Customer Savings

      setD801(creditData.D801);
      setD802(creditData.D802);
      setD803(creditData.D803);
      setD804(creditData.D804);

      // Head Office General Account

      setC601(creditData.C601);

      // Previous Month ........................................................................

      // Fixed Asset

      setPreviousMonth300(previousMonthData.P300);

      // Loan Portfolio

      setPreviousMonth401(previousMonthData.P401);
      setPreviousMonth402(previousMonthData.P402);
      setPreviousMonth403(previousMonthData.P403);
      setPreviousMonth404(previousMonthData.P404);
      setPreviousMonth405(previousMonthData.P405);
      setPreviousMonth406(previousMonthData.P406);
      setPreviousMonth407(previousMonthData.P407);
      setPreviousMonth408(previousMonthData.P408);
      setPreviousMonth409(previousMonthData.P409);
      setPreviousMonth410(previousMonthData.P410);

      // Fixed Asset

      setPreviousMonth201(previousMonthData.P201);
      setPreviousMonth500(previousMonthData.P500);

      // Cash In Hand

      setPreviousMonth100(previousMonthData.P100);

      // Cash In Hand

      setPreviousMonth200(previousMonthData.P200);

      // Others Liabilities

      setPreviousMonth700(previousMonthData.P700);
      setPreviousMonth701(previousMonthData.P701);
      setPreviousMonth1000(previousMonthData.P1000);
      setPreviousMonth1300(previousMonthData.P1300);
      setPreviousMonth1400(previousMonthData.P1400);
      setPreviousMonth1500(previousMonthData.P1500);
      setPreviousMonth1600(previousMonthData.P1600);

      // Customer Savings

      setPreviousMonth801(previousMonthData.P801);
      setPreviousMonth802(previousMonthData.P802);
      setPreviousMonth803(previousMonthData.P803);
      setPreviousMonth804(previousMonthData.P804);

      // Head Office General Account

      setPreviousMonth601(previousMonthData.P601);
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

  // Calculate totals for  Previous Month ........................................................

  //Fixed Asset

  const totalFixedAssetPreviousMonth = Object.entries(FixedAsset).reduce(
    (acc, [code]) => {
      let previousMonth = 0;
      if (code === "300") previousMonth = parseFloat(PreviousMonth300) || 0;
      return acc + previousMonth;
    },
    0
  );

  //   LoanPortfolio

  const totalLoanPortfolioPreviousMonth = Object.entries(LoanPortfolio).reduce(
    (acc, [code]) => {
      let previousMonth = 0;

      if (code === "401") previousMonth = parseFloat(PreviousMonth401) || 0;
      if (code === "402") previousMonth = parseFloat(PreviousMonth402) || 0;
      if (code === "403") previousMonth = parseFloat(PreviousMonth403) || 0;
      if (code === "404") previousMonth = parseFloat(PreviousMonth404) || 0;
      if (code === "405") previousMonth = parseFloat(PreviousMonth405) || 0;
      if (code === "406") previousMonth = parseFloat(PreviousMonth406) || 0;
      if (code === "407") previousMonth = parseFloat(PreviousMonth407) || 0;
      if (code === "408") previousMonth = parseFloat(PreviousMonth408) || 0;
      if (code === "409") previousMonth = parseFloat(PreviousMonth409) || 0;
      if (code === "410") previousMonth = parseFloat(PreviousMonth410) || 0;

      return acc + previousMonth;
    },
    0
  );

  //Current Asset

  const totalCurrentAssetPreviousMonth = Object.entries(CurrentAsset).reduce(
    (acc, [code]) => {
      let previousMonth = 0;
      if (code === "201") previousMonth = parseFloat(PreviousMonth201) || 0;
      if (code === "500") previousMonth = parseFloat(PreviousMonth500) || 0;
      return acc + previousMonth;
    },
    0
  );

  //Cash In Hand

  const totalCashInHandPreviousMonth = Object.entries(CashInHand).reduce(
    (acc, [code]) => {
      let previousMonth = 0;
      if (code === "100") previousMonth = parseFloat(PreviousMonth100) || 0;

      return acc + previousMonth;
    },
    0
  );

  //Cash At Bank

  const totalCashatBankPreviousMonth = Object.entries(CashatBank).reduce(
    (acc, [code]) => {
      let previousMonth = 0;
      if (code === "200") previousMonth = parseFloat(PreviousMonth200) || 0;

      return acc + previousMonth;
    },
    0
  );

  // Others Liabilities

  const totalOthersLiabilitiesPreviousMonth = Object.entries(
    OthersLiabilities
  ).reduce((acc, [code]) => {
    let previousMonth = 0;
    if (code === "700") previousMonth = parseFloat(PreviousMonth700) || 0;
    if (code === "701") previousMonth = parseFloat(PreviousMonth701) || 0;
    if (code === "1000") previousMonth = parseFloat(PreviousMonth1000) || 0;
    if (code === "1300") previousMonth = parseFloat(PreviousMonth1300) || 0;
    if (code === "1400") previousMonth = parseFloat(PreviousMonth1400) || 0;
    if (code === "1500") previousMonth = parseFloat(PreviousMonth1500) || 0;
    if (code === "1600") previousMonth = parseFloat(PreviousMonth1600) || 0;
    return acc + previousMonth;
  }, 0);

  // Customer Savings

  const totalCustomerSavingsPreviousMonth = Object.entries(
    CustomerSavings
  ).reduce((acc, [code]) => {
    let previousMonth = 0;
    if (code === "801") previousMonth = parseFloat(PreviousMonth801) || 0;
    if (code === "802") previousMonth = parseFloat(PreviousMonth802) || 0;
    if (code === "803") previousMonth = parseFloat(PreviousMonth803) || 0;
    if (code === "804") previousMonth = parseFloat(PreviousMonth804) || 0;

    return acc + previousMonth;
  }, 0);

  //Head Office General Account

  const totalHeadOfficeGeneralAccountPreviousMonth = Object.entries(
    HeadOfficeGeneralAccount
  ).reduce((acc, [code]) => {
    let previousMonth = 0;
    if (code === "601") previousMonth = parseFloat(PreviousMonth601) || 0;

    return acc + previousMonth;
  }, 0);

  // Calculate totals for Current Month ........................................................

  //   Fixed Asset

  const totalFixedAssetCurrentMonth = Object.entries(FixedAsset).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "300") currentMonth = parseFloat(D300) || 0;
      return acc + currentMonth;
    },
    0
  );

  //   LoanPortfolio

  const totalLoanPortfolioCurrentMonth = Object.entries(LoanPortfolio).reduce(
    (acc, [code]) => {
      let currentMonth = 0;

      if (code === "401") currentMonth = parseFloat(D401) || 0;
      if (code === "402") currentMonth = parseFloat(D402) || 0;
      if (code === "403") currentMonth = parseFloat(D403) || 0;
      if (code === "404") currentMonth = parseFloat(D404) || 0;
      if (code === "405") currentMonth = parseFloat(D405) || 0;
      if (code === "406") currentMonth = parseFloat(D406) || 0;
      if (code === "407") currentMonth = parseFloat(D407) || 0;
      if (code === "408") currentMonth = parseFloat(D408) || 0;
      if (code === "409") currentMonth = parseFloat(D409) || 0;
      if (code === "410") currentMonth = parseFloat(D410) || 0;

      return acc + currentMonth;
    },
    0
  );

  const totalLoanPortfolioToDate =
    totalLoanPortfolioPreviousMonth + totalLoanPortfolioCurrentMonth;

  //   Current  Asset

  const totalCurrentAssetCurrentMonth = Object.entries(CurrentAsset).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "201") currentMonth = parseFloat(D201) || 0;
      if (code === "500") currentMonth = parseFloat(D500) || 0;
      return acc + currentMonth;
    },
    0
  );

  const totalCurrentAssetToDate =
    totalCurrentAssetPreviousMonth + totalCurrentAssetCurrentMonth;

  //   Cash In Hand
  const totalCashInHandCurrentMonth = Object.entries(CashInHand).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "100") currentMonth = parseFloat(D100) || 0;
      return acc + currentMonth;
    },
    0
  );

  // Cash At Bank

  const totalCashatBankCurrentMonth = Object.entries(CashatBank).reduce(
    (acc, [code]) => {
      let currentMonth = 0;
      if (code === "200") currentMonth = parseFloat(D200) || 0;
      return acc + currentMonth;
    },
    0
  );

  // For Total of Property & Assets
  const TotalofPropertyAssetsPreviousMonth =
    totalFixedAssetPreviousMonth +
    totalLoanPortfolioPreviousMonth +
    totalCurrentAssetPreviousMonth +
    totalCashInHandPreviousMonth +
    totalCashatBankPreviousMonth;

  const TotalofPropertyAssetsCurrentMonth =
    totalFixedAssetCurrentMonth +
    totalLoanPortfolioCurrentMonth +
    totalCurrentAssetCurrentMonth +
    totalCashInHandCurrentMonth +
    totalCashatBankCurrentMonth;

  const TotalPropertyAssetsToDate =
    TotalofPropertyAssetsPreviousMonth + TotalofPropertyAssetsCurrentMonth;

  // Others Liabilities

  const totalOthersLiabilitiesCurrentMonth = Object.entries(
    OthersLiabilities
  ).reduce((acc, [code]) => {
    let currentMonth = 0;
    if (code === "700") currentMonth = parseFloat(C700) || 0;
    if (code === "701") currentMonth = parseFloat(C701) || 0;
    if (code === "1000") currentMonth = parseFloat(C1000) || 0;
    if (code === "1300") currentMonth = parseFloat(C1300) || 0;
    if (code === "1400") currentMonth = parseFloat(C1400) || 0;
    if (code === "1500") currentMonth = parseFloat(C1500) || 0;
    if (code === "1600") currentMonth = parseFloat(C1600) || 0;
    return acc + currentMonth;
  }, 0);

  const totalOthersLiabilitiesToDate =
    totalOthersLiabilitiesPreviousMonth + totalOthersLiabilitiesCurrentMonth;

  // Customer Savings

  const totalCustomerSavingsCurrentMonth = Object.entries(
    CustomerSavings
  ).reduce((acc, [code]) => {
    let currentMonth = 0;
    if (code === "801") currentMonth = parseFloat(D801) || 0;
    if (code === "802") currentMonth = parseFloat(D802) || 0;
    if (code === "803") currentMonth = parseFloat(D803) || 0;
    if (code === "804") currentMonth = parseFloat(D804) || 0;

    return acc + currentMonth;
  }, 0);

  const totalCustomerSavingsToDate =
    totalCustomerSavingsPreviousMonth + totalCustomerSavingsCurrentMonth;

  // Head Office General Account

  const totalHeadOfficeGeneralAccountCurrentMonth = Object.entries(
    HeadOfficeGeneralAccount
  ).reduce((acc, [code]) => {
    let currentMonth = 0;
    if (code === "601") currentMonth = parseFloat(C601) || 0;

    return acc + currentMonth;
  }, 0);

  // For Total of Property & Assets
  const TotalofFundLiabilitiesPreviousMonth =
    totalOthersLiabilitiesPreviousMonth +
    totalCustomerSavingsPreviousMonth +
    totalHeadOfficeGeneralAccountPreviousMonth;

  const TotalofFundLiabilitiesCurrentMonth =
    totalOthersLiabilitiesCurrentMonth +
    totalCustomerSavingsCurrentMonth +
    totalHeadOfficeGeneralAccountCurrentMonth;

  const TotalofFundLiabilitiesToDate =
    TotalofFundLiabilitiesPreviousMonth + TotalofFundLiabilitiesCurrentMonth;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = [];

    // Helper function to process and ensure toDateAmount is an integer
    const processAmount = (amount) => {
      return parseInt(amount, 10) || 0;
    };

    // Fixed Asset ................................................

    Object.entries(FixedAsset).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "300")
        currentMonth = processAmount(D300) + processAmount(PreviousMonth300);

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

    // Loan Portfolio Data .......................

    Object.entries(LoanPortfolio).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "401")
        currentMonth = processAmount(D401) + processAmount(PreviousMonth401);
      if (code === "402")
        currentMonth = processAmount(D402) + processAmount(PreviousMonth402);
      if (code === "403")
        currentMonth = processAmount(D403) + processAmount(PreviousMonth403);
      if (code === "404")
        currentMonth = processAmount(D404) + processAmount(PreviousMonth404);
      if (code === "405")
        currentMonth = processAmount(D405) + processAmount(PreviousMonth405);
      if (code === "406")
        currentMonth = processAmount(D406) + processAmount(PreviousMonth406);
      if (code === "407")
        currentMonth = processAmount(D407) + processAmount(PreviousMonth407);
      if (code === "408")
        currentMonth = processAmount(D408) + processAmount(PreviousMonth408);
      if (code === "409")
        currentMonth = processAmount(D409) + processAmount(PreviousMonth409);
      if (code === "410")
        currentMonth = processAmount(D410) + processAmount(PreviousMonth410);

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

    // Current Asset ................................................

    Object.entries(CurrentAsset).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "201")
        currentMonth = processAmount(D201) + processAmount(PreviousMonth201);
      if (code === "500")
        currentMonth = processAmount(D500) + processAmount(PreviousMonth500);

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

    // Cash In Hand ................................................

    Object.entries(CashInHand).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "100")
        currentMonth = processAmount(D100) + processAmount(PreviousMonth100);

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

    // Cash At Bank................................................

    Object.entries(CashatBank).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "200")
        currentMonth = processAmount(D200) + processAmount(PreviousMonth200);

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

    // Others Liabilities................................................

    Object.entries(OthersLiabilities).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "700")
        currentMonth = processAmount(C700) + processAmount(PreviousMonth700);
      if (code === "701")
        currentMonth = processAmount(C701) + processAmount(PreviousMonth701);
      if (code === "1000")
        currentMonth = processAmount(C1000) + processAmount(PreviousMonth1000);
      if (code === "1300")
        currentMonth = processAmount(C1300) + processAmount(PreviousMonth1300);
      if (code === "1400")
        currentMonth = processAmount(C1400) + processAmount(PreviousMonth1400);
      if (code === "1500")
        currentMonth = processAmount(C1500) + processAmount(PreviousMonth1500);
      if (code === "1600")
        currentMonth = processAmount(C1600) + processAmount(PreviousMonth1600);

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

    // Customer Savings................................................

    Object.entries(CustomerSavings).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "801")
        currentMonth = processAmount(D801) + processAmount(PreviousMonth801);
      if (code === "802")
        currentMonth = processAmount(D802) + processAmount(PreviousMonth802);
      if (code === "803")
        currentMonth = processAmount(D803) + processAmount(PreviousMonth803);
      if (code === "804")
        currentMonth = processAmount(D804) + processAmount(PreviousMonth804);

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

    // Head Office General Account................................................

    Object.entries(HeadOfficeGeneralAccount).forEach(([code, productName]) => {
      const currentMonthAmount = [];
      const toDateAmount = [];
      const months = [selectedMonth];

      let currentMonth = 0;

      // Calculating based on the product code

      if (code === "601")
        currentMonth = processAmount(C601) + processAmount(PreviousMonth601);

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
      const response = await fetch("http://localhost:5000/save-balance-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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

  const handleDownloadPDF = () => {
    // Hide the sections you don't want in the PDF
    const sectionsToHide = document.querySelectorAll(".HideforPDF");
    sectionsToHide.forEach((section) => {
      section.style.display = "none";
    });

    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the scaling ratio based on the available width and height, minus margins
      const ratio = Math.min(
        (pdfWidth - 10) / imgWidth,
        (pdfHeight - 10) / imgHeight
      );

      // Position the image with a 5px margin on all sides
      const imgX = 5; // 5px margin from the left
      const imgY = 5; // 5px margin from the top

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("balance-sheet.pdf");
      // Restore the hidden sections
      sectionsToHide.forEach((section) => {
        section.style.display = "";
      });
    });
  };

  return (
    <div className="container-fluid mt-5">
      <form onSubmit={handleSubmit} ref={pdfRef}>
        <div className="text-center mb-4">
          <h2>Ashalata</h2>
          <h4>Branch Name: {selectedBranch}</h4>
          <h6>Month: {getMonthRange(selectedMonth)}</h6>
          <h5>Balance Sheet</h5>
        </div>

        <div className="row mb-5 mt-5">
          <div className="col-6 text-center HideforPDF">
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
          <div className="mb-3 col-6 col-md-6 HideforPDF">
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
            <h5>Fixed Asset</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(FixedAsset).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "300") previousMonth = PreviousMonth300 || 0;

                  // Assign values based on code

                  if (code === "300") currentMonth = D300 || 0;

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
              </tbody>
            </table>
          </div>

          <div className="col-12 ">
            <h5>Loan Portfolio</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(LoanPortfolio).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "401") previousMonth = PreviousMonth401 || 0;
                  if (code === "402") previousMonth = PreviousMonth402 || 0;
                  if (code === "403") previousMonth = PreviousMonth403 || 0;
                  if (code === "404") previousMonth = PreviousMonth404 || 0;
                  if (code === "405") previousMonth = PreviousMonth405 || 0;
                  if (code === "406") previousMonth = PreviousMonth406 || 0;
                  if (code === "407") previousMonth = PreviousMonth407 || 0;
                  if (code === "408") previousMonth = PreviousMonth408 || 0;
                  if (code === "409") previousMonth = PreviousMonth409 || 0;
                  if (code === "410") previousMonth = PreviousMonth410 || 0;

                  // Assign values based on code

                  if (code === "401") currentMonth = D401 || 0;
                  if (code === "402") currentMonth = D402 || 0;
                  if (code === "403") currentMonth = D403 || 0;
                  if (code === "404") currentMonth = D404 || 0;
                  if (code === "405") currentMonth = D405 || 0;
                  if (code === "406") currentMonth = D406 || 0;
                  if (code === "407") currentMonth = D407 || 0;
                  if (code === "408") currentMonth = D408 || 0;
                  if (code === "409") currentMonth = D409 || 0;
                  if (code === "410") currentMonth = D410 || 0;

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
                    Total of Loan Portfolio
                  </td>

                  <td className=" fw-bold ">
                    {totalLoanPortfolioPreviousMonth}
                  </td>
                  <td className=" fw-bold">{totalLoanPortfolioCurrentMonth}</td>
                  <td className=" fw-bold">{totalLoanPortfolioToDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Current Asset</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(CurrentAsset).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "201") previousMonth = PreviousMonth201 || 0;
                  if (code === "500") previousMonth = PreviousMonth500 || 0;

                  // Assign values based on code

                  if (code === "201") currentMonth = D201 || 0;
                  if (code === "500") currentMonth = D500 || 0;

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
                    Total of Loan Portfolio
                  </td>

                  <td className="text-center fw-bold">
                    {totalCurrentAssetPreviousMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalCurrentAssetCurrentMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalCurrentAssetToDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Cash In Hand</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(CashInHand).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "100") previousMonth = PreviousMonth100 || 0;

                  // Assign values based on code

                  if (code === "100") currentMonth = D100 || 0;

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
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Cash At Bank</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(CashatBank).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "200") previousMonth = PreviousMonth200 || 0;

                  // Assign values based on code

                  if (code === "200") currentMonth = D200 || 0;

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
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total of Property & Assets
                  </td>

                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalofPropertyAssetsPreviousMonth}
                  </td>
                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalofPropertyAssetsCurrentMonth}
                  </td>
                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalPropertyAssetsToDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Others Liabilities</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(OthersLiabilities).map(
                  ([code, description]) => {
                    // Calculate the "To Date" value
                    let previousMonth = 0; // Placeholder for previous month value
                    let currentMonth = 0;

                    // Assign values based on code
                    if (code === "700") previousMonth = PreviousMonth700 || 0;
                    if (code === "701") previousMonth = PreviousMonth701 || 0;
                    if (code === "1000") previousMonth = PreviousMonth1000 || 0;
                    if (code === "1300") previousMonth = PreviousMonth1300 || 0;
                    if (code === "1400") previousMonth = PreviousMonth1400 || 0;
                    if (code === "1500") previousMonth = PreviousMonth1500 || 0;
                    if (code === "1600") previousMonth = PreviousMonth1600 || 0;

                    // Assign values based on code

                    if (code === "700") currentMonth = C700 || 0;
                    if (code === "701") currentMonth = C701 || 0;
                    if (code === "1000") currentMonth = C1000 || 0;
                    if (code === "1300") currentMonth = C1300 || 0;
                    if (code === "1400") currentMonth = C1400 || 0;
                    if (code === "1500") currentMonth = C1500 || 0;
                    if (code === "1600") currentMonth = C1600 || 0;

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
                  }
                )}
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total Others Liabilities
                  </td>

                  <td className="text-center fw-bold">
                    {totalOthersLiabilitiesPreviousMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalOthersLiabilitiesCurrentMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalOthersLiabilitiesToDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Customer Savings</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(CustomerSavings).map(([code, description]) => {
                  // Calculate the "To Date" value
                  let previousMonth = 0; // Placeholder for previous month value
                  let currentMonth = 0;

                  // Assign values based on code
                  if (code === "801") previousMonth = PreviousMonth801 || 0;
                  if (code === "802") previousMonth = PreviousMonth802 || 0;
                  if (code === "803") previousMonth = PreviousMonth803 || 0;
                  if (code === "804") previousMonth = PreviousMonth804 || 0;

                  // Assign values based on code

                  if (code === "801") currentMonth = D801 || 0;
                  if (code === "802") currentMonth = D802 || 0;
                  if (code === "803") currentMonth = D803 || 0;
                  if (code === "804") currentMonth = D804 || 0;

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
                    Total Others Liabilities
                  </td>

                  <td className="text-center fw-bold">
                    {totalCustomerSavingsPreviousMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalCustomerSavingsCurrentMonth}
                  </td>
                  <td className="text-center fw-bold">
                    {totalCustomerSavingsToDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <h5>Head Office General Account</h5>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Code</th>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>To Previous Month</th>
                  <th style={{ width: "15%" }}>Current Month</th>
                  <th style={{ width: "15%" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(HeadOfficeGeneralAccount).map(
                  ([code, description]) => {
                    // Calculate the "To Date" value
                    let previousMonth = 0; // Placeholder for previous month value
                    let currentMonth = 0;

                    // Assign values based on code
                    if (code === "601") previousMonth = PreviousMonth601 || 0;

                    // Assign values based on code

                    if (code === "601") currentMonth = C601 || 0;

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
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="col-12">
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <td colSpan="2" className="text-center fw-bold">
                    Total of Fund & Liabilities
                  </td>

                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalofFundLiabilitiesPreviousMonth}
                  </td>
                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalofFundLiabilitiesCurrentMonth}
                  </td>
                  <td style={{ width: "15%" }} className="text-center fw-bold">
                    {TotalofFundLiabilitiesToDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
      <div className="d-flex justify-content-between mt-5">
        <button className="btn btn-primary mt-2 mb-3">Submit</button>

        <button
          className="btn btn-primary mt-2 mb-4"
          onClick={handleDownloadPDF}
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
    </div>
  );
};

export default BalanceSheet;
