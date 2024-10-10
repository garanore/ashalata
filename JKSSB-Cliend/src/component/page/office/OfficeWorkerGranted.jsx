// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const OfficeWorkerGranted = () => {
  const [PendingWorkers, setPendingWorkers] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [, setUserDesignations] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchPendingWorkers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/workeradmission/grant"
        );
        setPendingWorkers(response.data);
      } catch (error) {
        setError("Error fetching pending worker");
      }
    };

    fetchPendingWorkers();

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
      setUserDesignations(designations);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state

      const requiredDesignations = [
        "নির্বাহী পরিচালক ",
        "সহকারী নির্বাহী পরিচালক ",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess);
    }
  }, []);

  const ReviewWorker = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/workeradmission/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the worker from the list after it's sent for review
      setPendingWorkers(PendingWorkers.filter((worker) => worker._id !== id));
      alert("worker sent back for correction");
    } catch (error) {
      console.error("Error reviewing worker:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const approveWorker = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/workeradmission/grant/${id}`,
        { username } // Pass username to the backend
      );
      setPendingWorkers(PendingWorkers.filter((worker) => worker._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving worker:", error.message);
    }
  };

  const cancelWorker = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/workeradmission/cancel/${id}`
      );
      setPendingWorkers(PendingWorkers.filter((worker) => worker._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling worker:", error.message);
    }
  };

  const viewWorker = (worker) => {
    navigate("/home/WorkerEdit", {
      state: { workerID: worker._id, from: "OfficeWorkerGranted" },
    });
  };

  // Filter logic based on userBranches
  const filteredWorkers = userBranches.includes("AllBranch")
    ? PendingWorkers // Show all worker if user has access to "AllBranch"
    : PendingWorkers.filter((worker) =>
        userBranches.some((branch) => branch === worker.WorkerBranchAdd)
      ); // Show worker matching any of the user's branches

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Granted Office Worker</h2>
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
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Granted Office Worker</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {filteredWorkers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Worker ID</th>
                  <th>Worker Name</th>
                  <th>NID</th>
                  <th>Father Name</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>Education</th>
                  <th>Marital</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker) => (
                  <tr key={worker._id}>
                    <td>{worker.workerID}</td>
                    <td>{worker.WorkerName}</td>
                    <td>{worker.WorkerNID}</td>
                    <td>{worker.WorkerParent}</td>
                    <td>{worker.WorkerBranchAdd}</td>
                    <td>{worker.WorkerCenterAdd}</td>
                    <td>{worker.WorkerUnion}</td>
                    <td>{worker.WorkerMobile}</td>
                    <td>{worker.WorkerStudy}</td>
                    <td>{worker.WorkerMarital}</td>
                    <td>{worker.Designation}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => approveWorker(worker._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>

                      <button
                        className="btn btn-info  me-2"
                        onClick={() => viewWorker(worker)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => ReviewWorker(worker._id)}
                      >
                        <i className="fas fa-redo"></i>
                      </button>
                      <button
                        className="btn btn-danger  me-2"
                        onClick={() => cancelWorker(worker._id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No Workers pending approval</p>
        )}
      </div>
    </div>
  );
};

export default OfficeWorkerGranted;
