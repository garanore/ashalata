// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

// Define loan type translations
const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

const SavingTimeTranslations = {
  ThreeYear: "৩ বছর",
  FiveYear: "৫ বছর",
  TenYear: "১০ বছর",
};

function OpenSavings() {
  // State variables
  const [installmentStart, setInstallmentStart] = useState(null);
  const [SavingAmount, setSavingAmount] = useState("");

  const [SavingType, setSavingType] = useState("");
  const [SavingTime, setSavingTime] = useState("");
  const [installment, setInstallment] = useState("");

  const [SavingCount, setSavingCount] = useState(0);
  const [SavingID, setSavingID] = useState("");
  const [memberID, setMemberID] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [centerDay, setCenterDay] = useState("");
  const [installmentCount, setInstallmentCount] = useState(46); // Default installment count

  useEffect(() => {
    // Fetch member data
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/member-callback"
        );
        setMemberData(response.data.members);
      } catch (error) {
        console.error("Error fetching member data:", error.message);
      }
    };

    fetchMemberData();
  }, []);

  // Fetch center details based on selected member's center ID
  const fetchCenterDetails = async (centerID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/center-callback-id/${centerID}`
      );
      if (response.data && response.data.length > 0) {
        setCenterDay(response.data[0].CenterDay); // Assuming CenterDay is available in the first item of the response array
      } else {
        setCenterDay(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
      }
    } catch (error) {
      console.error("Error fetching center details:", error.message);
    }
  };

  // Generate Saving ID-----------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSavingCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/opensaving/count"
      );
      const count = response.data.count;
      setSavingCount(count);
      setSavingID(generateSavingID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  useEffect(() => {
    fetchSavingCount();
  }, [fetchSavingCount]);

  const generateSavingID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `S${paddedCount}`;
  };

  // Find Member With Member ID------------------------------------------------
  useEffect(() => {
    // Check if memberData is available and not empty
    if (!memberData || memberData.length === 0) {
      return;
    }

    // Now, memberData should be available
    const fetchedMember = memberData.find(
      (member) => member.memberID === memberID
    );

    // Check if the member is found
    if (fetchedMember) {
      setSelectedMember(fetchedMember);
      setSavingType(fetchedMember.SavingType || "");
      setSavingTime(fetchedMember.SavingTime || "");
      setSavingAmount(fetchedMember.amount || "0");
    } else {
      setSelectedMember(null);
      setSavingType("");
      setSavingTime("");
      setSavingAmount("0");
    }
  }, [memberData, memberID]);

  // Handle Member ID change
  const handleMemberIDChange = async (e) => {
    const enteredMemberID = e.target.value;
    setMemberID(enteredMemberID);

    try {
      // Fetch member data
      const response = await axios.get("http://localhost:5000/member-callback");

      if (Array.isArray(response.data) && response.data.length > 0) {
        const fetchedMember = response.data.find(
          (member) => member.memberID === enteredMemberID
        );

        if (fetchedMember) {
          setSelectedMember(fetchedMember);
          setSavingType(fetchedMember.SavingType || "");
          setSavingAmount(fetchedMember.amount || "0");

          // Fetch center details based on selected member's center ID
          fetchCenterDetails(fetchedMember.CenterIDMember);
        } else {
          setSelectedMember(null);
          setSavingType("");
          setSavingAmount("0");

          setCenterDay(""); // Reset CenterDay if member not found
        }
      } else {
        setSelectedMember(null);
        setSavingType("");
        setSavingAmount("0");

        setCenterDay(""); // Reset CenterDay if member data is empty
      }
    } catch (error) {
      console.error("Error fetching member data:", error.message);
    }
  };

  //----------------------------------------------------------------
  // Handle date change
  const handleDateChange = (date) => {
    setInstallmentStart(date);
  };

  // Handle saving type change
  const handleSavingTypeChange = (e) => {
    setSavingType(e.target.value);
  };

  const handleTimeTypeChange = (y) => {
    setSavingTime(y.target.value);
    setInstallmentCount(getInstallmentCount(y.target.value)); // Update installment count based on saving time
  };

  // Get installment count based on saving Time
  const getInstallmentCount = (time) => {
    switch (time) {
      case "ThreeYear":
        return 36;
      case "FiveYear":
        return 60;
      case "TenYear":
        return 120;
      default:
        return 46; // Default installment count
    }
  };

  // Function to generate dates for Meyadi
  const generateMeyadiDates = (startDate, count) => {
    const dates = [];
    let currentMoment = moment(startDate, "DD-MM-YY");
    const targetDay = currentMoment.day(); // The day of the week to look for (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    for (let i = 0; i < count; i++) {
      // Move to the first day of the current month
      currentMoment.date(1);
      // Find the first occurrence of the target day in the current month
      while (currentMoment.day() !== targetDay) {
        currentMoment.add(1, "day");
      }
      // Add the date to the list
      dates.push(currentMoment.format("DD-MM-YY"));
      // Move to the next month
      currentMoment.add(1, "month");
    }

    return dates;
  };

  // Function to generate dates for NonMeyadi
  const generateNonMeyadiDate = (startDate, intervalYears) => {
    const currentMoment = moment(startDate, "DD-MM-YY");
    currentMoment.add(intervalYears, "years");
    return currentMoment.format("DD-MM-YY");
  };

  // Function to generate the next dates based on SavingType
  const generateNextDates = (startDate) => {
    if (SavingType === "NonMeyadi") {
      let intervalYears;
      switch (SavingTime) {
        case "ThreeYear":
          intervalYears = 3;
          break;
        case "FiveYear":
          intervalYears = 5;
          break;
        case "TenYear":
          intervalYears = 10;
          break;
        default:
          intervalYears = 1; // Default interval if needed
          break;
      }
      return [generateNonMeyadiDate(startDate, intervalYears)];
    } else if (SavingType === "Meyadi") {
      return generateMeyadiDates(startDate, installmentCount);
    } else {
      return []; // For General SavingType, no next dates are generated
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = moment(installmentStart).format("DD-MM-YY");
    const nextDates = generateNextDates(installmentStart);

    // Step 2: Retrieve user branch data and username from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    let submittedBy = "Unknown"; // Default to 'Unknown' if not found

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);

        // Extract the username from localStorage
        const userNames = Object.keys(parsedData)
          .filter((key) => key.startsWith("username"))
          .map((key) => parsedData[key]);

        // Use the first username if available
        if (userNames.length > 0) {
          submittedBy = userNames[0];
        }
      } catch (error) {
        console.error(
          "Error parsing userBranchData from localStorage:",
          error.message
        );
      }
    }

    // If the submittedBy is still 'Unknown', stop submission
    if (submittedBy === "Unknown") {
      setSubmitMessage("Error: Submitted by field is missing or invalid.");
      return;
    }

    try {
      // Log the values being sent to the server to verify submission
      console.log("Submitting form data:", {
        SavingID,
        memberID,
        SavingName: selectedMember?.memberName || "",
        fathername: selectedMember?.MfhName || "",
        SavingBranch: selectedMember?.BranchMember || "",
        SavingCenter: selectedMember?.CenterIDMember || "",
        SavingMobile: selectedMember?.MemberMobile || "",
        installmentStart: formattedDate,
        nextDates: nextDates,
        SavingAmount: SavingAmount,
        installment: installment,
        SavingType: SavingTypeTranslations[SavingType],
        SavingTime: SavingTimeTranslations[SavingTime],
        CenterDay: centerDay,
        approvalStatus: "Approved",
        ActiveStatus: "True",
        submittedBy: submittedBy, // Use the retrieved username from localStorage
        GrantedBy: "Null",
        DeletedStatus: "Null",
      });

      const response = await fetch("http://localhost:5000/opensaving", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SavingID: SavingID,
          memberID: memberID,
          SavingName: selectedMember?.memberName || "",
          fathername: selectedMember?.MfhName || "",
          SavingBranch: selectedMember?.BranchMember || "",
          SavingCenter: selectedMember?.CenterIDMember || "",
          SavingMobile: selectedMember?.MemberMobile || "",
          installmentStart: formattedDate,
          nextDates: nextDates,
          SavingAmount: SavingAmount,
          installment: installment,
          SavingType: SavingTypeTranslations[SavingType],
          SavingTime: SavingTimeTranslations[SavingTime],
          CenterDay: centerDay,
          approvalStatus: "Approved",
          ActiveStatus: "True",
          submittedBy: submittedBy, // Send the correct submittedBy value
          GrantedBy: "Null",
          DeletedStatus: "Null",
        }),
      });

      if (response.ok) {
        // Clear form and show success message
        setSavingCount(SavingCount + 1);
        setSelectedMember("");
        setInstallmentStart(null);
        setSavingAmount("");
        setSavingType("");
        setSavingTime("");
        setInstallment("");
        setMemberID("");
        setSubmitMessage(
          "সঠিক ভাবে সঞ্চয় আবেদন করা হয়েছে। শাখা ব্যাবস্থাপকের অনুমতির জন্য অপেক্ষা করুণ।"
        );
      } else {
        const errorData = await response.json();
        console.error("Unexpected response status:", response.status);
        console.error("Error data:", errorData);
        setSubmitMessage(
          `Error: Unexpected response status ${response.status} - ${
            errorData.error || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className=" p-2">
        <form onSubmit={handleSubmit}>
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
                  <i className="fas fa-money-bill-wave"></i> সঞ্চয় খুলুন
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

          <div className="mb-3 row">
            <div className="col-md-3">
              <label
                htmlFor="memberID"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-id-card"></i> সদস্য ID
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  type="text"
                  id="memberID"
                  className="form-control border-primary"
                  value={memberID}
                  onChange={handleMemberIDChange} // Handle Member ID change
                  placeholder="সদস্য ID লিখুন"
                ></input>
              </div>
              <small className="text-muted">উদাহরণ: B01M0001</small>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="SavingID"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-id-card"></i> সঞ্চয় সংখ্যা
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-id-card"></i>
                </span>
                <input
                  id="SavingID"
                  className="form-control border-primary"
                  type="text"
                  value={SavingID}
                  disabled
                />
              </div>
            </div>

            {selectedMember && (
              <div className="mt-3 row">
                <div className="col-md-3">
                  <label
                    htmlFor="SavingName"
                    className="form-label"
                    style={{ fontWeight: "bold", color: "#4A5568" }}
                  >
                    <i className="fas fa-user"></i> সদস্য নাম
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
                      id="SavingName"
                      className="form-control border-primary"
                      value={selectedMember.memberName}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor="fathername"
                    className="form-label"
                    style={{ fontWeight: "bold", color: "#4A5568" }}
                  >
                    <i className="fas fa-user-friends"></i> পিতা/স্বামী
                  </label>
                  <div className="input-group shadow-sm">
                    <span
                      className="input-group-text bg-primary text-white"
                      style={{
                        background: "linear-gradient(45deg, #007bff, #00d4ff)",
                        color: "#fff",
                      }}
                    >
                      <i className="fas fa-user-friends"></i>
                    </span>
                    <input
                      type="text"
                      id="fathername"
                      className="form-control border-primary"
                      value={selectedMember.MfhName}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor="SavingBranch"
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
                      id="SavingBranch"
                      className="form-select border-primary"
                      value={selectedMember.BranchMember}
                      readOnly
                    />
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
                    <input
                      type="text"
                      id="SavingCenter"
                      className="form-select border-primary"
                      value={selectedMember.CenterIDMember}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-3">
                  <label
                    htmlFor="SavingMobile"
                    className="col-form-label"
                    style={{ fontWeight: "bold", color: "#4A5568" }}
                  >
                    <i className="fas fa-mobile-alt"></i> মোবাইল
                  </label>
                  <div className="input-group shadow-sm">
                    <span
                      className="input-group-text bg-primary text-white"
                      style={{
                        background: "linear-gradient(45deg, #007bff, #00d4ff)",
                        color: "#fff",
                      }}
                    >
                      <i className="fas fa-mobile-alt"></i>
                    </span>
                    <input
                      type="number"
                      id="SavingMobile"
                      className="form-select border-primary"
                      value={selectedMember.MemberMobile}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row mt-5">
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

            {(SavingType === "Meyadi" || SavingType === "NonMeyadi") && (
              <div className="col-3">
                <label
                  htmlFor="SavingTime"
                  className="col-form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-money-bill-wave"></i> সময়
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
                  <select
                    id="SavingTime"
                    className="form-control border-primary"
                    onChange={handleTimeTypeChange}
                    value={SavingTime}
                  >
                    <option value="">বাছাই করুণ</option>
                    {Object.entries(SavingTimeTranslations).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}

            <div className="col-3">
              <label
                htmlFor="SavingAmount"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-money-bill-wave"></i> সঞ্চয়ের পরিমাণ
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
                  type="number"
                  id="SavingAmount"
                  className="form-control border-primary"
                  placeholder="Enter Amount"
                  value={SavingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-5">
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
                    id="CenterDay"
                    className="form-control border-primary"
                    value={centerDay}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="installmentStart"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-calendar-alt"></i> সঞ্চয় শুরু
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
                      id="installmentStart"
                      className="form-control border-primary"
                      selected={installmentStart}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              </div>
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
                className="alert alert-success mt-3 d-flex align-items-center"
                role="alert"
                style={{
                  borderRadius: "0.5rem", // Rounded corners
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: "1.5rem",
                    marginRight: "10px", // Space between icon and text
                    color: "#155724", // Dark green for the icon
                  }}
                ></i>
                <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpenSavings;
