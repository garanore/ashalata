// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "https://ashalota.gandhipoka.com/opencenter";

function OpenCenter() {
  const [centerCount, setCenterCount] = useState(0);
  const [centerID, setCenterID] = useState("");
  const [workers, setWorkers] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [formData, setFormData] = useState({
    centerID: "",
    CenterName: "",
    CenterAddress: "",
    CenterMnumber: "",
    centerBranch: "",
    centerWorker: "",
    CenterDay: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch(
          "https://ashalota.gandhipoka.com/branch-callback"
        );
        const data = await response.json();

        setBranchs(data);
      } catch (error) {
        console.error("Error fetching branch options:", error.message);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch(
          "https://ashalota.gandhipoka.com/worker-callback"
        );
        const data = await response.json();

        setWorkers(data);
      } catch (error) {
        console.error("Error fetching worker options:", error.message);
      }
    };

    fetchCenters();
  }, []);

  // For Center ID-----------------------------------

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCenterCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setCenterCount(count);
      setCenterID(generateCenterID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  useEffect(() => {
    fetchCenterCount();
  }, [fetchCenterCount]);

  const generateCenterID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `C${paddedCount}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.CenterName.trim() ||
        !formData.CenterAddress.trim() ||
        (typeof formData.CenterMnumber === "string" &&
          !formData.CenterMnumber.trim())
      ) {
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, {
        centerID: formData.centerID, // Include centerID in the payload
        ...formData,
      });

      setSubmitMessage("Successfully submitted!");

      setCenterCount(centerCount + 1);
      setCenterID(generateCenterID());
      setFormData({
        centerID: "",
        CenterName: "",
        CenterAddress: "",
        CenterMnumber: "",
        centerBranch: "",
        centerdWorker: "",
        CenterDay: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="bg-light">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">কেন্দ্র খুলুন</h2>
          </div>
        </div>

        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="mb-3 col-3">
                <label htmlFor="centerID" className="form-label">
                  Center ID:
                </label>
                <input
                  id="centerID"
                  className="form-control"
                  type="text"
                  value={centerID}
                  disabled
                />
              </div>
              <div className="mb-3 col-md-3 col-3">
                <label htmlFor="CenterName" className="form-label">
                  কেন্দ্রের নাম
                </label>
                <input
                  id="CenterName"
                  className="form-control"
                  type="text"
                  value={formData.CenterName}
                  onChange={handleChange}
                  name="CenterName"
                />
              </div>

              <div className="mb-3 col-3 col-md-3">
                <label htmlFor="CenterAddress" className="form-label">
                  ঠিকানা
                </label>
                <input
                  id="CenterAddress"
                  className="form-control"
                  type="text"
                  value={formData.CenterAddress}
                  onChange={handleChange}
                  name="CenterAddress"
                />
              </div>

              <div className="mb-3 col-3 col-md-3">
                <label htmlFor="CenterMnumber" className="form-label">
                  মোবাইল:
                </label>
                <input
                  id="CenterMnumber"
                  className="form-control"
                  type="number"
                  value={formData.CenterMnumber}
                  onChange={handleChange}
                  name="CenterMnumber"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-4 col-md-4">
                <label htmlFor="centerBranch" className="form-label">
                  শাঁখা নির্বাচন করুণ
                </label>
                <select
                  id="centerBranch"
                  className="form-select"
                  value={formData.centerBranch}
                  onChange={handleChange}
                  name="centerBranch"
                >
                  <option value="">Choose...</option>
                  {branchs.map((branch) => (
                    <option key={branch._id} value={branch.BranchName}>
                      {branch.BranchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="centerWorker" className="form-label">
                      কর্মী নির্বাচন করুণ
                    </label>
                    <select
                      id="centerWorker"
                      className="form-select"
                      value={formData.centerWorker}
                      onChange={handleChange}
                      name="centerWorker"
                    >
                      <option value="">Choose...</option>
                      {workers.map((worker) => (
                        <option key={worker._id} value={worker.WorkerName}>
                          {worker.WorkerName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <label htmlFor="CenterDay" className="form-label">
                  কেন্দ্রের বার
                </label>
                <select
                  id="CenterDay"
                  name="CenterDay"
                  className="form-select"
                  value={formData.CenterDay}
                  onChange={handleChange}
                >
                  <option value="">Choose...</option>
                  <option>শনিবার</option>
                  <option>রবিবার </option>
                  <option>সোমবার </option>
                  <option>মঙ্গলবার</option>
                  <option>বুধবার</option>
                  <option>বৃহস্পতিবার </option>
                  <option>শুক্রবার</option>
                </select>
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

export default OpenCenter;
