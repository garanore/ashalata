// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://ashalota.gandhipoka.com/designation";
// const Managers = ["আব্দুল ছাত্তার", "সুমন সরকার", "আকলিমা বেগম "];

function Designation() {
  const [DesignationCount, setDesignationCount] = useState(0);
  const [DesignationID, setDesignationID] = useState("");
  const [DesignationIDData, setDesignationIDData] = useState({
    DesignationName: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

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

      setSubmitMessage("Branch created successfully");

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

              {/* <div className="mb-3 col-3 col-md-3">
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
              </div> */}

              {/* <div className="mb-3 col-3 col-md-3">
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
              </div> */}
            </div>

            {/* <div className="row">
              <div className="mb-3 col-4 col-md-4">
                <label htmlFor="selectedManager" className="form-label">
                  ম্যনেজার নির্বাচন করুণ
                </label>
                <select
                  id="selectedManager"
                  className="form-select"
                  name="selectedManager"
                  value={branchData.selectedManager}
                  onChange={handleChange}
                >
                  <option value="">Choose...</option>
                  {Managers.map((manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

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
