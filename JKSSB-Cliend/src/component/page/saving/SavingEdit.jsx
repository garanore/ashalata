// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

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

// Reverse the translation mappings to find keys by value
const reverseSavingTypeTranslations = Object.fromEntries(
  Object.entries(SavingTypeTranslations).map(([key, value]) => [value, key])
);

const reverseSavingTimeTranslations = Object.fromEntries(
  Object.entries(SavingTimeTranslations).map(([key, value]) => [value, key])
);

const SavingEdit = () => {
  const location = useLocation();
  const SavingID = location.state ? location.state.SavingID : null;
  const navigate = useNavigate();
  const [installmentStart, setInstallmentStart] = useState(null);
  const [SavingType, setSavingType] = useState("");
  const [SavingTime, setSavingTime] = useState("");
  const [SavingEdit, setSavingEdit] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [installmentCount, setInstallmentCount] = useState(46);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-saving-savingid/${SavingID}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const SavingData = data[0];

          // Parse the 'installmentStart' using moment with 'MM-DD-YYYY' format
          let formattedInstallmentStart = null;
          if (SavingData.installmentStart) {
            const momentDate = moment(SavingData.installmentStart, "DD-MM-YY"); // Update this format to "DD-MM-YY"

            // Check if the date is valid and log it
            if (momentDate.isValid()) {
              formattedInstallmentStart = momentDate.toDate();
            } else {
              console.log("Invalid date format for installmentStart");
            }
          }

          // Set the state with reverse lookup and date formatting
          setSavingEdit({
            ...SavingData,
            installmentStart: formattedInstallmentStart,
          });

          // Set installmentStart separately for the DatePicker
          setInstallmentStart(formattedInstallmentStart); // Set this only if valid

          setSavingType(reverseSavingTypeTranslations[SavingData.SavingType]);
          setSavingTime(reverseSavingTimeTranslations[SavingData.SavingTime]);
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (SavingID) {
      fetchLoanData();
    }
  }, [SavingID]);

  // Inside the return statement, check the value prop of the select element

  const handleDateChange = (date) => {
    setInstallmentStart(date);
    setSavingEdit({ ...SavingEdit, installmentStart: date });
  };

  const handleSavingTypeChange = (e) => {
    const selectedSavingType = e.target.value;
    setSavingType(selectedSavingType);
    setSavingEdit({ ...SavingEdit, SavingType: selectedSavingType });
  };

  const handleTimeTypeChange = (e) => {
    const selectedSavingTime = e.target.value;
    setSavingTime(selectedSavingTime);
    setSavingEdit({ ...SavingEdit, SavingTime: selectedSavingTime });
    setInstallmentCount(getInstallmentCount(e.target.value)); // change `y` to `e`
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

    // Ensure the format is explicit
    let currentMoment = moment(startDate, "DD-MM-YY");

    const targetDay = currentMoment.day(); // The day of the week to look for (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    for (let i = 0; i < count; i++) {
      // Move to the first day of the current month
      currentMoment.date(1);

      // Find the first occurrence of the target day in the current month
      while (currentMoment.day() !== targetDay) {
        currentMoment.add(1, "day");
      }

      // Add the date to the list with explicit formatting
      dates.push(currentMoment.format("YYYY-MM-DD")); // Use ISO format here
      currentMoment.add(1, "month"); // Move to the next month
    }

    return dates;
  };

  // Function to generate dates for NonMeyadi
  const generateNonMeyadiDate = (startDate, intervalYears) => {
    const currentMoment = moment(startDate, "DD-MM-YY");
    currentMoment.add(intervalYears, "years");
    return currentMoment.format("YYYY-MM-DD"); // Use ISO format here
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

  const handleUpdateSaving = (e) => {
    e.preventDefault();

    // Collect data from form inputs
    const form = e.target;
    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData);

    const formattedDate = moment(installmentStart).format("DD-MM-YY");
    const nextDates = generateNextDates(installmentStart);

    // Add controlled select values manually from React state
    updatedData.SavingType = SavingTypeTranslations[SavingType]; // Ensure `SavingType` comes from state
    updatedData.SavingTime = SavingTimeTranslations[SavingTime]; // Ensure `SavingTime` comes from state
    updatedData.SavingTime = SavingTimeTranslations[SavingTime]; // Ensure `SavingTime` comes from state
    updatedData.formattedDate = formattedDate; // Ensure `SavingTime` comes from state
    updatedData.nextDates = nextDates; // Ensure `SavingTime` comes from state

    // Use the correct `_id` from SavingEdit or state
    const id = SavingEdit._id; // Use MongoDB ObjectId for the API endpoint

    // Validate _id length
    if (!id || id.length !== 24) {
      console.error("Invalid _id:", id);
      setSubmitMessage("Error: Invalid _id");
      return;
    }

    // Send the update request to the API
    fetch(`http://localhost:5000/saving-callback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavingEdit(data.updatedSaving);
          setSubmitMessage("Successfully Updated!");
        } else {
          console.error("Saving Update Failed");
        }
      })
      .catch((error) => {
        console.error("Error updating saving:", error);
      });
  };

  const handleCancel = () => {
    const previousPage = location.state?.from || "SavingDetails";

    const SavingID = location.state?.SavingID || "";

    if (previousPage === "SavingDetails") {
      navigate("/home/SavingDetails", { state: { SavingID }, replace: true });
    } else if (previousPage === "SavingsDetailsForBranch") {
      navigate("/home/SavingsDetailsFroBranch", {
        state: { SavingID },
        replace: true,
      });
    } else if (previousPage === "ReviewSaving") {
      navigate("/home/ReviewSaving", {
        state: { SavingID },
        replace: true,
      });
    } else {
      navigate("/home/SavingDetails", { state: { SavingID }, replace: true });
    }
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateSaving}>
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
                <i className="fas fa-money-bill-wave"></i> সঞ্চয় সম্পাদনা
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

        <div className="row  g-4  mt-5">
          <div className="col-md-3">
            <label
              htmlFor="SavingID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> সঞ্চয় ID
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
                name="SavingID"
                className="form-control border-primary"
                defaultValue={SavingEdit.SavingID}
                readOnly
              />
            </div>
          </div>

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
                className="form-control border-primary"
                type="text"
                id="memberID"
                name="memberID"
                defaultValue={SavingEdit.memberID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="SavingName"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-use"></i> সদস্য নাম
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
                id="SavingName"
                className="form-control border-primary"
                type="text"
                name="SavingName"
                defaultValue={SavingEdit.SavingName}
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
                id="fathername"
                className="form-control border-primary"
                type="text"
                name="fathername"
                defaultValue={SavingEdit.fathername}
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
                id="SavingBranch"
                className="form-select border-primary"
                type="text"
                name="SavingCenter"
                defaultValue={SavingEdit.SavingBranch}
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
                id="SavingCenter"
                className="form-select border-primary"
                type="text"
                name="SavingCenter"
                defaultValue={SavingEdit.SavingCenter}
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
                id="SavingMobile"
                className="form-select border-primary"
                type="number"
                name="SavingMobile"
                defaultValue={SavingEdit.SavingMobile}
                readOnly
              />
            </div>
          </div>

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
                value={SavingType}
                onChange={handleSavingTypeChange}
              >
                <option value="">Choose...</option>
                {Object.entries(SavingTypeTranslations).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
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
                id="SavingAmount"
                className="form-control border-primary"
                type="text"
                name="SavingAmount"
                defaultValue={SavingEdit.SavingAmount}
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
                id="CenterDay"
                className="form-control border-primary"
                type="text"
                name="installment"
                defaultValue={SavingEdit.CenterDay}
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
                  selected={installmentStart} // Ensure this is the correct value from state
                  onChange={handleDateChange}
                  dateFormat="MM/dd/yyyy" // Adjust format if needed
                  placeholderText="Select date"
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-5">
            {/* Update Button (Danger) with Right Icon */}
            <button
              type="submit"
              className="btn btn-danger btn-md position-relative"
              style={{
                background: "linear-gradient(45deg, #dc3545, #ff6347)", // Red gradient for danger
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333"; // Darker red on hover
                e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545"; // Reset to original color
                e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
              }}
            >
              <i className="fas fa-check" style={{ marginLeft: "5px" }}></i>{" "}
              Update
              {/* Right icon */}
            </button>

            {/* Cancel Button (Fully Green) */}
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-success btn-md position-relative"
              style={{
                backgroundColor: "#28a745", // Solid green
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#218838"; // Darker green on hover
                e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#28a745"; // Reset to original green color
                e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
              }}
            >
              <i className="fas fa-times" style={{ marginRight: "5px" }}></i>
              Cancel
            </button>
          </div>
          <div>
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
        </div>
      </form>
    </div>
  );
};

export default SavingEdit;
