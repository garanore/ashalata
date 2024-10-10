// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/designation";

function Designation() {
  const [DesignationCount, setDesignationCount] = useState(0);
  const [DesignationID, setDesignationID] = useState("");
  const [DesignationIDData, setDesignationIDData] = useState({
    DesignationName: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

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
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);
      const userBranches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      if (userBranches.includes("AllBranch")) {
        setHasAccess(true);
      }
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
      // Submit branch data
      await axios.post(API_URL, {
        DesignationID: DesignationID,
        ...DesignationIDData,
      });

      setSubmitMessage("Designation created successfully");

      // Reset form values
      setDesignationIDData({
        DesignationName: "",
      });

      // Increment branch count and update branch ID
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
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">পদবি যোগ করুণ</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-light">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">পদবি যোগ করুণ</h2>
          </div>
        </div>

        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="mb-3 col-3">
                <label htmlFor="DesignationID" className="form-label">
                  Designation ID:
                </label>
                <input
                  id="DesignationID"
                  className="form-control"
                  type="text"
                  value={DesignationID}
                  disabled
                />
              </div>
              <div className="mb-3 col-md-3 col-3">
                <label htmlFor="DesignationName" className="form-label">
                  পদবি
                </label>
                <input
                  id="DesignationName"
                  className="form-control"
                  type="text"
                  value={DesignationIDData.DesignationName}
                  name="DesignationName"
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

export default Designation;
