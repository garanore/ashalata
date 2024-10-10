// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/openbranch";

function OpenBranch() {
  const [branchCount, setBranchCount] = useState(0);
  const [branchID, setBranchID] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [branchData, setBranchData] = useState({
    BranchName: "",
    BranchAddress: "",
    selectedManager: "",
    BranchMobile: "",
    submittedBy: "", // Make sure this is part of the form state
    GrantedBy: "Null", // Ensure it's set correctly
    DeletedBy: "Null", // Ensure it's set correctly
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [accountName, setAccountName] = useState(""); // Add accountName state
  const [username, setUsername] = useState(""); // Add username state

  const fetchBranchCount = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setBranchCount(count);
      setBranchID(generateBranchID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  }, []);

  useEffect(() => {
    // Retrieve user branch data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);
      const userBranches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

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

      if (userBranches.includes("AllBranch")) {
        setHasAccess(true);
      }
      // Store the username in the formData to use it later in handleSubmit
      setBranchData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
      }));
    }
  }, []);

  useEffect(() => {
    fetchBranchCount();
  }, [fetchBranchCount]);

  const generateBranchID = (count) => {
    const paddedCount = (count + 1).toString().padStart(2, "0");
    return `B${paddedCount}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async () => {
    try {
      const trimmedBranchData = {
        BranchName: branchData.BranchName.trim(),
        BranchAddress: branchData.BranchAddress.trim(),
        selectedManager: branchData.selectedManager.trim(),
        BranchMobile: branchData.BranchMobile.trim(),
        ActiveStatus: "True", // Ensure it's set correctly
        submittedBy: branchData.submittedBy,
      };

      await axios.post(API_URL, {
        BranchID: branchID,
        ...trimmedBranchData,
      });

      setSubmitMessage("Branch created successfully");

      setBranchData({
        BranchName: "",
        BranchAddress: "",
        selectedManager: "",
        BranchMobile: "",
        submittedBy: "", // Reset this as well
        DeletedBy: "Null", // Ensure it's set correctly
      });

      setBranchCount((prevCount) => prevCount + 1);
      setBranchID(generateBranchID(branchCount + 1));
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage("Error creating branch");
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
              <i className="fas fa-users" style={{ marginRight: "10px" }}></i>
              User List
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
    <div className="container-fluid">
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
                <i className="fas fa-code-branch"></i> শাখা খুলুন
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
                  htmlFor="BranchID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> Branch ID:
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
                    id="BranchID"
                    className="form-control border-primary"
                    type="text"
                    value={branchID}
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
                  <i className="fas fa-code-branch"></i> শাখার নাম
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
                    id="BranchName"
                    className="form-control border-primary"
                    type="text"
                    name="BranchName"
                    value={branchData.BranchName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="BranchAddress"
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
                    id="BranchAddress"
                    className="form-control border-primary"
                    type="text"
                    name="BranchAddress"
                    value={branchData.BranchAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="BranchMobile"
                  className="col-form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-mobile-alt"></i> Mobile:
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
                    id="BranchMobile"
                    className="form-control border-primary"
                    type="number"
                    name="BranchMobile"
                    value={branchData.BranchMobile}
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

export default OpenBranch;
