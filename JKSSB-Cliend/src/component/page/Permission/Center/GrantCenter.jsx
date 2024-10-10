// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../css/center.css";

const GrantCenter = () => {
  const [pendingCenters, setPendingCenters] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [, setUserDesignations] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const [loggedUsers, setLoggedUsers] = useState({});
  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page

  useEffect(() => {
    const fetchPendingCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opencenter/grant"
        );
        setPendingCenters(response.data);

        const data = response.data;
        // Fetch the designations for each submittedBy
        data.forEach(async (member) => {
          const submittedBy = member.submittedBy;
          if (submittedBy) {
            try {
              const userResponse = await axios.get(
                `http://localhost:5000/get-user-username/${submittedBy}`
              );
              if (userResponse.data.length > 0) {
                const { accountName, designation } = userResponse.data[0];
                setLoggedUsers((prevDesignations) => ({
                  ...prevDesignations,
                  [submittedBy]: { accountName, designation },
                }));
              }
            } catch (error) {
              console.error("Error fetching user designation:", error.message);
            }
          }
        });
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

      const requiredDesignations = [
        "শাখা ব্যাবস্থাপক",
        "সহকারী শাখা ব্যাবস্থাপক",
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

  // Log filtered users
  console.log("Filtered Users:", filteredCenters);

  // Pagination logic
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenters = filteredCenters.slice(
    indexOfFirstCenter,
    indexOfLastCenter
  );
  const totalPages = Math.ceil(filteredCenters.length / centersPerPage);

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
              <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>
              কেন্দ্র অনুমতি
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
              <i className="fas fa-money-bill-wave"></i> কেন্দ্র অনুমতি
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

        {currentCenters.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>কেন্দ্র ID</th>
                  <th>কেন্দ্রের নাম</th>
                  <th>শাখা</th>
                  <th>ঠিকানা</th>
                  <th>ফোন</th>
                  <th>কেন্দ্র বার</th>
                  <th>আবেদনকারী</th>
                  <th>পদবী</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCenters.map((center) => (
                  <tr key={center._id}>
                    <td>{center.centerID}</td>
                    <td>{center.CenterName}</td>
                    <td>{center.centerBranch}</td>
                    <td>{center.CenterAddress}</td>
                    <td>{center.CenterMnumber}</td>
                    <td>{center.CenterDay}</td>
                    <td>
                      {/* Show the fetched accountName */}
                      {loggedUsers[center.submittedBy]
                        ? loggedUsers[center.submittedBy].accountName // Display accountName instead of username
                        : "Loading..."}
                    </td>
                    <td>
                      {/* Show the fetched designation */}
                      {loggedUsers[center.submittedBy]
                        ? loggedUsers[center.submittedBy].designation
                        : "Loading..."}
                    </td>
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
          <div className="alert alert-warning text-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>{" "}
            {/* Font Awesome warning icon */}
            অনুমতির জন্য কোন কেন্দ্র নেই।
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

export default GrantCenter;
