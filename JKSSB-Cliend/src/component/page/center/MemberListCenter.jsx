// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/center.css";

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

function MemberListCenter() {
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [members, setMembers] = useState([]);
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();
  const [userCenters, setuserCenters] = useState([]);
  const [username, setUsername] = useState(""); // Add username state
  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page

  useEffect(() => {
    // Fetch all active centers initially
    axios
      .get("http://localhost:5000/center-callback")
      .then((response) => {
        // Filter out centers with ActiveStatus "False"
        const activeCenters = response.data.filter(
          (center) => center.ActiveStatus !== "False"
        );

        // Store all active centers initially
        setCenters(activeCenters);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    // Function to fetch centers for branches
    const fetchCentersForBranches = async (branches) => {
      try {
        // Fetch centers for each branch
        const centerPromises = branches.map((branch) =>
          axios.get(`http://localhost:5000/center-callback-by-branch/${branch}`)
        );

        const centerResponses = await Promise.all(centerPromises);

        // Extract and merge center data from the responses
        const allCenters = centerResponses
          .map((response) => response.data)
          .flat(); // Flatten the array of arrays

        // Filter out inactive centers
        const activeCenters = allCenters.filter(
          (center) => center.ActiveStatus !== "False"
        );

        setCenters(activeCenters); // Set the merged active centers
      } catch (error) {
        console.error("Error fetching centers for branches:", error);
      }
    };

    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserCenter"))
        .map((key) => parsedData[key]);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const userDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];

      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username);
      setDesignation(userDesignation); // Set the designation in the state

      // First logic: check if the user has access to all branches
      if (branches.includes("AllBranch")) {
        setHasAccess(true); // Grant full access
      }
      // Second logic: check if the user has restricted designation
      else if (restrictedDesignations.includes(userDesignation)) {
        // Filter centers the user has access to based on UserCenter
        const userAccessibleCenters = centers;

        // Fetch only the centers the user has access to
        axios
          .get("http://localhost:5000/center-callback")
          .then((response) => {
            const activeCenters = response.data.filter(
              (center) =>
                center.ActiveStatus !== "False" &&
                userAccessibleCenters.includes(center.centerID)
            );
            setCenters(activeCenters); // Set the filtered centers
          })
          .catch((error) => {
            console.error("Error fetching center data:", error);
          });

        setuserCenters(userAccessibleCenters); // Store user's specific centers
        setHasAccess(false); // Restrict access to specific centers
      }
      // Third logic: check if the user has specific branches
      else if (branches.length > 0) {
        // Call the fetchCentersForBranches function only if branches exist
        fetchCentersForBranches(branches);
        setHasAccess(false); // Restrict access to specific centers
      }
      // If no specific access is granted
      else {
        setuserCenters(centers); // Store the user's specific centers
        setHasAccess(false); // Restrict access
      }
    }
  }, []);

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setSelectedCenter(center);

    if (center) {
      // Fetch members for the selected center
      axios
        .get(
          `http://localhost:5000/member-callback?selectedCenter=${encodeURIComponent(
            center
          )}`
        )
        .then((response) => {
          const centersData = response.data;

          if (deleteMode) {
            const inactiveCenters = centersData.filter(
              (center) => center.ActiveStatus === "False"
            );
            setMembers(inactiveCenters);
          } else {
            const activeCenters = centersData.filter(
              (center) => center.ActiveStatus !== "False"
            );
            setMembers(activeCenters);
            setCurrentPage(1); // Set the fetched members
          }
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });

      // Fetch worker name for the selected center
      axios
        .get(`http://localhost:5000/get-worker-name/${center}`)
        .then((response) => {
          const workerName = response.data.WorkerName;
          setSelectedWorker(workerName ? workerName : "No worker found");
        })
        .catch((error) => {
          console.error("Error fetching worker name:", error);
          setSelectedWorker("No worker found");
        });
    }
  };

  // For MemberListCenter
  const handleEditFromCenter = (member) => {
    navigate("/home/MemberEdit", {
      state: { memberID: member._id, from: "MemberListCenter" },
    });
  };

  const handleView = (member) => {
    navigate("/home/MemberAbout", {
      state: { memberID: member._id, from: "MemberListCenter" },
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
          handleCenterChange({ target: { value: selectedCenter } });
        })
        .catch((error) => {
          console.error("Error updating ActiveStatus:", error);
        });
    }
  };

  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    // Refetch the centers based on the new delete mode
    handleCenterChange({ target: { value: selectedCenter } });
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
              <i className="fas fa-users"></i> কেন্দ্রের সদস্য তালিকা
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
            htmlFor="CenterSelect"
            className="form-label"
            style={{ fontWeight: "bold", color: "#4A5568" }}
          >
            <i className="fas fa-map-marker-alt"></i> কেন্দ্র নির্বাচন করুণ
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
              id="CenterSelect"
              onChange={handleCenterChange}
              value={selectedCenter}
            >
              <option value="">--------</option>
              {hasAccess || !restrictedDesignations.includes(designation)
                ? centers.map((center) => (
                    <option key={center._id} value={center.centerID}>
                      {center.centerID}
                    </option>
                  ))
                : centers
                    .filter((center) => userCenters.includes(center.centerID))
                    .map((center) => (
                      <option key={center._id} value={center.centerID}>
                        {center.centerID}
                      </option>
                    ))}
            </select>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <label
            htmlFor="CenterWorker"
            className="form-label"
            style={{ fontWeight: "bold", color: "#4A5568" }}
          >
            <i className="fas fa-user-tie"></i> কেন্দ্র কর্মীর নাম
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
            <input
              type="text"
              className="form-control border-primary"
              id="CenterWorker"
              value={selectedWorker}
              readOnly
            />
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
              value={members.length} // Display the total number of members
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
        {selectedCenter && currentMembers.length > 0 && (
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>পিতা/স্বামী</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>
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
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleView(member)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditFromCenter(member)}
                    >
                      <i className="fas fa-edit"></i>
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
        {selectedCenter === "" && (
          <div className="alert alert-info text-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>{" "}
            {/* Font Awesome info icon */}
            Please select a center to view members.
          </div>
        )}
      </div>

      {/* Pagination */}
      {selectedCenter && (
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

export default MemberListCenter;
