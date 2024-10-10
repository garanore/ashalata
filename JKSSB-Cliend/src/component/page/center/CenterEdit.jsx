// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const MEMBER_LIST_CENTER_ROUTE = "/home/CenterList";
import axios from "axios";

function CenterEdit() {
  const location = useLocation();
  const centerID = location.state ? location.state.centerID : null;
  const navigate = useNavigate();
  const [allCenter, setAllCenter] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    fetchCenterDetails();
  });

  const fetchCenterDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/center-callback/${centerID}`
      );
      setAllCenter(response.data);
    } catch (error) {
      console.error("Error fetching center details:", error.message);
    }
  };

  useEffect(() => {
    if (allCenter.CenterDay) {
      setSelectedDay(allCenter.CenterDay);
    }
  }, [allCenter.CenterDay]);

  const handleUpdateCenter = (e) => {
    e.preventDefault();
    const form = e.target;
    const ID = form.ID.value;
    const CenterName = form.CenterName.value;
    const CenterAddress = form.CenterAddress.value;
    const CenterMnumber = form.CenterMnumber.value;
    const CenterDay = form.CenterDay.value;

    setSubmitMessage("Successfully Updated!");
    const updatedData = {
      ID,
      CenterName,
      CenterAddress,
      CenterMnumber,
      CenterDay,
    };

    fetch(`http://localhost:5000/center-callback/${centerID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Center Updated Successfully");
        } else {
          console.error("Center Update Failed");
        }
      });
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateCenter}>
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
                <i className="fas fa-pen"></i> কেন্দ্র সম্পাদনা
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
              htmlFor="memberID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> কেন্দ্র ID
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
                name="ID"
                className="form-control border-primary"
                defaultValue={allCenter.centerID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <label
              htmlFor="CenterName"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-store"></i> কেন্দ্রের নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-store"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="CenterName"
                defaultValue={allCenter.CenterName}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="CenterAddress"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-home"></i> ঠিকানা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-home"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="CenterAddress"
                defaultValue={allCenter.CenterAddress}
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="MemberMobile"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-mobile-alt"></i> মোবাইল:
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
                className="form-control border-primary"
                type="text"
                name="CenterMnumber"
                defaultValue={allCenter.CenterMnumber}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="CenterDay"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-calendar-day"></i> কেন্দ্রের বার
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-calendar-day"></i>
              </span>
              <select
                id="CenterDay"
                name="CenterDay"
                className="form-select border-primary"
                value={selectedDay} // Use value to bind to state
                onChange={handleDayChange} // Update state when changed
              >
                <option value="">Choose...</option>
                <option value="শনিবার">শনিবার</option>
                <option value="রবিবার">রবিবার</option>
                <option value="সোমবার">সোমবার</option>
                <option value="মঙ্গলবার">মঙ্গলবার</option>
                <option value="বুধবার">বুধবার</option>
                <option value="বৃহস্পতিবার">বৃহস্পতিবার</option>
                <option value="শুক্রবার">শুক্রবার</option>
              </select>
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
}
export default CenterEdit;
