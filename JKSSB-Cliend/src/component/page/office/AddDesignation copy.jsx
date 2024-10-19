// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/designation";

function Designation() {
  const [DesignationCount, setDesignationCount] = useState(0);
  const [DesignationID, setDesignationID] = useState("");
  const [DesignationIDData, setDesignationIDData] = useState({
    DesignationName: "",
    submittedBy: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [, setUserBranches] = useState([]);
  const [username, setUsername] = useState("");
  const [accountName, setAccountName] = useState("");

  //For Generate ID---------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDesignationCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setDesignationCount(count);
      setDesignationID(generatesetDesignationhID(count));
    } catch (error) {
      console.error("Error fetching designation count:", error.message);
      setSubmitMessage("Error fetching designation count");
    }
  };

  useEffect(() => {
    // Retrieve user branch data from localStorage
    const storedBranchData = localStorage.getItem("userBranchData");
    if (storedBranchData) {
      const parsedData = JSON.parse(storedBranchData);
      const Branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(Branches);

      if (Branches.includes("AllBranch")) {
        setHasAccess(true);
      }

      const usernames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = usernames[0] || "Unknown";
      setUsername(username);

      // Fetch accountName based on the username
      if (username !== "Unknown") {
        axios
          .get(`http://localhost:5000/get-user-username/${username}`)
          .then((response) => {
            if (response.data.length > 0) {
              setAccountName(response.data[0].accountName);
            } else {
              setAccountName("Unknown User");
            }
          })
          .catch(() => {
            setAccountName("Error fetching user");
          });
      }
      // Store the username in the formData to use it later in handleSubmit
      setDesignationIDData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
      }));
    }
  }, []);

  useEffect(() => {
    fetchDesignationCount();
  }, [fetchDesignationCount]);

  const generatesetDesignationhID = (count) => {
    const paddedCount = (count + 1).toString().padStart(2, "0");
    return `D${paddedCount}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignationIDData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Ensure the submittedBy field is set before submitting
      if (!DesignationIDData.submittedBy) {
        setDesignationIDData((prevData) => ({
          ...prevData,
          submittedBy: username, // Use username from localStorage
        }));
      }

      // Submit designation data
      await axios.post(API_URL, {
        DesignationID: DesignationID,
        ActiveStatus: "True", // Ensure it's set correctly
        submittedBy: DesignationIDData.submittedBy || username, // Fallback to username if submittedBy is not set
        ...DesignationIDData,
      });

      setSubmitMessage("Designation created successfully");

      // Reset form values
      setDesignationIDData({
        DesignationName: "",
        submittedBy: username, // Make sure this field is reset correctly
      });

      // Increment count and update DesignationID
      setDesignationCount((prevCount) => prevCount + 1);
      setDesignationID(generatesetDesignationhID(DesignationCount + 1));
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage("Error creating Designation");
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-4">
          <div className="border-bottom mb-4">
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#2D3748" }}
            >
              <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>{" "}
              পদবি যোগ করুণ
            </h2>
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#f8d7da",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              className="text-center mb-0"
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#721c24",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "1.5rem", marginRight: "10px" }}
              ></i>
              প্রিয়{" "}
              <span className="highlighted-username">
                {accountName || username}
              </span>
              , এই পেইজে আপনার অনুমতি নেই।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-light">
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
                <i className="fas fa-user-tag"></i> পদবি যোগ করুণ
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

        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="col-md-3">
                <label
                  htmlFor="DesignationID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> Designation ID:
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
                    id="DesignationID"
                    className="form-control border-primary"
                    type="text"
                    value={DesignationID}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="BranchName"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-code-branch"></i> পদবী
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
                    id="DesignationName"
                    className="form-control border-primary"
                    type="text"
                    value={DesignationIDData.DesignationName}
                    name="DesignationName"
                    placeholder="পদবী লিখুন"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-12 mb-5 mt-5">
              <div className="d-flex justify-content-center mb-3">
                <button
                  type="button"
                  className="btn btn-primary btn-lg shadow"
                  onClick={handleSubmit}
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
    </div>
  );
}

export default Designation;
