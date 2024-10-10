// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const ReviewWorker = () => {
  const [ReviewWorkers, setReviewWorkers] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/workeradmission/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setReviewWorkers(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  const cancelMember = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/workeradmission/cancel/${id}`
      );
      setReviewWorkers(ReviewWorkers.filter((worker) => worker._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the member.");
    }
  };

  const EditMember = (worker) => {
    navigate("/home/MemberEdit", { state: { memberID: worker._id } });
  };

  const CheckedMember = async (id) => {
    try {
      // Assuming you want to update the worker's approvalStatus to "Approved"
      const updatedWorker = {
        approvalStatus: "Approved",
      };

      const response = await axios.put(
        `http://localhost:5000/worker-callback/${id}`, // Use the correct API endpoint
        updatedWorker
      );

      // Update the state with the new worker data
      setReviewWorkers((prevState) =>
        prevState.map((worker) =>
          worker._id === id ? response.data.updatedWorker : worker
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating worker:", error.message);
      alert("Error updating the worker.");
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">worker Review</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {ReviewWorkers.length > 0 ? (
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
                {ReviewWorkers.map((worker, index) => (
                  <tr key={worker._id || index}>
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
                        onClick={() => CheckedMember(worker._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => EditMember(worker)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => cancelMember(worker._id)}
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
          <p className="text-center">No Members Approved approval</p>
        )}
      </div>
    </div>
  );
};

export default ReviewWorker;
