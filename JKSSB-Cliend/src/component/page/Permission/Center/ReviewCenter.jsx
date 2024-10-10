// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../css/center.css";

const ReviewCenter = () => {
  const [centersNeedingCorrection, setCentersNeedingCorrection] = useState([]);
  const [editableCenterId, setEditableCenterId] = useState(null); // Track which row is editable
  const [error, setError] = useState("");
  const [editedCenter, setEditedCenter] = useState({
    CenterName: "",
    centerBranch: "",
    CenterAddress: "",
    CenterMnumber: "",
    centerWorker: "",
    CenterDay: "",
  });

  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page
  const [username, setUsername] = useState(""); // Add username state

  useEffect(() => {
    // Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Retrieve user branch data and designation from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const userBranchList = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(userBranchList);

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

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      // Check if the user has a restricted designation
      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      // Restrict access if the user has a restricted designation
      setHasAccess(!userHasRestrictedDesignation);
    }
  }, []);

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opencenter/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setCentersNeedingCorrection(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  // Handle field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedCenter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Set editable center
  const setEditableCenter = (center) => {
    setEditableCenterId(center._id);
    setEditedCenter({
      CenterName: center.CenterName,
      centerBranch: center.centerBranch,
      CenterAddress: center.CenterAddress,
      CenterMnumber: center.CenterMnumber,
      centerWorker: center.centerWorker,
      CenterDay: center.CenterDay,
    });
  };

  const saveCenterChanges = async (id) => {
    try {
      // Include the updated approvalStatus in the edited data
      const updatedCenter = {
        ...editedCenter,
        approvalStatus: "Approved",
      };

      const response = await axios.put(
        `http://localhost:5000/center-callback/${id}`, // Use the correct API endpoint
        updatedCenter
      );

      // Update the state with the new center data
      setCentersNeedingCorrection((prevState) =>
        prevState.map((center) =>
          center._id === id ? response.data.updatedCenter : center
        )
      );
      setEditableCenterId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating center:", error.message);
    }
  };

  // Pagination logic
  const indexOfLastCenter = currentPage * centersPerPage;
  const indexOfFirstCenter = indexOfLastCenter - centersPerPage;
  const currentCenter = centersNeedingCorrection.slice(
    indexOfFirstCenter,
    indexOfLastCenter
  );
  const totalPages = Math.ceil(
    centersNeedingCorrection.length / centersPerPage
  );

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
              কেন্দ্র পুনঃনিরীক্ষণ
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
              <i className="fas fa-map-marker-alt"></i> কেন্দ্র পুনঃনিরীক্ষণ
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

        {currentCenter.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>কেন্দ্র ID</th>
                  <th>কেন্দ্র নাম</th>
                  <th>শাখা</th>
                  <th>ঠিকানা</th>
                  <th>ফোন</th>
                  <th>কেন্দ্র বার</th>
                  <th>পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody>
                {currentCenter.map((center) => (
                  <tr key={center._id} className="align-middle">
                    <td>{center.centerID}</td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterName"
                          value={editedCenter.CenterName}
                          onChange={handleFieldChange}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="fw-bold">{center.CenterName}</span>
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <select
                          id="centerBranch"
                          className="form-select form-select-sm"
                          name="centerBranch"
                          value={editedCenter.centerBranch}
                          onChange={handleFieldChange}
                        >
                          <option value="">Choose...</option>
                          {userBranches.includes("AllBranch") ||
                          userBranches.includes("AllCenter")
                            ? branches.map((branch) => (
                                <option
                                  key={branch._id}
                                  value={branch.BranchName}
                                >
                                  {branch.BranchName}
                                </option>
                              ))
                            : branches
                                .filter((branch) =>
                                  userBranches.includes(branch.BranchName)
                                )
                                .map((branch) => (
                                  <option
                                    key={branch._id}
                                    value={branch.BranchName}
                                  >
                                    {branch.BranchName}
                                  </option>
                                ))}
                        </select>
                      ) : (
                        <span>{center.centerBranch}</span>
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterAddress"
                          value={editedCenter.CenterAddress}
                          onChange={handleFieldChange}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span>{center.CenterAddress}</span>
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterMnumber"
                          value={editedCenter.CenterMnumber}
                          onChange={handleFieldChange}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span>{center.CenterMnumber}</span>
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <select
                          id="CenterDay"
                          name="CenterDay"
                          className="form-select form-select-sm"
                          value={editedCenter.CenterDay}
                          onChange={handleFieldChange}
                        >
                          <option value="">Choose...</option>
                          <option value="শনিবার">শনিবার</option>
                          <option value="রবিবার">রবিবার</option>
                          <option value="সোমবার">সোমবার</option>
                          <option value="মঙ্গলবার">মঙ্গলবার</option>
                          <option value="বুধবার">বুধবার</option>
                          <option value="বৃহস্পতিবার">বৃহস্পতিবার</option>
                          <option value="শুক্রবার">শুক্রবার</option>
                        </select>
                      ) : (
                        <span>{center.CenterDay}</span>
                      )}
                    </td>
                    <td className="text-center">
                      {editableCenterId === center._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => saveCenterChanges(center._id)}
                          >
                            <i className="fas fa-check"></i> Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditableCenterId(null)}
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => setEditableCenter(center)}
                          >
                            <i className="fas fa-pen"></i> Edit
                          </button>
                        </>
                      )}
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
            পুনঃনিরীক্ষণের জন্য কোন কেন্দ্র নেই
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

export default ReviewCenter;
