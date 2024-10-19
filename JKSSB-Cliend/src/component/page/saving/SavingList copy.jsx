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
  const [Centers, setCenters] = useState([]);
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

    const storedUserData = localStorage.getItem("BranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("Branch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("Center"))
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
        // Filter centers the user has access to based on Center
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

        setCenters(userAccessibleCenters); // Store user's specific centers
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
        setCenters(centers); // Store the user's specific centers
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
        const Name = response.data.Name;
        setSelectedWorker(Name ? Name : "No worker found");
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
        if (SavingType && selectedCenter) {
          const translatedSavingType = SavingTypeTranslations[SavingType];
          const endpoint =
            SavingType === "General"
              ? `http://localhost:5000/savingtype-callback/${translatedSavingType}`
              : `http://localhost:5000/saving-callback-center/${selectedCenter}`;

          const response = await axios.get(endpoint);

          let filteredData = [];
          if (SavingType === "General") {
            filteredData = response.data.filter(
              (item) =>
                item.SavingCenter === selectedCenter &&
                item.ActiveStatus === (deleteMode ? "False" : "True") // Add the deleteMode logic here
            );
          } else if (selectedDate) {
            const searchDate = moment(selectedDate).format("DD-MM-YY");
            filteredData = response.data.filter(
              (item) =>
                item.nextDates.includes(searchDate) &&
                item.ActiveStatus === (deleteMode ? "False" : "True") // Add the deleteMode logic here
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
  }, [SavingType, selectedCenter, selectedDate, deleteMode]);

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

  // Toggle button function
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="bg-light container-fluid">
      <form>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">সঞ্চয়ের তালিকা</h2>
          </div>

          <div className="row">
            <div className="mb-3 col-3">
              <label htmlFor="SavingType" className="form-label">
                সঞ্চয়ের ধরণ
              </label>
              <select
                id="SavingType"
                className="form-select"
                onChange={handleSavingTypeChange}
                value={SavingType}
              >
                <option value="">বাছাই করুণ</option>
                {Object.entries(SavingTypeTranslations).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="CenterSelect" className="form-label">
                কেন্দ্র নির্বাচন করুণ
              </label>
              <select
                className="form-select"
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
                      .filter((center) => Centers.includes(center.centerID))
                      .map((center) => (
                        <option key={center._id} value={center.centerID}>
                          {center.centerID}
                        </option>
                      ))}
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="date" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="date"
                  className="form-control"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="CenterWorker" className="form-label">
                কেন্দ্র কর্মীর নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="CenterWorker"
                value={selectedWorker}
                readOnly
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="CenterDay" className="form-label">
                কেন্দ্র বার
              </label>
              <input
                type="text"
                className="form-control"
                id="CenterDay"
                value={centerDay}
                readOnly
              />
            </div>
            <div className="col-md-3 mb-3  justify-content-end  mt-3">
              <label className="form-label">Show Deleted Installment</label>
              <button
                type="button"
                className={`btn btn-lg btn-toggle ${
                  deleteMode ? "active" : ""
                }`}
                onClick={handleToggleClick}
                aria-pressed={deleteMode}
              >
                <div className="handle"></div>
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          {centerMember.length > 0 ? (
            <>
              <table className="table table-hover">
                <thead>
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
                  {centerMember.map((center, index) => (
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
                  className="btn btn-success mt-3"
                  onClick={exportToExcel}
                >
                  Download as Excel
                </button>
              </div>
            </>
          ) : selectedCenter && (SavingType === "General" || selectedDate) ? (
            <p>
              {" "}
              কেন্দ্র এবং {SavingType === "General" ? "সাধারণ" : "তারিখ"}{" "}
              অনুযায়ী কোন সঞ্চয় নেই{" "}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SavingList;
