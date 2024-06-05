// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CenterList() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [, setSelectedCenter] = useState(null);
  const [centers, setCenters] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;

    setSelectedBranch(branch);
    setSelectedCenter(null);
    setCenters([]); // Clear centers state

    // Fetch worker data for the selected branch
    if (branch) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/center-callback?selectedBranch=${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          setCenters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching worker data:", error);
        });
    }
  };

  const handleEditClick = (center) => {
    navigate("/home/CenterEdit", { state: { centerID: center._id } });
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">কেন্দ্রের তালিকা</h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="branchSelect" className="form-label">
            শাঁখা নির্বাচন করুণ
          </label>
          <select
            className="form-select"
            id="branchSelect"
            onChange={handleBranchChange}
            value={selectedBranch}
          >
            <option value="">Choose...</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch.BranchName}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">মোট কেন্দ্র</label>
          <input
            type="text"
            className="form-control"
            value={centers.length}
            readOnly
          />
        </div>
      </div>

      <div className="table-responsive">
        {selectedBranch && centers.length > 0 && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>
                <th>কর্মী</th>
                <th>কেন্দ্র বার </th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center.centerID}>
                  <td>{center.centerID}</td>
                  <td>{center.CenterName}</td>
                  <td>{center.CenterMnumber}</td>
                  <td>{center.CenterAddress}</td>
                  <td>{center.centerWorker}</td>
                  <td>{center.CenterDay}</td>
                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEditClick(center)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CenterList;
