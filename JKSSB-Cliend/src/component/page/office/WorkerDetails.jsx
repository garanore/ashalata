// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkerDetails() {
  const [selectedBranch, setSelectedBranch] = useState("");

  const [workers, setWorkers] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    // Step 1: Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Step 2: Retrieve user branch data and designation from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      // Check if the user has a restricted designation
      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      // Restrict access if the user has a restricted designation
      setHasAccess(!userHasRestrictedDesignation);
    }
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch) {
      axios
        .get(
          `http://localhost:5000/worker-callback-branch/${encodeURIComponent(
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

  const handleEdit = (worker) => {
    navigate("/home/WorkerEdit", {
      state: { workerID: worker._id, from: "WorkerDetails" },
    });
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">কর্মীর তালিকা</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

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

            {/* Step 3: Filter branches based on userBranches */}
            {userBranches.includes("AllBranch") ||
            userBranches.includes("AllCenter")
              ? branches.map((branch) => (
                  <option key={branch._id} value={branch.BranchName}>
                    {branch.BranchName}
                  </option>
                ))
              : branches
                  .filter((branch) => userBranches.includes(branch.BranchName))
                  .map((branch) => (
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
