// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const GrantLoan = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingSavins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/openloan/grant"
        );
        setPendingLoans(response.data);
      } catch (error) {
        setError("Error fetching pending Loans");
      }
    };

    fetchPendingSavins();

    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      // Retrieve branches (if needed for further logic)
      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      // Retrieve designations from user data
      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state

      // Check if the user has one of the required designations
      const requiredDesignations = [
        "নির্বাহী পরিচালক ",
        "সহকারী নির্বাহী পরিচালক ",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess); // Set access state
    }
  }, []);

  const approveLoans = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/openloan/grant/${id}`,
        { username } // Pass username to the backend
      );
      setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving center:", error.message);
      alert("Error approving the Loans.");
    }
  };

  const cancelLoans = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/openloan/cancel/${id}`
      );
      setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the Loans.");
    }
  };

  const reviewLoans = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/openloan/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the center from the list after it's sent for review
      setPendingLoans(pendingLoans.filter((Loans) => Loans._id !== id));
      alert("Center sent back for correction");
    } catch (error) {
      console.error("Error reviewing center:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const ViewLoans = (Loans) => {
    navigate("/home/SavingAbout", {
      state: { loanID: Loans._id, from: "ApproveLoans" },
    });
  };

  // Filter logic based on userBranches
  const filteredLoans = userBranches.includes("AllBranch")
    ? pendingLoans
    : pendingLoans.filter((Loans) =>
        userBranches.some((branch) => branch === Loans.OLbranch)
      );

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Granted Loans</h2>
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
          <h2 className="text-center mb-4 pt-3">Granted Loans</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {filteredLoans.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Member ID</th>
                  <th>Member Name</th>
                  <th>Mobile</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan, index) => (
                  <tr key={loan._id || index}>
                    <td>{loan.loanID}</td>
                    <td>{loan.memberID}</td>
                    <td>{loan.OLname}</td>
                    <td>{loan.OLmobile}</td>
                    <td>{loan.OLbranch}</td>
                    <td>{loan.OLcenter}</td>
                    <td>{loan.loanType}</td>
                    <td>{loan.OLamount}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => approveLoans(loan._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => ViewLoans(loan)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-warning  me-2"
                        onClick={() => reviewLoans(loan._id)}
                      >
                        <i className="fas fa-redo"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => cancelLoans(loan._id)}
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
          <p className="text-center">No loans Granted approval</p>
        )}
      </div>
    </div>
  );
};

export default GrantLoan;
