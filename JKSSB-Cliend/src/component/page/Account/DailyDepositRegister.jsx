// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatDate = (date) => {
  const Date = new Date(date);
  const day = String(Date.getDate()).padStart(2, "0");
  const month = String(Date.getMonth() + 1).padStart(2, "0");
  const year = Date.getFullYear();
  return `${day}-${month}-${String(year).slice(-2)}`;
};

const formatDateAdmissionFee = (date) => {
  const Date = new Date(date);
  const day = String(Date.getDate()).padStart(2, "0");
  const month = String(Date.getMonth() + 1).padStart(2, "0");
  const year = Date.getFullYear();
  return `${year}-${month}-${day}`;
};

const DailyDepositRegister = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [centers, setCenters] = useState([]);
  const [tableData, setTableData] = useState([]);
  const pdfRef = useRef();

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

  useEffect(() => {
    if (selectedBranch) {
      axios
        .get(
          `http://localhost:5000/center-callback-by-branch/${selectedBranch}`
        )
        .then((response) => {
          setCenters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    } else {
      setCenters([]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    const fetchTotalSavings = async (centerID, date) => {
      try {
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

    const fetchTotalInterest = async (centerID, date) => {
      try {
        const formattedDate = formatDate(date);
        const response = await axios.get(
          `http://localhost:5000/interest-collection-by-center/${centerID}/${formattedDate}`
        );
        return response.data.totalInterest;
      } catch (error) {
        console.error(
          `Error fetching total interest for center ${centerID} on ${date}:`,
          error
        );
        return 0;
      }
    };

    const fetchTotalAdmissionFees = async (centerID, date) => {
      try {
        const formattedDate = formatDateAdmissionFee(date);
        const response = await axios.get(
          `http://localhost:5000/get-AdmissionFee-by-center-and-date/${centerID}/${formattedDate}`
        );
        return {
          sumAdmissionFees: response.data.sumAdmissionFees,
          formsAndFormat: response.data.sumFormFee,
        };
      } catch (error) {
        console.error(
          `Error fetching total admission fees for center ${centerID} on ${date}:`,
          error
        );
        return {
          sumAdmissionFees: 0,
          formsAndFormat: 0,
        };
      }
    };

    const fetchTotalMicroloan = async (centerID, date) => {
      try {
        const formattedDate = formatDateAdmissionFee(date);
        const response = await axios.get(
          `http://localhost:5000/sum-macroloan/${centerID}/${formattedDate}`
        );
        return {
          sumMacroloan: response.data.sumMacroloan,
          sumfromFee: response.data.sumfromFee,
        };
      } catch (error) {
        console.error(
          `Error fetching total microloan for center ${centerID} on ${date}:`,
          error
        );
        return {
          sumMacroloan: 0,
          sumfromFee: 0,
        };
      }
    };

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
      axios
        .get(
          `http://localhost:5000/center-callback-by-branch/${selectedBranch}`
        )
        .then(async (response) => {
          const branchData = response.data;

          const enrichedData = await Promise.all(
            branchData.map(async (item) => {
              const totalSavings = await fetchTotalSavings(
                item.centerID,
                selectedDate
              );

              const { sumAdmissionFees, formsAndFormat } =
                await fetchTotalAdmissionFees(item.centerID, selectedDate);

              const totalInterest = await fetchTotalInterest(
                item.centerID,
                selectedDate
              );

              const { sumMacroloan, sumfromFee } = await fetchTotalMicroloan(
                item.centerID,
                selectedDate
              );

              const loanData = await fetchLoanData(item.centerID, selectedDate);

              const totalsumfromFee = formsAndFormat + sumfromFee;

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
                totalsumfromFee +
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
                totalsumfromFee,
                total,
              };
            })
          );

          setTableData(enrichedData);
        })
        .catch((error) => {
          console.error("Error fetching data by branch:", error);
        });
    } else if (selectedBranch) {
      setTableData(centers);
    } else {
      setTableData([]);
    }
  }, [selectedBranch, selectedDate, centers]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
      pdf.save("daily_deposit_register.pdf");
      // Restore the hidden sections
      sectionsToHide.forEach((section) => {
        section.style.display = "";
      });
    });
  };
  return (
    <>
      <div className="bg-light container-fluid p-2" ref={pdfRef}>
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
          <div className="col-md-3 HideforPDF">
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
          <div className="col-md-3 HideforPDF">
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

        <div id="pdfContent">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th rowSpan="2">Sl. No.</th>
                <th rowSpan="2">Program Organizer</th>
                <th rowSpan="2">Center/Sanity</th>
                <th rowSpan="2">Savings Account</th>
                <th colSpan="7" className="text-center">
                  Loan Account Realized
                </th>
                {/* <th rowSpan="2"></th> */}
                <th rowSpan="2">Total Service Charge</th>
                <th rowSpan="2">Forms and Format</th>
                <th rowSpan="2">Admission Fee</th>
                <th rowSpan="2">Micro Insurance</th>
                <th rowSpan="2">2nd Ledger</th>
                <th rowSpan="2">Fine</th>
                <th rowSpan="2">DFS Amount</th>
                <th rowSpan="2">Total</th>
                <th rowSpan="2">Signature</th>
              </tr>
              <tr>
                <th>General </th>
                <th>Agriculture </th>
                <th>SME</th>
                <th>Water & Sanitation</th>
                <th>Disaster </th>
                <th>Emergency</th>
                <th>Daily</th>
              </tr>
            </thead>
            <tbody>
              {selectedBranch && tableData.length === 0 && (
                <tr>
                  <td colSpan="23" className="text-center">
                    No data available for the selected branch and date.
                  </td>
                </tr>
              )}
              {selectedBranch &&
                tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.centerWorker}</td>
                    <td>{row.centerID}</td>
                    {selectedDate && (
                      <>
                        <td>{row.totalSavings}</td>

                        <td>{row["সাধারণ ঋণ"] || 0}</td>
                        <td>{row["কৃষি ঋণ"] || 0}</td>
                        <td>{row["এস এম ই ঋণ"] || 0}</td>
                        <td>{row["নলকূপ ঋণ"] || 0}</td>
                        <td>{row["জরুরী ঋণ"] || 0}</td>
                        <td>{row["দুর্যোগ ঋণ"] || 0}</td>
                        <td>{row["দৈনিক ঋণ"] || 0}</td>

                        <td>{row.totalInterest}</td>
                        <td>{row.totalsumfromFee}</td>
                        <td>{row.sumAdmissionFees}</td>
                        <td>{row.sumMacroloan}</td>

                        <td>{row.secondLedger}</td>
                        <td>{row.fine}</td>
                        <td>{row.dfsAmount}</td>
                        <td>{row.total}</td>
                        <td>{row.sign}</td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row text-center mt-5">
        <button className="btn btn-primary mt-4" onClick={handleDownloadPDF}>
          Download
        </button>
      </div>
    </>
  );
};

export default DailyDepositRegister;
