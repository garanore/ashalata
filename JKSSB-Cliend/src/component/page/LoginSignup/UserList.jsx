// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

const UserList = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [, setSelectedCenter] = useState(null);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [username, setUsername] = useState(""); // Add username state
  const [deleteMode, setDeleteMode] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [designations, setDesignations] = useState([]); // State for designations
  const [selectedDesignation, setSelectedDesignation] = useState(""); // State for selected designation
  const [userDesignations, setUserDesignations] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [accountName, setAccountName] = useState(""); // Add accountName state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchResponse, designationResponse] = await Promise.all([
          axios.get("http://localhost:5000/branch-callback"),
          axios.get("http://localhost:5000/designation-callback"),
        ]);

        setBranches(branchResponse.data);
        setDesignations(designationResponse.data);

        const storedUserBranchData = localStorage.getItem("userBranchData");
        if (storedUserBranchData) {
          const parsedData = JSON.parse(storedUserBranchData);

          // Extract user branches
          const userBranches = Object.keys(parsedData)
            .filter((key) => key.startsWith("UserBranch"))
            .map((key) => parsedData[key]);

          setUserBranches(userBranches);

          // Extract designations
          const designations = Object.keys(parsedData)
            .filter((key) => key.startsWith("designation"))
            .map((key) => parsedData[key]);

          setUserDesignations(designations);

          // List of forbidden designations
          const forbiddenDesignations = [
            "কর্মসূচী সংগঠক",
            "সহকারী কর্মসূচী সংগঠক",
            "উর্দ্ধতন কর্মসূচী সংগঠক",
          ];

          // Check if the user has any of the forbidden designations
          const hasForbiddenDesignation = designations.some((designation) =>
            forbiddenDesignations.includes(designation)
          );

          // Set access permission: deny access only if the user has any forbidden designation
          if (!hasForbiddenDesignation) {
            setHasAccess(true);
          }

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
        }
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    setSelectedCenter(null);
    setUsers([]); // Clear users state
    fetchUsers({ branch, designation: selectedDesignation });
  };

  const handleDesignationChange = (e) => {
    const designation = e.target.value;
    setSelectedDesignation(designation);
    setUsers([]); // Clear users state
    fetchUsers({ branch: selectedBranch, designation });
  };

  const fetchUsers = ({ branch, designation }) => {
    let apiUrl = "";

    if (branch && designation) {
      apiUrl = `http://localhost:5000/get-user-branch-designation?branch=${encodeURIComponent(
        branch
      )}&designation=${encodeURIComponent(designation)}`;
    } else if (branch) {
      apiUrl = `http://localhost:5000/get-user-UserBranch/${encodeURIComponent(
        branch
      )}`;
    } else if (designation) {
      apiUrl = `http://localhost:5000/get-user-designation/${encodeURIComponent(
        designation
      )}`;
    }

    if (apiUrl) {
      axios
        .get(apiUrl)
        .then((response) => {
          let userData = response.data;
          if (deleteMode) {
            userData = userData.filter((user) => user.ActiveStatus === "False");
          } else {
            userData = userData.filter((user) => user.ActiveStatus !== "False");
          }
          setUsers(userData);
        })
        .catch(() => {});
    }
  };

  const handleEditClick = (user) => {
    navigate("/home/CenterEdit", { state: { centerID: user._id } });
  };

  const handleDeleteClick = (user) => {
    if (window.confirm("Delete the selected Center")) {
      const deleteDate = new Date().toISOString(); // Get the current date

      axios
        .put(`http://localhost:5000/signup/ActiveStatus/${user._id}`, {
          username, // Pass username to the backend
          deleteDate, // Pass the current date to the backend
        })
        .then(() => {
          fetchUsers({
            branch: selectedBranch,
            designation: selectedDesignation,
          });
        })
        .catch(() => {});
    }
  };

  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    fetchUsers({
      branch: selectedBranch,
      designation: selectedDesignation,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Pagination logic
  const indexOfLastUser = currentPage * centersPerPage;
  const indexOfFirstUser = indexOfLastUser - centersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / centersPerPage);

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
              <i className="fas fa-users" style={{ marginRight: "10px" }}></i>
              User List
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
    <div className="bg-light container-fluid p-4">
      {/* Header */}
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
              <i className="fas fa-users"></i> User List
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

      {/* Form Controls Row */}

      <div className="row mb-4">
        {/* Branch Select Dropdown */}
        <div className="col-md-3 mb-3">
          <label
            htmlFor="branchSelect"
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            <i className="fas fa-code-branch"></i> শাঁখা নির্বাচন করুণ
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-primary text-white"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-code-branch"></i>
            </span>
            <select
              className="form-select border-primary"
              id="branchSelect"
              onChange={handleBranchChange}
              value={selectedBranch}
              style={{
                borderRadius: "0 5px 5px 0",
                padding: "10px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <option value="">--------</option>
              {userBranches.includes("AllBranch") ||
              userBranches.includes("AllCenter")
                ? branches.map((branch) => (
                    <option key={branch._id} value={branch.BranchName}>
                      {branch.BranchName}
                    </option>
                  ))
                : branches
                    .filter((branch) =>
                      userBranches.includes(branch.BranchName)
                    )
                    .map((branch) => (
                      <option key={branch._id} value={branch.BranchName}>
                        {branch.BranchName}
                      </option>
                    ))}
            </select>
          </div>
        </div>

        {/* Designation Dropdown */}
        {!(
          userDesignations.includes("শাখা ব্যাবস্থাপক") ||
          userDesignations.includes("সহকারী শাখা ব্যাবস্থাপক")
        ) && (
          <div className="col-md-3 mb-3">
            <label
              htmlFor="Designation"
              className="form-label"
              style={{
                fontWeight: "bold",
                color: "#2D3748",
                fontSize: "0.95rem",
              }}
            >
              <i className="fas fa-user-tie"></i> পদবি
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-tie"></i>
              </span>
              <select
                id="Designation"
                name="Designation"
                className="form-select border-primary"
                value={selectedDesignation}
                onChange={handleDesignationChange}
                style={{
                  borderRadius: "0 5px 5px 0",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <option value="">--------</option>
                {designations.map((designation) => (
                  <option
                    key={designation.DesignationID}
                    value={designation.DesignationName}
                  >
                    {designation.DesignationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Total User Display */}
        <div className="col-md-3 mb-3">
          <label
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            <i className="fas fa-users"></i> Total User
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-primary text-white"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-users"></i>
            </span>
            <input
              type="text"
              className="form-control border-primary"
              value={users.length}
              readOnly
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "0 5px 5px 0",
              }}
            />
          </div>
        </div>

        {/* Show Deleted User Toggle */}
        <div className="col-md-3 mb-3 d-flex align-items-end">
          <label
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            Show Deleted User
          </label>
          <button
            type="button"
            className={`btn btn-lg btn-toggle ${deleteMode ? "active" : ""}`}
            onClick={handleToggleClick}
            aria-pressed={deleteMode}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              borderRadius: "20px",
              backgroundColor: deleteMode ? "#48BB78" : "#E53E3E",
              color: "#fff",
            }}
          >
            <div className="handle"></div>
          </button>
        </div>
      </div>
      {/* User Table */}
      <div className="table-responsive">
        {currentUsers.length > 0 && (
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>User Name</th>
                <th>নাম</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Branch</th>
                <th>Center</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.accountName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.designation}</td>
                  <td>{user.UserBranch}</td>
                  <td>{user.UserCenter}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Messages for No Data */}
        {users.length === 0 &&
          selectedBranch === "" &&
          selectedDesignation === "" && (
            <div className="alert alert-info text-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>{" "}
              {/* Font Awesome info icon */}
              Please select a branch or designation to view users.
            </div>
          )}

        {users.length === 0 &&
          (selectedBranch !== "" || selectedDesignation !== "") && (
            <div className="alert alert-warning text-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>{" "}
              {/* Font Awesome warning icon */}
              No users found for the selected criteria.
            </div>
          )}
      </div>
      {selectedBranch && (
        <div className="row justify-content-center my-3">
          <div className="col-md-12">
            <nav>
              <ul className="pagination pagination-rounded">
                <li className="page-item">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`page-link ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
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
      )}
    </div>
  );
};

export default UserList;
