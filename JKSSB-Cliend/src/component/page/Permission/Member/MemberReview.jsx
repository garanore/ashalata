// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import "../Permission.css";
import "../../../css/center.css";

const MemberReview = () => {
  const [ReviewMembers, setReviewMembers] = useState([]);
  const [error, setError] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/memberdmission/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setReviewMembers(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  const cancelMember = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/memberdmission/cancel/${id}`
      );
      setReviewMembers(ReviewMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the member.");
    }
  };

  const EditMember = (member) => {
    navigate("/home/MemberEdit", { state: { memberID: member._id } });
  };

  const CheckedMember = async (id) => {
    try {
      // Assuming you want to update the member's approvalStatus to "Approved"
      const updatedMember = {
        approvalStatus: "Approved",
      };

      const response = await axios.put(
        `http://localhost:5000/member-callback/${id}`, // Use the correct API endpoint
        updatedMember
      );

      // Update the state with the new member data
      setReviewMembers((prevState) =>
        prevState.map((member) =>
          member._id === id ? response.data.updatedMember : member
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating member:", error.message);
      alert("Error updating the member.");
    }
  };

  // Pagination logic
  const indexOfLastMember = currentPage * centersPerPage;
  const indexOfFirstMember = indexOfLastMember - centersPerPage;
  const currentMembers = ReviewMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(ReviewMembers.length / centersPerPage);

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
              <i className="fas fa-pen"></i> সদস্য পুনঃনিরীক্ষণ
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

        {currentMembers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>সদস্য NID</th>
                  <th>অভিবাবক</th>
                  <th>শাখা</th>
                  <th>কেন্দ্র</th>
                  <th>ঠিকানা</th>
                  <th>নমিনী</th>
                  <th>ফোন</th>
                  <th>পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member, index) => (
                  <tr key={member._id || index}>
                    <td>{member.memberID}</td>
                    <td>{member.memberName}</td>
                    <td>{member.MemberNIDnumber}</td>
                    <td>{member.MfhName}</td>
                    <td>{member.BranchMember}</td>
                    <td>{member.CenterIDMember}</td>
                    <td>{member.memberVillage}</td>
                    <td>{member.NominiName}</td>
                    <td>{member.MemberMobile}</td>
                    <td>
                      <div className="button-container">
                        <button
                          className="btn btn-success me-2"
                          onClick={() => CheckedMember(member._id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          className="btn btn-success me-2"
                          onClick={() => EditMember(member)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => cancelMember(member._id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
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
            পুনঃনিরীক্ষণের জন্য কোন সদস্য নেই।
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

export default MemberReview;
