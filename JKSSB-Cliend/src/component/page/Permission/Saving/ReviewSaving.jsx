// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import "../../../css/center.css";

const ReviewSaving = () => {
  const [ReviewSavings, setReviewSavings] = useState([]);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page
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
    navigate("/home/SavingEdit", {
      state: { SavingID: Saving.SavingID, from: "ReviewSaving" },
    });
  };

  const CheckedSaving = async (id) => {
    try {
      // Assuming you want to update the Saving's approvalStatus to "Approved"
      const updatedSaving = {
        approvalStatus: "Approved",
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

  // Pagination logic
  const indexOfLastSaving = currentPage * centersPerPage;
  const indexOfFirstSaving = indexOfLastSaving - centersPerPage;
  const currentSavings = ReviewSavings.slice(
    indexOfFirstSaving,
    indexOfLastSaving
  );
  const totalPages = Math.ceil(ReviewSavings.length / centersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-4">
        <div className="col">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#f0f4f8", // Soft background for the header
              borderRadius: "10px", // Rounded edges for a modern look
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
            }}
          >
            <h2
              className="text-center mb-0"
              style={{
                fontWeight: "bold",
                color: "#2D3748",
                fontSize: "2rem", // Larger text for prominence
              }}
            >
              <i className="fas fa-money-bill-wave"></i> সঞ্চয় পুনঃনিরীক্ষণ
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #2D3748", // Thicker line for emphasis
              marginTop: "10px",
            }}
          />
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {currentSavings.length > 0 ? (
          <div className="table-responsive  mt-5">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>সঞ্চয় ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>ফোন</th>
                  <th>শাখা</th>
                  <th>কেন্দ্র</th>
                  <th>সঞ্চয়ের ধরণ</th>
                  <th>সময়</th>
                  <th>পরিমাণ</th>
                  <th>পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody>
                {currentSavings.map((saving, index) => (
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
          <div className="alert alert-warning text-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>{" "}
            {/* Font Awesome warning icon */}
            পুনঃনিরীক্ষণের জন্য কোন সঞ্চয় নেই।
          </div>
        )}
      </div>
      <div className="row justify-content-center my-3">
        <div className="col-md-12">
          <nav>
            <ul className="pagination pagination-rounded">
              <li className="page-item">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
                  disabled={currentPage === 1} // Disable if on the first page
                  title="Previous Page"
                >
                  <i className="fas fa-chevron-left"></i>{" "}
                  {/* Left arrow icon */}
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(i + 1)}
                    className="page-link"
                    title={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className={`page-link ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  disabled={currentPage === totalPages} // Disable if on the last page
                  title="Next Page"
                >
                  Next
                  <i className="fas fa-chevron-right"></i>{" "}
                  {/* Right arrow icon */}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ReviewSaving;
