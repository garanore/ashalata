// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

const InstallmentCollection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // Add messageType state
  const [fields, setFields] = useState({ installmentCollecting: {} });
  const [centerDay, setCenterDay] = useState("");
  const [centerBranch, setcenterBranch] = useState("");
  const [userCenters, setuserCenters] = useState([]);

  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);

  const [username, setUsername] = useState("Unknown");

  const [calculatedOnlyInterest, setCalculatedOnlyInterest] = useState({});

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

  useEffect(() => {
    // Fetch center day when selectedCenter changes
    if (selectedCenter) {
      axios
        .get(`http://localhost:5000/center-callback-id/${selectedCenter}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCenterDay(response.data[0].CenterDay); // Assuming CenterDay is available in the first item of the response array
            setcenterBranch(response.data[0].centerBranch); // Assuming CenterDay is available in the first item of the response array
          } else {
            setCenterDay(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
            setcenterBranch(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
          }
        })
        .catch((error) => {
          console.error("Error fetching center details:", error);
        });
    } else {
      setCenterDay(""); // Clear centerDay if no center is selected
      setcenterBranch(""); // Clear centerDay if no center is selected
    }
  }, [selectedCenter]);

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
    setSelectedCenter(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (field, id, value) => {
    setFields({
      ...fields,
      [field]: { ...fields[field], [id]: value },
    });
  };

  const handleBlur = (field, id) => {
    const member = centerMember.find((member) => member.loanID === id);
    if (member) {
      const installment = parseFloat(member.installment); // Convert to number
      const inputValue = parseFloat(fields[field][id]); // Convert input value to number

      if (!isNaN(inputValue) && !isNaN(installment)) {
        if (inputValue % installment !== 0) {
          // Set danger message and message type
          setSubmitMessage(
            `${member.OLname} এর জন্য অবশ্যই ${installment} বা ${installment} এর গুণিতক টাকা যোগ করুণ `
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

  const handleInstallmentChange = (
    loanID,
    value,
    installment,
    onlyInterest
  ) => {
    const inputValue = parseFloat(value);
    const installmentValue = parseFloat(installment);

    if (
      !isNaN(inputValue) &&
      !isNaN(installmentValue) &&
      installmentValue > 0
    ) {
      // Calculate how many times the installment is entered
      const multiplier = Math.floor(inputValue / installmentValue);

      // Calculate the new onlyInterest value based on the multiplier
      const newOnlyInterest = multiplier * onlyInterest;

      // Store the calculated onlyInterest in state
      setCalculatedOnlyInterest((prevState) => ({
        ...prevState,
        [loanID]: newOnlyInterest,
      }));

      // Continue with the normal handleChange logic
      handleChange("installmentCollecting", loanID, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyEntries = [];

    const validData = centerMember.map((member) => {
      const installmentCollectingValue =
        fields.installmentCollecting[member.loanID];
      fields.installmentCount?.[member.loanID];
      const installmentValue = member.installment;

      if (!installmentCollectingValue || !installmentValue) {
        emptyEntries.push(member);
      }

      const calculatedInstallmentCount =
        installmentCollectingValue && installmentValue
          ? Math.floor(installmentCollectingValue / installmentValue)
          : 0;

      return {
        ...member,
        InstallmentCollecting: installmentCollectingValue || 0,
        InstallmentCount: calculatedInstallmentCount,
      };
    });

    if (emptyEntries.length > 0) {
      const confirmation = window.confirm(
        "কিছু কিস্তি জমা খালি আছে, কিস্তি জমা খালি রেখেই বাকি কিস্তি গ্রহণ করতে চান?"
      );
      if (!confirmation) {
        return;
      }
    }

    const dataWithInstallments = validData.filter(
      (member) =>
        member.InstallmentCollecting !== "" &&
        member.InstallmentCollecting !== 0 &&
        member.InstallmentCount !== "" &&
        member.InstallmentCount !== 0
    );

    const requestData = {
      centerName: selectedCenter,
      installmentDate: moment(selectedDate).format("DD-MM-YY"),
      centerBranch: centerBranch,
      submittedBy: [username],
      data: dataWithInstallments.map((member) => ({
        loanID: member.loanID,
        memberID: member.memberID,
        OLname: member.OLname,
        OLmobile: member.OLmobile,
        loanType: member.loanType,
        onlyInterest: member.onlyInterest,
        installment: [member.InstallmentCollecting],
        installmentCount: [member.InstallmentCount],
      })),
    };

    axios
      .post("http://localhost:5000/save-installments-collection", requestData)
      .then(() => {
        setSubmitMessage("সঠিক ভাবে কিস্তি গ্রহণ করা হয়েছে");
        setMessageType("success"); // Set message type to 'success'

        setFields({ installmentCollecting: {} });
        setSelectedDate(null);
        setSelectedCenter("");
        setCenterMember([]);
      })
      .catch((error) => {
        setSubmitMessage(`Error: ${error.message}`);
        setMessageType("danger"); // Set message type to 'danger' on error
      });
  };

  // Toggle button function
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
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
                  <i className="fas fa-hand-holding-usd"></i> কিস্তি গ্রহণ
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
            </div>

            <div className="col-md-3">
              <label
                htmlFor="centerBranch"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-code-branch"></i> শাখা
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-code-branch"></i>
                </span>
                <input
                  type="text"
                  className="form-select border-primary"
                  id="centerBranch"
                  value={centerBranch}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="InstallmentDate"
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
                    id="InstallmentDate"
                    className="form-select border-primary"
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

            <div className="col-md-3 mb-5 mt-5 d-flex align-items-end">
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
        <div className="table-responsive">
          {centerMember.length > 0 ? (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Loan ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>মোবাইল</th>
                  <th>ঋণের ধরণ</th>
                  <th>কিস্তির পরিমাণ </th>
                  <th>কিস্তি জমা </th>
                  {/* <th>কিস্তি সংখ্যা </th> */}
                  {/* Add more table headings if needed */}
                </tr>
              </thead>
              <tbody>
                {centerMember.map((center, index) => (
                  <tr key={index}>
                    <td>{center.loanID}</td>
                    <td>{center.memberID}</td>
                    <td>{center.OLname}</td>
                    <td>{center.OLmobile}</td>
                    <td>{center.loanType}</td>
                    <td>{center.installment}</td>

                    {/* Wrap hidden input in a <td> */}

                    <td style={{ display: "none" }}>
                      <input
                        type="hidden"
                        value={
                          calculatedOnlyInterest[center.loanID] ||
                          center.onlyInterest
                        }
                        name={`onlyInterest-${center.loanID}`}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={
                          fields.installmentCollecting[center.loanID] || ""
                        }
                        placeholder="কিস্তি"
                        onChange={(e) =>
                          handleInstallmentChange(
                            center.loanID,
                            e.target.value,
                            center.installment,
                            center.onlyInterest
                          )
                        }
                        onBlur={() =>
                          handleBlur("installmentCollecting", center.loanID)
                        }
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedCenter && selectedDate ? (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>{" "}
              {/* Font Awesome info icon */}
              কেন্দ্র এবং তারিখ অনুযায়ী কোন কিস্তি নেই
            </div>
          ) : null}
        </div>

        <div className="d-flex justify-content-center mb-3">
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

export default InstallmentCollection;
