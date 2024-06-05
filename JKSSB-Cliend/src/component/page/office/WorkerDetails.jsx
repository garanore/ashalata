// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkerDetails() {
  const [selectedBranch, setSelectedBranch] = useState("");

  const [workers, setWorkers] = useState([]);
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

    if (branch) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/worker-callback-branch/${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          setWorkers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching worker data:", error);
        });
    }
  };

  const handleView = (worker) => {
    navigate("/home/WorkerView", { state: { workerID: worker._id } });
  };

  const handleEdit = (worker) => {
    navigate("/home/WorkerEdit", { state: { workerID: worker._id } });
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">কর্মীর তালিকা</h2>
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
            {Array.isArray(branches) &&
              branches.length > 0 &&
              branches.map((branch) => (
                <option key={branch._id} value={branch.BranchName}>
                  {branch.BranchName}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        {selectedBranch && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>মোবাইল</th>
                <th>কেন্দ্র</th>
                <th>পদবি</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.workerID}>
                  <td>{worker.workerID}</td>
                  <td>{worker.WorkerName}</td>
                  <td>{worker.WorkerMobile}</td>
                  <td>{worker.WorkerCenterAdd}</td>
                  <td>{worker.Designation}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleView(worker)}
                    >
                      View
                    </button>{" "}
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEdit(worker)}
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

export default WorkerDetails;
