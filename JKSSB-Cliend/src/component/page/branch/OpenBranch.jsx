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

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);
      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";

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
    const paddedCount = (count + 1).toString().padStart(4, "0");
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
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">শাখা খুলুন</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="bg-light">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">শাখা খুলুন</h2>
          </div>
        </div>
        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="BranchID" className="form-label">
                  Branch ID:
                </label>
                <input
                  id="BranchID"
                  className="form-control"
                  type="text"
                  value={branchID}
                  disabled
                />
              </div>
              <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="BranchName" className="form-label">
                  শাখার নাম
                </label>
                <input
                  id="BranchName"
                  className="form-control"
                  type="text"
                  name="BranchName"
                  value={branchData.BranchName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="BranchAddress" className="form-label">
                  ঠিকানা
                </label>
                <input
                  id="BranchAddress"
                  className="form-control"
                  type="text"
                  name="BranchAddress"
                  value={branchData.BranchAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="BranchMobile" className="form-label">
                  Mobile:
                </label>
                <input
                  id="BranchMobile"
                  className="form-control"
                  type="number"
                  name="BranchMobile"
                  value={branchData.BranchMobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 mb-5 mt-5">
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
              {submitMessage && (
                <div className="alert alert-success" role="alert">
                  {submitMessage}
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
