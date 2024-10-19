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
  const [messageType, setMessageType] = useState("success"); // Add messageType state
  const [fields, setFields] = useState({ savingCollecting: {} });
  const [centerDay, setCenterDay] = useState("");
  const [userCenters, setuserCenters] = useState([]);

  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
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

  const handleChange = (field, id, value) => {
    setFields({
      ...fields,
      [field]: { ...fields[field], [id]: value },
    });
  };

  const handleBlur = (field, id) => {
    const member = centerMember.find((member) => member.SavingID === id);
    if (member) {
      const SavingAmount = parseFloat(member.SavingAmount); // Convert to number
      const inputValue = parseFloat(fields[field][id]); // Convert input value to number

      // Allow any value for "General" SavingType (translated as "সাধারণ")
      if (member.SavingType === SavingTypeTranslations.General) {
        setSubmitMessage(""); // Clear any previous error message
        setMessageType(""); // Clear message type
        return; // Skip further validation
      }

      // Apply validation for non-General SavingTypes
      if (!isNaN(inputValue) && !isNaN(SavingAmount)) {
        if (inputValue % SavingAmount !== 0) {
          // Set danger message and message type
          setSubmitMessage(
            `${member.SavingName} এর জন্য অবশ্যই ${SavingAmount} বা ${SavingAmount} এর গুণিতক টাকা যোগ করুণ `
          );
          setMessageType("danger"); // Set the message type to 'danger'
        } else {
          setSubmitMessage(""); // Clear error message if input is valid
          setMessageType(""); // Clear message type
        }
      } else {
        setSubmitMessage("নাম্বার ছাড়া  অন্য কিছু দেওয়া যাবে না");
        setMessageType("danger"); // Set the message type to 'danger'
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidEntries = [];
    const emptyEntries = [];
    const validData = centerMember.map((member) => {
      const savingCollectingValue = parseFloat(
        fields.savingCollecting[member.SavingID] || 0
      );
      const savingAmountValue = parseFloat(member.SavingAmount || 0);

      // Check for empty input
      if (!savingCollectingValue) {
        emptyEntries.push(member);
      }

      // Run handleBlur validation for savingCollecting
      handleBlur("savingCollecting", member.SavingID);

      // Skip SavingCount calculation if SavingType is General
      let savingCountValue = 0;
      if (member.SavingType === "General" || member.SavingType === "সাধারণ") {
        // Allow any value if SavingType is "General" and set SavingCount to 1
        savingCountValue = savingCollectingValue > 0 ? 1 : 0; // Ensure SavingCount is 1 if the value is greater than 0
      } else {
        // If it's not "General", calculate SavingCount as usual
        savingCountValue =
          savingAmountValue > 0 ? savingCollectingValue / savingAmountValue : 0;
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
        "কিছু সঞ্চয় খালি আছে, সঞ্চয় খালি রেখেই বাকি সঞ্চয় গ্রহণ করতে চান?"
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
      setSubmitMessage("সঠিক ভাবে সঞ্চয় গ্রহণ করা হয়েছে");
      setMessageType("success"); // Set message type to 'success'

      // Clear form inputs and state
      setFields({ savingCollecting: {}, SavingCount: {} });
      setSelectedDate(null);
      setSelectedCenter("");
      setCenterMember([]);
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
      setMessageType("danger"); // Set message type to 'danger' on error
    }
  };

  return (
    <div className="bg-light container-fluid">
      <form onSubmit={handleSubmit}>
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
                  <i className="fas fa-money-bill-wave"></i> সঞ্চয় গ্রহণ
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
                  <option value="">বাছাই করুণ</option>
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
                    id="SavingCollectionDate"
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
          {centerMember.length > 0 ? (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Saving ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>মোবাইল</th>
                  <th>সঞ্চয়ের ধরণ</th>
                  <th>সঞ্চয়ের সময়</th>
                  <th>সঞ্চয়ের পরিমাণ</th>
                  <th>সঞ্চয় জমা</th>
                  {/* <th>সঞ্চয় সংখ্যা</th> */}
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
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (
                            fields.savingCollecting[center.SavingID] !==
                            newValue
                          ) {
                            handleChange(
                              "savingCollecting",
                              center.SavingID,
                              newValue
                            );
                          }
                        }}
                        onBlur={() =>
                          handleBlur(
                            "savingCollecting",
                            center.SavingID,
                            center.SavingAmount
                          )
                        }
                        className="form-control"
                      />
                    </td>

                    {/* <td>
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
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedCenter && (SavingType === "General" || selectedDate) ? (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>{" "}
              {/* Font Awesome info icon */} কেন্দ্র এবং{" "}
              {SavingType === "General" ? "সাধারণ" : "তারিখ"} অনুযায়ী কোন সঞ্চয়
              নেই{" "}
            </div>
          ) : null}
        </div>
        <div className="d-flex justify-content-center mb-3 mt-5">
          <button
            type="submit"
            className="btn btn-primary btn-lg shadow"
            style={{
              background: "linear-gradient(45deg, #007bff, #00d4ff)",
              color: "#fff",
            }}
          >
            <i className="fas fa-paper-plane"></i> Submit
          </button>
        </div>

        {submitMessage && (
          <div
            className={`alert alert-${messageType} mt-3 d-flex align-items-center`}
            role="alert"
            style={{
              borderRadius: "0.5rem", // Rounded corners
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            }}
          >
            <i
              className={`fas fa-${
                messageType === "danger" ? "exclamation-circle" : "check-circle"
              }`}
              style={{
                fontSize: "1.5rem",
                marginRight: "10px", // Space between icon and text
                color: messageType === "danger" ? "#721c24" : "#155724", // Red for danger, green for success
              }}
            ></i>
            <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default SavingCollection;
