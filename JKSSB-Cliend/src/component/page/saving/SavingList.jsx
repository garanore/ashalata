// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

const SavingList = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [SavingType, setSavingType] = useState("");
  const [centerDay, setCenterDay] = useState("");
  const [userCenters, setuserCenters] = useState([]);
  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 40; // Centers per page

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

  const handleSavingTypeChange = (e) => {
    setSavingType(e.target.value);
    setSelectedDate(null);
    setCenterMember([]);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (SavingType && selectedCenter && selectedDate) {
          const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
          const translatedSavingType = SavingTypeTranslations[SavingType];

          // Call API that handles savingType, centerID, and selectedDate
          const response = await axios.get(
            `http://localhost:5000/saving-callback-type-center-date/${translatedSavingType}/${formattedDate}`
          );

          let filteredData = response.data.filter(
            (item) => item.SavingCenter === selectedCenter
          );

          setCenterMember(filteredData);
        } else if (SavingType && selectedCenter) {
          // Handle the case where only SavingType and selectedCenter are chosen
          const translatedSavingType = SavingTypeTranslations[SavingType];
          const endpoint =
            SavingType === "General"
              ? `http://localhost:5000/savingtype-callback/${translatedSavingType}`
              : `http://localhost:5000/saving-callback-center/${selectedCenter}`;

          const response = await axios.get(endpoint);

          let filteredData = [];
          if (SavingType === "General") {
            filteredData = response.data.filter(
              (item) => item.SavingCenter === selectedCenter
            );
          }

          setCenterMember(filteredData);
        } else {
          setCenterMember([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [SavingType, selectedCenter, selectedDate]); // Add selectedDate to the dependency array

  const exportToExcel = () => {
    const data = centerMember.map((center) => ({
      কেন্দ্র: selectedCenter,
      "কেন্দ্র বার": centerDay,
      "কেন্দ্র কর্মীর নাম": selectedWorker,
      তারিখ: selectedDate ? moment(selectedDate).format("DD-MM-YY") : "",
      "Saving ID": center.SavingID,
      "সদস্য ID": center.memberID,
      "সদস্য নাম": center.SavingName,
      "পিতা/স্বামীর নাম": center.fathername,
      মোবাইল: center.SavingMobile,
      "সঞ্চয়ের ধরণ": center.SavingType,
      "সঞ্চয়ের সময়": center.SavingTime,
      "সঞ্চয়ের পরিমাণ": center.SavingAmount,
      // Add more fields if needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Savings");

    // Apply styles to the header row
    const headerRow = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
    ];
    headerRow.forEach((cell) => {
      worksheet[cell].s = {
        font: {
          bold: true,
          sz: 16,
        },
      };
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Savings.xlsx");
  };

  // Pagination logic
  const indexOfLastSaving = currentPage * centersPerPage;
  const indexOfFirstSaving = indexOfLastSaving - centersPerPage;
  const currentSaving = centerMember.slice(
    indexOfFirstSaving,
    indexOfLastSaving
  );
  const totalPages = Math.ceil(centerMember.length / centersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
                  <i className="fas fa-money-bill-wave"></i> সঞ্চয়ের তালিকা
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
            <div className="col-3">
              <label
                htmlFor="SavingType"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-money-check-alt"></i> সঞ্চয়ের ধরণ
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-money-check-alt"></i>
                </span>
                <select
                  id="SavingType"
                  className="form-control border-primary"
                  onChange={handleSavingTypeChange}
                  value={SavingType}
                >
                  <option value="">--------</option>
                  {Object.entries(SavingTypeTranslations).map(
                    ([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="SavingCenter"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-map-marker-alt"></i> কেন্দ্র
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
                  <option value="">Choose...</option>
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
                htmlFor="installmentStart"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-calendar-alt"></i> তারিখ নির্বাচন করুণ
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
                <div>
                  <DatePicker
                    id="date"
                    className="form-control border-primary"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="CenterWorker"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-user"></i>
                কেন্দ্র কর্মীর নাম
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-user"></i>
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

            <div className="col-3">
              <label
                htmlFor="CenterDay"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-money-bill-wave"></i> কেন্দ্র বার
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-money-bill-wave"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="CenterDay"
                  value={centerDay}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-5">
          {currentSaving.length > 0 ? (
            <>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Saving ID</th>
                    <th>সদস্য ID</th>
                    <th>সদস্য নাম</th>
                    <th>পিতা/স্বামীর নাম</th>
                    <th>মোবাইল</th>
                    <th>কেন্দ্র</th>
                    <th>সঞ্চয়ের ধরণ</th>
                    <th>সঞ্চয়ের সময়</th>
                    <th>সঞ্চয়ের পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSaving.map((center, index) => (
                    <tr key={index}>
                      <td>{center.SavingID}</td>
                      <td>{center.memberID}</td>
                      <td>{center.SavingName}</td>
                      <td>{center.fathername}</td>
                      <td>{center.SavingMobile}</td>
                      <td>{center.SavingCenter}</td>
                      <td>{center.SavingType}</td>
                      <td>{center.SavingTime}</td>
                      <td>{center.SavingAmount}</td>
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
          ) : selectedCenter && (SavingType === "General" || selectedDate) ? (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>{" "}
              {/* Font Awesome info icon */} কেন্দ্র এবং{" "}
              {SavingType === "General" ? "সাধারণ" : "তারিখ"} অনুযায়ী কোন সঞ্চয়
              নেই{" "}
            </div>
          ) : null}
        </div>
      </form>

      {selectedCenter && (
        <div className="row justify-content-center my-3">
          <div className="col-md-12">
            <nav>
              <ul className="pagination pagination-rounded">
                <li className="page-item">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`page-link ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    disabled={currentPage === 1} // Disable if on the first page
                    title="Previous Page"
                  >
                    <i className="fas fa-chevron-left"></i>{" "}
                    {/* Left arrow icon */}
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginate(i + 1)}
                      className="page-link"
                      title={`Go to page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className={`page-link ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    disabled={currentPage === totalPages} // Disable if on the last page
                    title="Next Page"
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>{" "}
                    {/* Right arrow icon */}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingList;
