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
};

function VoucherDownload() {
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [branchs, setBranchs] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));
    if (name === "centerBranch") {
      setSelectedBranch(value); // Update selected branch
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
    // Hide the sections you don't want in the PDF
    const sectionsToHide = document.querySelectorAll(
      ".row, .mb-3.col-3, .mb-3.col-4.col-md-4"
    );
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
      pdf.save("daily_voucher_register.pdf");

      // Restore the hidden sections
      sectionsToHide.forEach((section) => {
        section.style.display = "";
      });
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const calculateTotalAmount = (sections) => {
    return sections.reduce((total, section) => {
      const amount = parseFloat(section.sellCost) || 0; // Convert to number, default to 0 if NaN
      return total + amount;
    }, 0);
  };

  const renderTableRows = (sections) => {
    const rows = [];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      rows.push(
        <tr key={section.key}>
          <td className="align-middle">{section.selectedProductCode || ""}</td>
          <td className="align-middle">{section.productName || ""}</td>
          <td className="align-middle">{section.sellCost || ""}</td>
          <td className="align-middle">{section.comment || ""}</td>
        </tr>
      );
    }

    // Ensure that there is at least one empty row if no sections are available
    if (sections.length === 0) {
      rows.push(
        <tr key="empty-row">
          <td className="align-middle"></td>
          <td className="align-middle"></td>
          <td className="align-middle"></td>
          <td className="align-middle"></td>
        </tr>
      );
    }

    // Calculate the total amount and add a total row
    const totalAmount = calculateTotalAmount(sections);
    rows.push(
      <tr key="total-row" style={{ fontWeight: "bold" }}>
        <td className="align-middle"></td>
        <td className="align-middle text-end">Total</td>
        <td className="align-middle">{totalAmount.toFixed(2)}</td>
        <td className="align-middle"></td>
      </tr>
    );

    return rows;
  };

  return (
    <div className="bg-light mt-2">
      <div className="mt-2 p-2" ref={pdfRef}>
        <form>
          <div className="text-center mb-4">
            <h2>Ashalata</h2>
            <h4>Branch Name: {selectedBranch}</h4>
            <h6>Date: {formatDate(selectedDate)}</h6>
            <h5>Voucher</h5>
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
            </div>
          </div>

          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Debit</h2>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Product</th>
                <th scope="col">Amount</th>
                <th scope="col">Comment</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(debitSections)}</tbody>
          </table>

          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">Credit</h2>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Product</th>
                <th scope="col">Amount</th>
                <th scope="col">Comment</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(creditSections)}</tbody>
          </table>

          <div className="d-flex justify-content-between mt-5 col">
            <button
              type="button"
              onClick={handleCancel}
              className="ms-3 btn btn-primary btn-sm "
            >
              Cancel
            </button>

            <button
              type="button"
              className="ms-3 btn btn-primary btn-sm "
              onClick={handleDownloadPDF}
            >
              Download
            </button>
          </div>
        </form>
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
}

export default VoucherDownload;
