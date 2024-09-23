// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const GrantCenter = () => {
  const [pendingCenters, setPendingCenters] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [, setUserDesignations] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state

  useEffect(() => {
    const fetchPendingCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opencenter/grant"
        );
        setPendingCenters(response.data);
      } catch (error) {
        setError("Error fetching pending centers");
      }
    };

    fetchPendingCenters();

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

  const GrantedCenter = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/opencenter/grant/${id}`,
        { username } // Pass username to the backend
      );
      setPendingCenters(pendingCenters.filter((center) => center._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving center:", error.message);
    }
  };

  const cancelCenter = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/opencenter/cancel/${id}`
      );
      setPendingCenters(pendingCenters.filter((center) => center._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
    }
  };

  const reviewCenter = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/opencenter/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the center from the list after it's sent for review
      setPendingCenters(pendingCenters.filter((center) => center._id !== id));
      alert("Center sent back for correction");
    } catch (error) {
      console.error("Error reviewing center:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredCenters = userBranches.includes("AllBranch")
    ? pendingCenters
    : pendingCenters.filter((center) =>
        userBranches.some((branch) => branch === center.centerBranch)
      );

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Granted Centers</h2>
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
          <h2 className="text-center mb-4 pt-3">Granted Centers</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {filteredCenters.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Center ID</th>
                  <th>Center Name</th>
                  <th>Branch</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCenters.map((center) => (
                  <tr key={center._id}>
                    <td>{center.centerID}</td>
                    <td>{center.CenterName}</td>
                    <td>{center.centerBranch}</td>
                    <td>{center.CenterAddress}</td>
                    <td>{center.CenterMnumber}</td>
                    <td>{center.CenterDay}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => GrantedCenter(center._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => cancelCenter(center._id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => reviewCenter(center._id)}
                      >
                        <i className="fas fa-redo"></i> {/* Review Icon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No centers pending Granted</p>
        )}
      </div>
    </div>
  );
};

export default GrantCenter;
