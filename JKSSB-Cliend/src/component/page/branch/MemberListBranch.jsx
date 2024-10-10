// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

function MemberListBranch() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [username, setUsername] = useState(""); // Add username state
  const [deleteMode, setDeleteMode] = useState(false);
  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page

  useEffect(() => {
    // Step 1: Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Step 2: Retrieve user branch data and designation from localStorage
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

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch) {
      axios
        .get(
          `http://localhost:5000/member-callback-by-branch/${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          const centersData = response.data;
          if (deleteMode) {
            // Show only centers with ActiveStatus "False"
            const activeCenters = centersData.filter(
              (center) => center.ActiveStatus === "False"
            );
            setMembers(activeCenters);
          } else {
            // Show centers with ActiveStatus not "False"
            const inactiveCenters = centersData.filter(
              (center) => center.ActiveStatus !== "False"
            );

            setMembers(inactiveCenters);
          }
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    }
  };

  // For MemberListBranch
  const handleEditFromBranch = (member) => {
    navigate("/home/MemberEdit", {
      state: { memberID: member._id, from: "MemberListBranch" },
    });
  };

  const handleView = (member) => {
    navigate("/home/MemberAbout", {
      state: { memberID: member._id, from: "MemberListBranch" },
    });
  };

  const handleDeleteClick = (center) => {
    if (window.confirm("Delete the selected Center")) {
      const deleteDate = new Date().toISOString(); // Get the current date

      axios
        .put(
          `http://localhost:5000/memberdmission/ActiveStatus/${center._id}`,
          {
            username, // Pass username to the backend
            deleteDate, // Pass the current date to the backend
          }
        )
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // After updating, refetch the centers for the selected branch
          handleBranchChange({ target: { value: selectedBranch } });
        })
        .catch((error) => {
          console.error("Error updating ActiveStatus:", error);
        });
    }
  };

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(members.length / membersPerPage);

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
              <i
                className="fas fa-code-branch"
                style={{ marginRight: "10px" }}
              ></i>
              শাখার সদস্য তালিকা
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

  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    // Refetch the centers based on the new delete mode
    handleBranchChange({ target: { value: selectedBranch } });
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
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
              <i className="fas fa-code-branch"></i> শাখার সদস্য তালিকা
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

      <div className="row">
        <div className="col-md-3">
          <label
            htmlFor="branchSelect"
            className="form-label"
            style={{ fontWeight: "bold", color: "#4A5568" }}
          >
            <i className="fas fa-map-marker-alt"></i> শাখা নির্বাচন করুণ
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-primary text-white"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-map-marker-alt"></i>
            </span>
            <select
              className="form-select border-primary"
              id="branchSelect"
              onChange={handleBranchChange}
              value={selectedBranch}
            >
              <option value="">Choose...</option>
              {/* Step 3: Filter branches based on userBranches */}
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

        <div className="col-md-3 mb-3">
          <label
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            <i className="fas fa-users"></i> মোট সদস্য
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
              value={members.length || 0}
              readOnly
            />
          </div>
        </div>

        <div className="col-md-3 mb-3 d-flex align-items-end">
          <label
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            {" "}
            Show Deleted Member
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

      <div className="table-responsive">
        {selectedBranch && currentMembers.length > 0 && (
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>পিতা/স্বামী</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>
                <th>কেন্দ্র</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((member) => (
                <tr key={member.memberID}>
                  <td>{member.memberID}</td>
                  <td>{member.memberName}</td>
                  <td>{member.MfhName}</td>
                  <td>{member.MemberMobile}</td>
                  <td>{member.memberVillage}</td>
                  <td>{member.CenterIDMember}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditFromBranch(member)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleView(member)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(member)}
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
        {selectedBranch === "" && (
          <div className="alert alert-info text-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>{" "}
            {/* Font Awesome info icon */}
            Please select a center to view members.
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
}

export default MemberListBranch;
