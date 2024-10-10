// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Loan.css";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

const InstallmentList = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [centerDay, setCenterDay] = useState("");
  const [userCenters, setuserCenters] = useState([]);

  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/center-callback")
      .then((response) => {
        // Filter out centers with ActiveStatus "False"
        const activeCenters = response.data.filter(
          (center) => center.ActiveStatus !== "False"
        );
        setCenters(activeCenters);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    // Function to fetch centers for branches
    const fetchCentersForBranches = async (branches) => {
      try {
        // Fetch centers for each branch
        const centerPromises = branches.map((branch) =>
          axios.get(`http://localhost:5000/center-callback-by-branch/${branch}`)
        );

        const centerResponses = await Promise.all(centerPromises);

        // Extract and merge center data from the responses
        const allCenters = centerResponses
          .map((response) => response.data)
          .flat(); // Flatten the array of arrays

        // Filter out inactive centers
        const activeCenters = allCenters.filter(
          (center) => center.ActiveStatus !== "False"
        );

        setCenters(activeCenters); // Set the merged active centers
      } catch (error) {
        console.error("Error fetching centers for branches:", error);
      }
    };

    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserCenter"))
        .map((key) => parsedData[key]);

      const userDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];

      setDesignation(userDesignation); // Set the designation in the state

      // First logic: check if the user has access to all branches
      if (branches.includes("AllBranch")) {
        setHasAccess(true); // Grant full access
      }
      // Second logic: check if the user has restricted designation
      else if (restrictedDesignations.includes(userDesignation)) {
        // Filter centers the user has access to based on UserCenter
        const userAccessibleCenters = centers;

        // Fetch only the centers the user has access to
        axios
          .get("http://localhost:5000/center-callback")
          .then((response) => {
            const activeCenters = response.data.filter(
              (center) =>
                center.ActiveStatus !== "False" &&
                userAccessibleCenters.includes(center.centerID)
            );
            setCenters(activeCenters); // Set the filtered centers
          })
          .catch((error) => {
            console.error("Error fetching center data:", error);
          });

        setuserCenters(userAccessibleCenters); // Store user's specific centers
        setHasAccess(false); // Restrict access to specific centers
      }
      // Third logic: check if the user has specific branches
      else if (branches.length > 0) {
        // Call the fetchCentersForBranches function only if branches exist
        fetchCentersForBranches(branches);
        setHasAccess(false); // Restrict access to specific centers
      }
      // If no specific access is granted
      else {
        setuserCenters(centers); // Store the user's specific centers
        setHasAccess(false); // Restrict access
      }
    }
  }, []);

  useEffect(() => {
    // Fetch data based on selected center and date
    if (selectedCenter && selectedDate) {
      const searchDate = moment(selectedDate).format("DD-MM-YY"); // Format selectedDate as "DD-MM-YY"
      axios
        .get(`http://localhost:5000/get-installmentDate/${selectedCenter}`)
        .then((response) => {
          const filteredData = response.data.filter(
            (item) =>
              item.nextDates.includes(searchDate) &&
              item.ActiveStatus === (deleteMode ? "False" : "True")
          );
          setCenterMember(filteredData);
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    } else {
      setCenterMember([]);
    }
  }, [selectedCenter, selectedDate, deleteMode]);

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setSelectedCenter(e.target.value);
    axios
      .get(`http://localhost:5000/center-callback-id/${center}`)
      .then((response) => {
        const workerData = response.data;
        setSelectedWorker(
          workerData.length > 0 ? workerData[0].centerWorker : ""
        );
        setCenterDay(workerData.length > 0 ? workerData[0].CenterDay : "");
      });
    axios
      .get(`http://localhost:5000/get-worker-name/${center}`)
      .then((response) => {
        const workerName = response.data.WorkerName;
        setSelectedWorker(workerName ? workerName : "No worker found");
      })
      .catch((error) => {
        console.error("Error fetching worker name:", error);
        setSelectedWorker("No worker found");
      })
      .catch((error) => {
        console.error("Error fetching center worker data:", error);
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const exportToExcel = () => {
    const data = centerMember.map((center) => ({
      কেন্দ্র: selectedCenter,
      "কেন্দ্র বার": centerDay,
      "কেন্দ্র কর্মীর নাম": selectedWorker,
      তারিখ: moment(selectedDate).format("DD-MM-YY"),
      "Loan ID": center.loanID,
      "সদস্য ID": center.memberID,
      "সদস্য নাম": center.OLname,
      "পিতা/স্বামীর নাম": center.fathername,
      মোবাইল: center.OLmobile,
      "ঋণের ধরণ": center.loanType,
      "কিস্তির পরিমাণ": center.installment,
      // Add more fields if needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Installments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Installments.xlsx");
  };

  // Toggle button function
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="bg-light container-fluid">
      <form>
        <div className="mb-3">
          <div className="row mb-4">
            <div className="col">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "#f0f4f8", // Soft background for the header
                  borderRadius: "10px", // Rounded edges for a modern look
                  padding: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                }}
              >
                <h2
                  className="text-center mb-0"
                  style={{
                    fontWeight: "bold",
                    color: "#2D3748",
                    fontSize: "2rem", // Larger text for prominence
                  }}
                >
                  <i className="fas fa-tasks"></i> কিস্তির তালিকা
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #2D3748", // Thicker line for emphasis
                  marginTop: "10px",
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-3">
              <label
                htmlFor="CenterSelect"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-map-marker-alt"></i> কেন্দ্র নির্বাচন করুণ
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <select
                  className="form-select border-primary"
                  id="CenterSelect"
                  onChange={handleCenterChange}
                  value={selectedCenter}
                >
                  <option value="">--------</option>

                  {hasAccess || !restrictedDesignations.includes(designation)
                    ? centers.map((center) => (
                        <option key={center._id} value={center.centerID}>
                          {center.centerID}
                        </option>
                      ))
                    : centers
                        .filter((center) =>
                          userCenters.includes(center.centerID)
                        )
                        .map((center) => (
                          <option key={center._id} value={center.centerID}>
                            {center.centerID}
                          </option>
                        ))}
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="selectedDate"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-calendar-check"></i> তারিখ নির্বাচন করুণ
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-calendar-check"></i>
                </span>
                <div>
                  <DatePicker
                    id="date"
                    className="form-select border-primary w-100%"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <small className="text-muted">
                  কেন্দ্র বার অনুযায়ী তারিখ নির্বাচন করুণ
                </small>
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="CenterWorker"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-user-tie"></i> কেন্দ্র কর্মীর নাম
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-user-tie"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="CenterWorker"
                  value={selectedWorker}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="CenterDay"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-calendar-alt"></i> কেন্দ্র বার
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-calendar-alt"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="CenterDay"
                  value={centerDay}
                  readOnly
                />
              </div>
              <small className="text-muted">
                এই বার অনুযায়ী তারিখ নির্বাচন করুণ
              </small>
            </div>

            <div className="col-md-3 mb-3 d-flex align-items-end">
              <label
                className="form-label"
                style={{
                  fontWeight: "bold",
                  color: "#2D3748",
                  fontSize: "0.95rem",
                }}
              >
                {" "}
                Show Deleted Installment
              </label>
              <button
                type="button"
                className={`btn btn-lg btn-toggle ${
                  deleteMode ? "active" : ""
                }`}
                onClick={handleToggleClick}
                aria-pressed={deleteMode}
                style={{
                  marginLeft: "10px",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  backgroundColor: deleteMode ? "#48BB78" : "#E53E3E",
                  color: "#fff",
                }}
              >
                <div className="handle"></div>
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-5">
          {centerMember.length > 0 ? (
            <>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Loan ID</th>
                    <th>সদস্য ID</th>
                    <th>সদস্য নাম</th>
                    <th>পিতা/স্বামীর নাম</th>
                    <th>মোবাইল</th>
                    <th>কেন্দ্র </th>
                    <th>ঋণের ধরণ</th>
                    <th>কিস্তির পরিমাণ </th>
                    {/* Add more table headings if needed */}
                  </tr>
                </thead>
                <tbody>
                  {centerMember.map((center, index) => (
                    <tr key={index}>
                      <td>{center.loanID}</td>
                      <td>{center.memberID}</td>
                      <td>{center.OLname}</td>
                      <td>{center.fathername}</td>
                      <td>{center.OLmobile}</td>
                      <td>{center.OLcenter}</td>
                      <td>{center.loanType}</td>
                      <td>{center.installment}</td>
                      {/* Add more table cells for other data if needed */}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-center">
                <button
                  type="button"
                  className="btn custom-btn mt-3"
                  onClick={exportToExcel}
                >
                  <i className="fas fa-file-excel"></i> Download as Excel
                </button>
              </div>
            </>
          ) : selectedCenter && selectedDate ? (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>{" "}
              {/* Font Awesome info icon */}
              কেন্দ্র এবং তারিখ অনুযায়ী কোন কিস্তি নেই
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default InstallmentList;
