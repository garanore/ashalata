// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductTypeNameandCodeDebit = {
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
  300: "Fixed Asset",
  500: "Advance",
  401: "General Loan",
  402: "Micro Enterprise Loan",
  403: "Agriculture Loan",
  404: "Hand/Emergency Loan",
  405: "Disaster Loan",
  406: "Water and Sanitation Loan",
  407: "Housing Loan",
  408: "Agriculture (SMAP) Loan",
  409: "Season Loan",
  410: "ICT Loan",
  201: "Investment at FDR",
  100: "Cash in Hand",
  200: "Cash at Bank",
  1300: "Loan Loss Reserve payment ",
  1600: "Micro Insurance withdraw ",
  801: "General Savings",
  802: "Contractual Savings",
  803: "Voluntary Savings",
  804: "Time Deposit",
};

const ProductTypeNameandCodeCredit = {
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
  300: "Fixed Asset",
  500: "Advance",
  700: "Inter Branch Transaction",
  701: "Other Liabilties",
  1000: "Customer Emergency Fund",
  1300: "Loan Loss Reserve recieved ",
  1400: "Accumulated Profit",
  1500: "Accumulated Depreciation",
  1600: "Micro Insurance recieved ",
  801: "General Savings",
  802: "Contractual Savings",
  803: "Voluntary Savings",
  804: "Time Deposit",
  601: "ASHALATA Bangladesh",
  100: "Cash in Hand",
  200: "Cash at Bank Credit",
};

function Voucher() {
  const [formData, setFormData] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateWarning, setDateWarning] = useState(false);
  const [branchWarning, setBranchWarning] = useState(false);

  const [hasAccess, setHasAccess] = useState(true);

  // const [totalInterestBranch, setTotalInterestBranch] = useState(null); // New state for totalInterestBranch
  // const [totalPrincipleBranch, setTotalPrincipleBranch] = useState(null); // New state for totalPrincipleBranch

  const navigate = useNavigate();

  const [userBranches, setUserBranches] = useState([]);
  const [branches, setBranches] = useState([]);

  const [debitSections, setDebitSections] = useState([
    {
      key: Date.now(),
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      comment: "",
    },
  ]);

  const [creditSections, setCreditSections] = useState([
    {
      key: Date.now(),
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      fetchedValue: null, // Add this line
      comment: "",
    },
  ]);

  useEffect(() => {
    // Step 1: Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Step 2: Retrieve user branch data and designation from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      // Check if the user has a restricted designation
      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      // Restrict access if the user has a restricted designation
      setHasAccess(!userHasRestrictedDesignation);
    }
  }, []);

  // Generalized function to fetch data based on branch, date, and product code
  const fetchDataByBranchAndDate = async (branch, dateInput, productCode) => {
    try {
      const encodedBranch = encodeURIComponent(branch);
      let url1 = "";
      let url2 = "";
      let formattedDate = "";

      if (dateInput instanceof Date) {
        const day = String(dateInput.getDate()).padStart(2, "0");
        const month = String(dateInput.getMonth() + 1).padStart(2, "0");
        const year = String(dateInput.getFullYear());

        formattedDate = `${year}-${month}-${day}`;

        if (productCode === "1101" || productCode === "1102") {
          const shortYear = year.slice(-2);
          formattedDate = `${day}-${month}-${shortYear}`;
          url1 = `http://localhost:5000/interest-collection-by-branch-date/${encodedBranch}/${formattedDate}`;
        } else if (productCode === "1103") {
          url1 = `http://localhost:5000/get-AdmissionFee-by-branch-and-date/${encodedBranch}/${formattedDate}`;
          url2 = `http://localhost:5000/sum-macroloan-by-branch/${encodedBranch}/${formattedDate}`;
        } else if (productCode === "1104") {
          url1 = `http://localhost:5000/get-AdmissionFee-by-branch-and-date/${encodedBranch}/${formattedDate}`;
        } else if (productCode === "1108") {
          url1 = `http://localhost:5000/sum-macroloan-by-branch/${encodedBranch}/${formattedDate}`;
        }
      } else {
        throw new Error("dateInput is not a valid Date object");
      }

      console.log(`Fetching data from URL: ${url1}`); // Log the first URL being called
      const response1 = await fetch(url1);
      const data1 = await response1.json();
      console.log("Fetched data from URL 1:", data1); // Log the full response data from the first API

      let data2 = {};
      if (productCode === "1103") {
        console.log(`Fetching data from URL: ${url2}`); // Log the second URL being called
        const response2 = await fetch(url2);
        data2 = await response2.json();
        console.log("Fetched data from URL 2:", data2); // Log the full response data from the second API
      }

      // Handle specific product codes and process the data correctly
      if (productCode === "1101") {
        return { totalInterestBranch: data1.totalInterestBranch || 0 };
      } else if (productCode === "1102") {
        return { totalPrincipleBranch: data1.totalPrincipleBranch || 0 };
      } else if (productCode === "1103") {
        return {
          sumFormFeeBranch: data1.sumFormFeeBranch || 0,
          sumfromFeeBranchLoan: data2.sumfromFeeBranchLoan || 0,
          combinedSum:
            (data1.sumFormFeeBranch || 0) + (data2.sumfromFeeBranchLoan || 0),
        };
      } else if (productCode === "1104") {
        return { sumAdmissionFeesBranch: data1.sumAdmissionFeesBranch || 0 };
      } else if (productCode === "1108") {
        return {
          sumMacroloanBranch: data1.sumMacroloanBranch || 0,
          sumfromFeeBranchLoan: data1.sumfromFeeBranchLoan || 0, // Include this if needed
        };
      }

      return {};
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return {};
    }
  };

  // Function to handle product code type change and fetch related data
  const handleProductCodeTypeChange =
    (sections, setSections, productTypeData) => async (index, event) => {
      const selectedKey = event.target.value;
      const updatedSections = sections.map((section, idx) =>
        idx === index
          ? {
              ...section,
              selectedProductCode: selectedKey,
              productName: productTypeData[selectedKey] || "",
              fetchedValue: null, // Reset fetchedValue when changing product code
            }
          : section
      );
      setSections(updatedSections);

      // Fetch data only for specific product codes
      if (
        (selectedKey === "1101" ||
          selectedKey === "1102" ||
          selectedKey === "1103" ||
          selectedKey === "1104" ||
          selectedKey === "1108") &&
        formData.centerBranch &&
        selectedDate
      ) {
        const fetchedData = await fetchDataByBranchAndDate(
          formData.centerBranch,
          selectedDate,
          selectedKey
        );

        const updatedSectionsWithValue = updatedSections.map((section, idx) =>
          idx === index
            ? {
                ...section,
                fetchedValue:
                  selectedKey === "1101"
                    ? fetchedData.totalInterestBranch
                    : selectedKey === "1102"
                    ? fetchedData.totalPrincipleBranch
                    : selectedKey === "1103"
                    ? fetchedData.sumFormFeeBranch +
                      fetchedData.sumfromFeeBranchLoan // Sum both values for 1103
                    : selectedKey === "1104"
                    ? fetchedData.sumAdmissionFeesBranch
                    : selectedKey === "1108"
                    ? fetchedData.sumMacroloanBranch
                    : null,
              }
            : section
        );
        setSections(updatedSectionsWithValue);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));
  };

  const handleInputChange =
    (sections, setSections, field) => (index, event) => {
      const value = event.target.value;
      const updatedSections = sections.map((section, idx) =>
        idx === index ? { ...section, [field]: value } : section
      );
      setSections(updatedSections);
    };

  const addSection = (sections, setSections) => {
    setSections([
      ...sections,
      {
        key: Date.now(),
        selectedProductCode: "",
        productName: "",
        sellCost: "",
        comment: "",
      },
    ]);
  };

  const removeSection = (sections, setSections) => (index) => {
    const updatedSections = sections.filter((_, idx) => idx !== index);
    setSections(updatedSections);
  };

  // In the renderSections function, ensure the correct value is bound
  const renderSections = (sections, setSections, productTypeData) => {
    return sections.map((section, index) => (
      <div className="mb-5 row" key={section.key}>
        <div className="col-2">
          <label htmlFor={`ProductCode-${section.key}`} className="form-label">
            ID
          </label>
          <select
            id={`ProductCode-${section.key}`}
            className="form-select"
            value={section.selectedProductCode}
            onChange={(event) =>
              handleProductCodeTypeChange(
                sections,
                setSections,
                productTypeData
              )(index, event)
            }
          >
            <option value="">বাছাই করুণ</option>
            {Object.keys(productTypeData).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label htmlFor={`ProductName-${section.key}`} className="form-label">
            Name
          </label>
          <input
            id={`ProductName-${section.key}`}
            className="form-control"
            type="text"
            value={section.productName}
            readOnly
          />
        </div>
        <div className="col-2">
          <label
            htmlFor={`ProductSellCost-${section.key}`}
            className="form-label"
          >
            Amount
          </label>
          <input
            id={`ProductSellCost-${section.key}`}
            className="form-control"
            type="text"
            value={section.sellCost || section.fetchedValue || ""} // Use sellCost if not null, else fetchedValue
            onChange={(event) =>
              handleInputChange(sections, setSections, "sellCost")(index, event)
            }
            readOnly={
              section.selectedProductCode === "1101" ||
              section.selectedProductCode === "1102" ||
              section.selectedProductCode === "1103" ||
              section.selectedProductCode === "1104" ||
              section.selectedProductCode === "1108"
            }
          />
        </div>
        <div className="col-4">
          <label
            htmlFor={`CommentForProduct-${section.key}`}
            className="form-label"
          >
            Comment
          </label>
          <input
            id={`CommentForProduct-${section.key}`}
            className="form-control"
            type="text"
            value={section.comment}
            onChange={(event) =>
              handleInputChange(sections, setSections, "comment")(index, event)
            }
          />
        </div>
        <div className="col-1 mt-4">
          {sections.length > 1 && index < sections.length - 1 && (
            <button
              type="button"
              className="btn btn-danger mb-3"
              onClick={() => removeSection(sections, setSections)(index)}
            >
              X
            </button>
          )}
          {index === sections.length - 1 && (
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={() => addSection(sections, setSections)}
            >
              +
            </button>
          )}
        </div>
      </div>
    ));
  };

  // Handle submission, ensuring the correct value is sent
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setDateWarning(true);
      return;
    }

    if (!formData.centerBranch) {
      setBranchWarning(true);
      return;
    }

    setDateWarning(false);
    setBranchWarning(false);

    const localDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];

    const sectionsToSave = (sections) =>
      sections.filter((section) => {
        return section.sellCost.trim() !== "" || section.fetchedValue !== null;
      });

    try {
      for (const section of sectionsToSave(debitSections)) {
        await fetch("http://localhost:5000/save-debit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: section.selectedProductCode,
            productName: section.productName,
            sellCost:
              section.sellCost.trim() !== "" && section.fetchedValue === null
                ? section.sellCost
                : section.fetchedValue, // Ensure manual entry is used if available
            comment: section.comment,
            centerBranch: formData.centerBranch,
            date: formattedDate,
          }),
        });
      }

      for (const section of sectionsToSave(creditSections)) {
        await fetch("http://localhost:5000/save-credit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productCode: section.selectedProductCode,
            productName: section.productName,
            sellCost:
              section.sellCost.trim() !== "" && section.fetchedValue === null
                ? section.sellCost
                : section.fetchedValue, // Ensure manual entry is used if available
            comment: section.comment,
            centerBranch: formData.centerBranch,
            date: formattedDate,
          }),
        });
      }

      setSubmitMessage("Submission successful!");
      setFormData({});
      setSelectedDate(null);
      setDebitSections([
        {
          key: Date.now(),
          selectedProductCode: "",
          productName: "",
          sellCost: "",
          comment: "",
        },
      ]);
      setCreditSections([
        {
          key: Date.now(),
          selectedProductCode: "",
          productName: "",
          sellCost: "",
          comment: "",
        },
      ]);

      setTimeout(() => setSubmitMessage(""), 2000);
    } catch (error) {
      console.error("Error submitting data:", error.message);
      setSubmitMessage("Error submitting data. Please try again.");
    }
  };

  const handleEditClick = () => {
    navigate("/home/VoucherEdit");
  };
  const handleDownloadClick = () => {
    navigate("/home/VoucherDownload");
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Create Voucher</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light  container-fluid">
      <div className=" p-2">
        <form onSubmit={handleSubmit}>
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Create Voucher</h2>
          </div>

          <div className="row mb-5">
            <div className="mb-3 col-4 col-md-4">
              <label htmlFor="centerBranch" className="form-label">
                শাঁখা নির্বাচন করুণ
              </label>
              <select
                id="centerBranch"
                className="form-select"
                value={formData.centerBranch}
                onChange={handleChange}
                name="centerBranch"
              >
                <option value="">Choose...</option>

                {/* Step 3: Filter branches based on userBranches */}
                {userBranches.includes("AllBranch") ||
                userBranches.includes("AllCenter")
                  ? branches.map((branch) => (
                      <option key={branch._id} value={branch.BranchName}>
                        {branch.BranchName}
                      </option>
                    ))
                  : branches
                      .filter((branch) =>
                        userBranches.includes(branch.BranchName)
                      )
                      .map((branch) => (
                        <option key={branch._id} value={branch.BranchName}>
                          {branch.BranchName}
                        </option>
                      ))}
              </select>
              {branchWarning && (
                <div className="text-danger mt-2">Please select a branch.</div>
              )}
            </div>

            <div className="mb-3 col-3">
              <label htmlFor="date" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="date"
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
                {dateWarning && (
                  <div className="text-danger mt-2">Please select a date.</div>
                )}
              </div>
            </div>
          </div>

          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Debit</h2>
          </div>
          {renderSections(
            debitSections,
            setDebitSections,
            ProductTypeNameandCodeDebit
          )}
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Credit</h2>
          </div>
          {renderSections(
            creditSections,
            setCreditSections,
            ProductTypeNameandCodeCredit
          )}

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
                submitMessage.includes("Error")
                  ? "alert-danger"
                  : "alert-success"
              } mt-3`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Voucher;
