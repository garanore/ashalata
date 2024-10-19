// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import "../../../css/center.css";

const GrantSavings = () => {
  const [pendingSavings, setPendingSavings] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const navigate = useNavigate();

  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page

  useEffect(() => {
    const fetchPendingSavins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opensaving/granted"
        );
        setPendingSavings(response.data);
      } catch (error) {
        setError("Error fetching pending Savings");
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

      const usernames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = usernames[0] || "Unknown";
      setUsername(username);

      // Fetch accountName based on the username
      if (username !== "Unknown") {
        axios
          .get(`http://localhost:5000/get-user-username/${username}`)
          .then((response) => {
            if (response.data.length > 0) {
              setAccountName(response.data[0].accountName);
            } else {
              setAccountName("Unknown User");
            }
          })
          .catch(() => {
            setAccountName("Error fetching user");
          });
      }

      // Check if the user has one of the required designations
      const requiredDesignations = [
        "শাখা ব্যাবস্থাপক",
        "সহকারী শাখা ব্যাবস্থাপক",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess); // Set access state
    }
  }, []);

  const approveSaving = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/opensaving/granted/${id}`,
        { username } // Pass username to the backend
      );
      setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving center:", error.message);
      alert("Error approving the saving.");
    }
  };

  const cancelSaving = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/opensaving/cancel/${id}`
      );
      setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the saving.");
    }
  };

  const reviewSaving = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/opensaving/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the center from the list after it's sent for review
      setPendingSavings(pendingSavings.filter((saving) => saving._id !== id));
      alert("Center sent back for correction");
    } catch (error) {
      console.error("Error reviewing center:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const ViewSaving = (saving) => {
    navigate("/home/SavingAbout", {
      state: { SavingID: saving._id, from: "ApproveSavings" },
    });
  };

  // Filter logic based on userBranches
  const filteredSavings = userBranches.includes("AllBranch")
    ? pendingSavings
    : pendingSavings.filter((saving) =>
        userBranches.some((branch) => branch === saving.SavingBranch)
      );

  // Pagination logic
  const indexOfLastSaving = currentPage * centersPerPage;
  const indexOfFirstSaving = indexOfLastSaving - centersPerPage;
  const currentSavings = filteredSavings.slice(
    indexOfFirstSaving,
    indexOfLastSaving
  );
  const totalPages = Math.ceil(filteredSavings.length / centersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-4">
          <div className="border-bottom mb-4">
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#2D3748" }}
            >
              <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>{" "}
              সঞ্চয়ের অনুমতি
            </h2>
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#f8d7da",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              className="text-center mb-0"
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#721c24",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "1.5rem", marginRight: "10px" }}
              ></i>
              প্রিয়{" "}
              <span className="highlighted-username">
                {accountName || username}
              </span>
              , এই পেইজে আপনার অনুমতি নেই।
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <i className="fas fa-money-bill-wave"></i> সঞ্চয়ের অনুমতি
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
          <div className="table-responsive mt-5">
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
                  <th>আবেদনকারী</th>
                  <th>পদবী</th>
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
                    <td>{saving.SavingAmount}</td>
                    <td>{saving.SavingAmount}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => approveSaving(saving._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => ViewSaving(saving)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-warning  me-2"
                        onClick={() => reviewSaving(saving._id)}
                      >
                        <i className="fas fa-redo"></i>
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
            অনুমতির জন্য কোন সঞ্চয় নেই।
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

export default GrantSavings;
