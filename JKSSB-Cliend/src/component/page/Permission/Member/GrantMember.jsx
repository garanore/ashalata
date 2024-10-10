// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react"; // React import removed
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../Permission.css";
import { useNavigate } from "react-router-dom";

const GrantMember = () => {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const navigate = useNavigate();
  const [loggedUsers, setLoggedUsers] = useState({});

  const [accountName, setAccountName] = useState(""); // Add accountName state
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const centersPerPage = 25; // Centers per page

  useEffect(() => {
    const fetchPendingCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/memberdmission/granted"
        );
        setPendingMembers(response.data);

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
      setPendingMembers(designations);

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

  const GrantedMember = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/memberdmission/granted/${id}`,
        { username } // Pass username to the backend
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving center:", error.message);
      alert("Error approving the member.");
    }
  };

  const cancelMember = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/memberdmission/cancel/${id}`
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the member.");
    }
  };

  const reviewMember = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/memberdmission/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the center from the list after it's sent for review
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert("Center sent back for correction");
    } catch (error) {
      console.error("Error reviewing center:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Filter logic based on userBranches
  const filteredMembers = userBranches.includes("AllBranch")
    ? pendingMembers
    : pendingMembers.filter((member) =>
        userBranches.some((branch) => branch === member.BranchMember)
      );

  const ViewMember = (member) => {
    navigate("/home/MemberAbout", { state: { memberID: member._id } });
  };

  // Pagination logic
  const indexOfLastMember = currentPage * centersPerPage;
  const indexOfFirstMember = indexOfLastMember - centersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(filteredMembers.length / centersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Only users with "AllBranch" access can view this page
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
              সদস্য অনুমতি
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
              <i className="fas fa-users"></i> সদস্য অনুমতি
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
                  <th>আবেদনকারী</th>
                  <th>পদবী</th>
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
                      {/* Show the fetched accountName */}
                      {loggedUsers[member.submittedBy]
                        ? loggedUsers[member.submittedBy].accountName // Display accountName instead of username
                        : "Loading..."}
                    </td>
                    <td>
                      {/* Show the fetched designation */}
                      {loggedUsers[member.submittedBy]
                        ? loggedUsers[member.submittedBy].designation
                        : "Loading..."}
                    </td>

                    <td>
                      <div className="button-container">
                        <button
                          className="btn btn-success me-2"
                          onClick={() => GrantedMember(member._id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          className="btn btn-success me-2"
                          onClick={() => ViewMember(member)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => reviewMember(member._id)}
                        >
                          <i className="fas fa-redo"></i>
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
            অনুমতির জন্য কোন সদস্য নেই।
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

export default GrantMember;
