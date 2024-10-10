// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../css/center.css";

const GrantUser = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [userDesignations, setUserDesignations] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const [loggedUsers, setLoggedUsers] = useState({});
  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/signup/grant");
        setPendingUsers(response.data);

        // Fetch the designations for each submittedBy
        response.data.forEach(async (member) => {
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
              //   console.error("Error fetching user designation:", error.message);
            }
          }
        });
      } catch (error) {
        setError("Error fetching pending centers");
      }
    };

    fetchPendingUsers();

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
        "নির্বাহী পরিচালক",
        "সহকারী নির্বাহী পরিচালক",
        "শাখা ব্যাবস্থাপক",
        "সহকারী শাখা ব্যাবস্থাপক",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess);
    }
  }, []);

  const GrantedUser = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/signup/grant/${id}`,
        { username } // Pass username to the backend
      );
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving User:", error.message);
    }
  };

  const cancelUser = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/signup/cancel/${id}`
      );
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling User:", error.message);
    }
  };

  const reviewUser = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/signup/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the User from the list after it's sent for review
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert("User sent back for correction");
    } catch (error) {
      console.error("Error reviewing User:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredUsers = userBranches.includes("AllBranch")
    ? pendingUsers.filter((User) => {
        // Special designations that should NOT be shown for AllBranch
        const specialDesignations = [
          "উর্দ্ধতন কর্মসূচী সংগঠক",
          "কর্মসূচী সংগঠক",
          "সহকারী কর্মসূচী সংগঠক",
        ];

        // Check if the User's designation is NOT a special designation
        const isNotSpecialDesignation = !specialDesignations.includes(
          User.designation
        );

        // For "AllBranch", return users only if they do NOT have special designations
        return isNotSpecialDesignation;
      })
    : pendingUsers.filter((User) => {
        const isBranchMatch = userBranches.some((branch) =>
          User.UserBranch.includes(branch)
        );

        // Special designations that managers can see
        const specialDesignations = [
          "উর্দ্ধতন কর্মসূচী সংগঠক",
          "কর্মসূচী সংগঠক",
          "সহকারী কর্মসূচী সংগঠক",
        ];

        // Manager designations
        const managerDesignations = [
          "শাখা ব্যাবস্থাপক",
          "সহকারী শাখা ব্যাবস্থাপক",
        ];

        // Check if the logged-in user is a manager
        const isManager = userDesignations.some((designation) =>
          managerDesignations.includes(designation)
        );

        if (isManager) {
          // Managers see only users with the special designations and matching branch
          return (
            isBranchMatch && specialDesignations.includes(User.designation)
          );
        }

        // Non-managers see users based on branch only
        return isBranchMatch;
      });

  // Pagination logic
  const indexOfLastUser = currentPage * centersPerPage;
  const indexOfFirstUser = indexOfLastUser - centersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / centersPerPage);

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
              User Granted
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
              <i className="fas fa-money-bill-wave"></i> User Granted
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

        {currentUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Designation</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Submit By</th>
                  <th>S. Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((User) => (
                  <tr key={User._id}>
                    <td>{User.accountName}</td>
                    <td>{User.username}</td>
                    <td>{User.email}</td>
                    <td>{User.phoneNumber}</td>
                    <td>{User.designation}</td>
                    <td>{User.UserBranch}</td>
                    <td>{User.UserCenter}</td>
                    <td>{User.submittedBy}</td>
                    <td>{loggedUsers[User.submittedBy]?.designation}</td>

                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => GrantedUser(User._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => cancelUser(User._id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => reviewUser(User._id)}
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
            অনুমতির জন্য কোন User নেই।
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

export default GrantUser;
