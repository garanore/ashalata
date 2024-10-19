// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/center.css";

function AllMemberList() {
  const [MemberData, setMemberData] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const [deleteMode, setDeleteMode] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page
  const navigate = useNavigate();
  const [, setUserBranches] = useState([]);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    // Retrieve user branch data and username from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

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

      // Check if "AllBranch" exists in the branches
      if (branches.includes("AllBranch")) {
        setHasAccess(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/member-callback"
        );
        const members = response.data;

        // Filter Member based on deleteMode (true = show inactive Member, false = show active branches)
        const filteredBMember = members.filter(
          (member) => member.ActiveStatus === (deleteMode ? "False" : "True")
        );

        setMemberData(filteredBMember);
      } catch (error) {
        console.error("Error fetching member data:", error.message);
      }
    };

    fetchMemberData();
  }, [deleteMode]);

  const handleView = (member) => {
    navigate("/home/MemberAbout", {
      state: { memberID: member._id, from: "AllMemberList" },
    });
  };

  // For AllMemberList
  const handleEditAllMemberList = (member) => {
    navigate("/home/MemberEdit", {
      state: { memberID: member._id, from: "AllMemberList" },
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
        })
        .catch((error) => {
          console.error("Error updating ActiveStatus:", error);
        });
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
              সকল সদস্য তালিকা
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
  };
  // Filter branch data based on deleteMode (true = show inactive branches, false = show active branches)
  // const filteredBMember = MemberData.filter(
  //   (branch) => branch.ActiveStatus === (deleteMode ? "False" : "True")
  // );

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = MemberData.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(MemberData.length / membersPerPage);

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
              <i className="fas fa-users"></i> সকল সদস্য তালিকা
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

      <div className="mt-5 table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>নাম</th>
              <th>শাখা</th>
              <th>কেন্দ্র</th>
              <th>মোবাইল</th>
              <th>পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((Member) => (
              <tr key={Member._id}>
                <td>{Member.memberID}</td>
                <td>{Member.memberName}</td>
                <td>{Member.BranchMember}</td>
                <td>{Member.CenterIDMember}</td>
                <td>{Member.MemberMobile}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEditAllMemberList(Member)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleView(Member)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm "
                    onClick={() => handleDeleteClick(Member)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination controls */}

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
      </div>
    </div>
  );
}

export default AllMemberList;
