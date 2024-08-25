// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Importing uuid
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MEMBER_LIST_CENTER_ROUTE = "/home/Voucher";

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
  // 602: "Stromme Foundation",
  // 603: "Anukul Foundation",
  // 605: "JICA (SMAP)",
  // 606: "BB Refinance Scheme",
  100: "Cash in Hand",
  200: "Cash at Bank Credit",
};

function VoucherEdit() {
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [branchs, setBranchs] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateWarning, setDateWarning] = useState(false);
  const [branchWarning, setBranchWarning] = useState(false);
  const [debitSections, setDebitSections] = useState([
    {
      key: uuidv4(), // Use uuidv4() to generate a unique key
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      comment: "",
    },
  ]);
  const [creditSections, setCreditSections] = useState([
    {
      key: uuidv4(), // Use uuidv4() to generate a unique key
      selectedProductCode: "",
      productName: "",
      sellCost: "",
      comment: "",
    },
  ]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/branch-callback");
        const data = await response.json();
        setBranchs(data);
      } catch (error) {
        console.error("Error fetching branch options:", error.message);
      }
    };

    fetchCenters();
  }, []);

  // Function to fetch data by date
  const fetchDataByDateAndBranch = useCallback(async (date, branch) => {
    try {
      const response = await fetch(
        `http://localhost:5000/find-data-by-date-branch?date=${date}&branch=${encodeURIComponent(
          branch
        )}`
      );

      // Check if the response is 404 and handle it without logging
      if (response.status === 404) {
        setSubmitMessage("No data found for the specified date and branch");
        return; // Exit the function to avoid further processing
      }

      // Check for other types of errors
      if (!response.ok) {
        const result = await response.json();
        setSubmitMessage(result.message || "Error fetching data.");
        return;
      }

      // If the response is ok, process the data
      const result = await response.json();

      if (result.debitData) {
        populateSections(
          result.debitData,
          setDebitSections,
          ProductTypeNameandCodeDebit
        );
      } else {
        setDebitSections([
          {
            key: uuidv4(),
            selectedProductCode: "",
            productName: "",
            sellCost: "",
            comment: "",
          },
        ]);
      }

      if (result.creditData) {
        populateSections(
          result.creditData,
          setCreditSections,
          ProductTypeNameandCodeCredit
        );
      } else {
        setCreditSections([
          {
            key: uuidv4(),
            selectedProductCode: "",
            productName: "",
            sellCost: "",
            comment: "",
          },
        ]);
      }
    } catch (error) {
      // Handle network errors or other unexpected errors silently
      setSubmitMessage(`Error: ${error.message}`);
    }
  }, []);

  const populateSections = (data, setSections, productTypeData) => {
    if (!data || data.length === 0) {
      // If there's no data, set the section to a single empty entry
      setSections([
        {
          key: uuidv4(),
          selectedProductCode: "",
          productName: "",
          sellCost: "",
          comment: "",
        },
      ]);
    } else {
      // Map through the data and create sections
      const sections = data.map((item) => ({
        key: uuidv4(),
        selectedProductCode: item.productCode,
        productName: productTypeData[item.productCode] || "",
        sellCost: String(item.sellCost || ""),
        comment: item.comment || "",
      }));
      setSections(sections);
    }
  };

  const handleProductCodeTypeChange =
    (sections, setSections, productTypeData) => (index, event) => {
      const selectedKey = event.target.value;
      const updatedSections = sections.map((section, idx) =>
        idx === index
          ? {
              ...section,
              selectedProductCode: selectedKey,
              productName: productTypeData[selectedKey] || "",
            }
          : section
      );
      setSections(updatedSections);
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
        idx === index ? { ...section, [field]: String(value) } : section
      );
      setSections(updatedSections);
    };

  const addSection = (sections, setSections) => {
    setSections([
      ...sections,
      {
        key: uuidv4(), // Use uuidv4() to generate a unique key
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
            value={section.sellCost}
            onChange={(event) =>
              handleInputChange(sections, setSections, "sellCost")(index, event)
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

    // Format the date to match the database format
    const localDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toISOString().split("T")[0];

    const isSellCostValid = (section) =>
      String(section.sellCost || "").trim() !== "";

    const sectionsToSave = (sections) =>
      sections.filter((section) => isSellCostValid(section));

    const emptySellCostSections = debitSections
      .concat(creditSections)
      .filter((section) => !isSellCostValid(section));

    if (emptySellCostSections.length > 0) {
      const userConfirmed = window.confirm(
        "Some sections have empty Amount values. Do you want to proceed and save the non-empty sections?"
      );

      if (!userConfirmed) {
        return;
      }
    }

    try {
      // Update debit sections individually
      for (const section of sectionsToSave(debitSections)) {
        await fetch("http://localhost:5000/update-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch: formData.centerBranch, // Include branch in each update
            productCode: section.selectedProductCode,
            sellCost: section.sellCost,
            comment: section.comment,
            date: formattedDate,
          }),
        });
      }

      // Update credit sections individually
      for (const section of sectionsToSave(creditSections)) {
        await fetch("http://localhost:5000/update-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch: formData.centerBranch, // Include branch in each update
            productCode: section.selectedProductCode,
            sellCost: section.sellCost,
            comment: section.comment,
            date: formattedDate,
          }),
        });
      }

      setSubmitMessage("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  useEffect(() => {
    if (selectedDate && formData.centerBranch) {
      const localDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const formattedDate = localDate.toISOString().split("T")[0];
      fetchDataByDateAndBranch(formattedDate, formData.centerBranch);
    }
  }, [selectedDate, formData.centerBranch, fetchDataByDateAndBranch]);

  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("daily_deposit_register.pdf");
    });
  };

  return (
    <div className="bg-light mt-2">
      <div className="mt-2 p-2" ref={pdfRef}>
        <form onSubmit={handleSubmit}>
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Edit Voucher</h2>
          </div>

          <div className="row">
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
                {branchs.map((branch) => (
                  <option key={branch._id} value={branch.BranchName}>
                    {branch.BranchName}
                  </option>
                ))}
              </select>
              {branchWarning && (
                <div className="text-danger mt-2">Please select a branch.</div>
              )}
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
            <button className="btn btn-primary">Update</button>
            <button
              type="button"
              onClick={handleCancel}
              className=" btn btn-primary btn-md"
            >
              Cancel
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
      <div className="row text-center mt-5">
        <button className="btn btn-primary mt-4" onClick={handleDownloadPDF}>
          Download
        </button>
      </div>
    </div>
  );
}

export default VoucherEdit;
