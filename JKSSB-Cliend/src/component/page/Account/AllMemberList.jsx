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

  useEffect(() => {
    // Retrieve user branch data and username from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username);

      // Check if "AllBranch" exists in the branches
      const hasAllBranch = branches.includes("AllBranch");

      // Grant access only if the user has "AllBranch"
      setHasAccess(hasAllBranch);
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
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">সকল সদস্য তালিকা</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
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
    <div>
      <div className="bg-light container-fluid">
        <div>
          <h2 className="text-center mb-4 pt-3">সকল সদস্য তালিকা </h2>
        </div>
        <div className="col-md-3 mb-3  justify-content-end  mt-3">
          <label className="form-label">Show Deleted Center</label>
          <button
            type="button"
            className={`btn btn-lg btn-toggle ${deleteMode ? "active" : ""}`}
            onClick={handleToggleClick}
            aria-pressed={deleteMode}
          >
            <div className="handle"></div>
          </button>
        </div>
        <div className="mt-5 bg-light">
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
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

          <div className="row">
            <div className="col-md-12">
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className="page-link"
                    >
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
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className="page-link"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllMemberList;
