// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

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

const SavingCollection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");

  const [submitMessage, setSubmitMessage] = useState("");
  const [fields, setFields] = useState({ savingCollecting: {} });
  const [centerDay, setCenterDay] = useState("");
  const [userCenters, setuserCenters] = useState([]);

  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [SavingType, setSavingType] = useState("");
  const [username, setUsername] = useState("Unknown");

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

    // Retrieve user branch data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserCenter"))
        .map((key) => parsedData[key]);

      const userDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];

      // Get username from localStorage data
      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const storedUsername = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(storedUsername); // Store the username in the state

      setDesignation(userDesignation); // Set the designation in the state

      if (branches.includes("AllBranch")) {
        setHasAccess(true); // Grant full access
      } else if (restrictedDesignations.includes(userDesignation)) {
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

  const handleChange = (field, id, value) => {
    setFields({
      ...fields,
      [field]: { ...fields[field], [id]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidEntries = [];
    const emptyEntries = [];
    const validData = centerMember.map((member) => {
      const savingCollectingValue = fields.savingCollecting[member.SavingID];
      const savingCountValue = fields.SavingCount?.[member.SavingID];

      if (!savingCollectingValue) {
        emptyEntries.push(member);
      } else if (
        SavingType !== "General" &&
        parseFloat(savingCollectingValue) !== parseFloat(member.SavingAmount)
      ) {
        invalidEntries.push(
          `সঞ্চয় জমা must match the saving amount for ${member.SavingID}`
        );
      }
      return {
        ...member,
        SavingCollecting: savingCollectingValue || 0,
        SavingCount: savingCountValue || 0, // Default savingCount to 0 if empty
      };
    });

    if (invalidEntries.length > 0) {
      setSubmitMessage(invalidEntries.join(", "));
      return;
    }

    if (emptyEntries.length > 0) {
      const confirmation = window.confirm(
        "Some input fields are empty. Do you want to save the non-empty data?"
      );
      if (!confirmation) {
        return;
      }
    }

    // Filter out entries with empty or zero values
    const dataWithSavings = validData.filter(
      (member) =>
        member.SavingCollecting !== "" &&
        member.SavingCollecting !== 0 &&
        member.SavingCount !== "" &&
        member.SavingCount !== 0
    );
    // Prepare request payload including savingCount as an array
    const requestData = {
      centerName: selectedCenter,
      savingDate: moment(selectedDate).format("DD-MM-YY"),
      centerWorker: selectedWorker,
      data: dataWithSavings.map((member) => ({
        SavingID: member.SavingID,
        memberID: member.memberID,
        SavingName: member.SavingName,
        SavingType: member.SavingType,
        CenterName: member.CenterName,
        SavingMobile: member.SavingMobile,
        SavingTime: member.SavingTime,
        SavingAmount: member.SavingAmount,
        SavingCollecting: [member.SavingCollecting], // Send savingCollecting as an array
        SavingCount: [member.SavingCount], // Send savingCount as an array
        submittedBy: [username], // Send submittedBy as an array
      })),
    };

    // Send data to backend
    try {
      await axios.post(
        "http://localhost:5000/save-savings-collection",
        requestData
      );
      setSubmitMessage("Data saved successfully!");

      // Clear form inputs and state
      setFields({ savingCollecting: {}, SavingCount: {} });
      setSelectedDate(null);
      setSelectedCenter("");
      setCenterMember([]);
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
      console.error("Error saving data:", error.message);
    }
  };

  // Toggle button function
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="bg-light container-fluid">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">সঞ্চয় গ্রহণ</h2>
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
              <label htmlFor="CenterName" className="form-label">
                কেন্দ্র নির্বাচন করুণ
              </label>
              <select
                className="form-select"
                id="CenterName"
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
                      .filter((center) => userCenters.includes(center.centerID))
                      .map((center) => (
                        <option key={center._id} value={center.centerID}>
                          {center.centerID}
                        </option>
                      ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="SavingCollectionDate" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="SavingCollectionDate"
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
              <label className="form-label">Show Deleted Saving</label>
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
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Saving ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>মোবাইল</th>
                  <th>সঞ্চয়ের ধরণ</th>
                  <th>সঞ্চয়ের সময়</th>
                  <th>সঞ্চয়ের পরিমাণ</th>
                  <th>সঞ্চয় জমা</th>
                  <th>সঞ্চয় সংখ্যা</th>
                </tr>
              </thead>
              <tbody>
                {centerMember.map((center, index) => (
                  <tr key={index}>
                    <td>{center.SavingID}</td>
                    <td>{center.memberID}</td>
                    <td>{center.SavingName}</td>
                    <td>{center.SavingMobile}</td>
                    <td>{center.SavingType}</td>
                    <td>{center.SavingTime}</td>
                    <td>{center.SavingAmount}</td>
                    <td>
                      <input
                        type="number"
                        value={fields.savingCollecting[center.SavingID] || ""}
                        placeholder="সঞ্চয়"
                        onChange={(e) =>
                          handleChange(
                            "savingCollecting",
                            center.SavingID,
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="সংখ্যা"
                        value={fields.SavingCount?.[center.SavingID] || ""} // saving count value
                        onChange={(e) =>
                          handleChange(
                            "SavingCount",
                            center.SavingID,
                            e.target.value
                          )
                        } // Update installment count
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedCenter && (SavingType === "General" || selectedDate) ? (
            <p>
              {" "}
              কেন্দ্র এবং {SavingType === "General" ? "সাধারণ" : "তারিখ"}{" "}
              অনুযায়ী কোন সঞ্চয় নেই{" "}
            </p>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
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

export default SavingCollection;
