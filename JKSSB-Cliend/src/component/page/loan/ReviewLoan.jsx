// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const ReviewLoan = () => {
  const [ReviewLoans, setReviewLoans] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/openloan/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setReviewLoans(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  const cancelLoans = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/openloan/cancel/${id}`
      );
      setReviewLoans(ReviewLoans.filter((Loan) => Loan._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the Loans.");
    }
  };

  const EditLoans = (Loans) => {
    navigate("/home/SavingEdit", { state: { loanID: Loans._id } });
  };

  const CheckedLoans = async (id) => {
    try {
      const updatedLoans = { approvalStatus: "Pending" }; // or 'Approved' depending on your logic

      const response = await axios.put(
        `http://localhost:5000/loan-callback/${id}`,
        updatedLoans
      );

      setReviewLoans((prevState) =>
        prevState.map((Loan) =>
          Loan._id === id ? { ...Loan, approvalStatus: "Pending" } : Loan
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating Loans:", error.message);
      alert("Error updating the Loans.");
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Loans Review</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {ReviewLoans.length > 0 ? (
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
                {ReviewLoans.map((Loan, index) => (
                  <tr key={Loan._id || index}>
                    <td>{Loan.loanID}</td>
                    <td>{Loan.memberID}</td>
                    <td>{Loan.OLname}</td>
                    <td>{Loan.OLmobile}</td>
                    <td>{Loan.OLbranch}</td>
                    <td>{Loan.OLcenter}</td>
                    <td>{Loan.loanType}</td>
                    <td>{Loan.OLamount}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => CheckedLoans(Loan._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => EditLoans(Loan)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => cancelLoans(Loan._id)}
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
          <p className="text-center">No Loans for Review </p>
        )}
      </div>
    </div>
  );
};

export default ReviewLoan;
