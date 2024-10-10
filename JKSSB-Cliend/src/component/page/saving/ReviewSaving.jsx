// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const ReviewSaving = () => {
  const [ReviewSavings, setReviewSavings] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opensaving/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setReviewSavings(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  const cancelSaving = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/opensaving/cancel/${id}`
      );
      setReviewSavings(ReviewSavings.filter((Saving) => Saving._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the Saving.");
    }
  };

  const EditSaving = (Saving) => {
    navigate("/home/SavingEdit", { state: { SavingID: Saving._id } });
  };

  const CheckedSaving = async (id) => {
    try {
      // Assuming you want to update the Saving's approvalStatus to "Approved"
      const updatedSaving = {
        approvalStatus: "Pending",
      };

      const response = await axios.put(
        `http://localhost:5000/saving-callback/${id}`, // Use the correct API endpoint
        updatedSaving
      );

      // Update the state with the new Saving data
      setReviewSavings((prevState) =>
        prevState.map((Saving) =>
          Saving._id === id ? response.data.updatedSaving : Saving
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating Saving:", error.message);
      alert("Error updating the Saving.");
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Saving Review</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {ReviewSavings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Saving ID</th>
                  <th>Member ID</th>
                  <th>Member Name</th>
                  <th>Mobile</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Saving Type</th>
                  <th>Saving Time</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ReviewSavings.map((saving, index) => (
                  <tr key={saving._id || index}>
                    <td>{saving.SavingID}</td>
                    <td>{saving.memberID}</td>
                    <td>{saving.SavingName}</td>
                    <td>{saving.SavingMobile}</td>
                    <td>{saving.SavingBranch}</td>
                    <td>{saving.SavingCenter}</td>
                    <td>{saving.SavingType}</td>
                    <td>{saving.SavingTime}</td>
                    <td>{saving.SavingAmount}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => CheckedSaving(saving._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => EditSaving(saving)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => cancelSaving(saving._id)}
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
          <p className="text-center">No Savings pending approval</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSaving;
