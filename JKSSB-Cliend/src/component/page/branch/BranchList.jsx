// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

function BranchList() {
  const [branchData, setBranchData] = useState([]);
  const [centerCounts, setCenterCounts] = useState({});
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page

  useEffect(() => {
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);
      const userBranches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      if (userBranches.includes("AllBranch")) {
        setHasAccess(true);
      }
      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/branch-callback"
        );
        const branches = response.data;

        // Filter branches based on deleteMode (true = show inactive branches, false = show active branches)
        const filteredBranchData = branches.filter(
          (branch) => branch.ActiveStatus === (deleteMode ? "False" : "True")
        );

        setBranchData(filteredBranchData);

        // Fetch center counts for the filtered branches
        const counts = {};
        for (const branch of filteredBranchData) {
          try {
            const centerResponse = await axios.get(
              `http://localhost:5000/center-callback-by-branch/${branch.BranchName}`
            );
            counts[branch.BranchName] = centerResponse.data.length;
          } catch (error) {
            console.error(
              `Error fetching center count for branch ${branch.BranchName}:`,
              error.message
            );
          }
        }
        setCenterCounts(counts);
      } catch (error) {
        console.error("Error fetching branch data:", error.message);
      }
    };

    fetchBranchData();
  }, [deleteMode]); // Refetch branch data whenever deleteMode changes

  const handleDeleteClick = async (branch) => {
    if (window.confirm("Delete the selected Branch")) {
      const deleteDate = new Date().toISOString();

      try {
        await axios.put(
          `http://localhost:5000/openbranch/ActiveStatus/${branch._id}`,
          {
            username,
            deleteDate,
          }
        );

        const response = await axios.get(
          "http://localhost:5000/branch-callback"
        );
        const branches = response.data;
        setBranchData(branches);

        const counts = {};
        for (const branch of branches) {
          try {
            const centerResponse = await axios.get(
              `http://localhost:5000/center-callback-by-branch/${branch.BranchName}`
            );
            counts[branch.BranchName] = centerResponse.data.length;
          } catch (error) {
            console.error(
              `Error fetching center count for branch ${branch.BranchName}:`,
              error.message
            );
          }
        }
        setCenterCounts(counts);
      } catch (error) {
        console.error("Error updating ActiveStatus:", error.message);
      }
    }
  };

  const handleEditClick = (branch) => {
    navigate("/home/BranchEditModal", { state: { BranchID: branch._id } });
  };

  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">শাঁখার তালিকা</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  // // Filter branch data based on deleteMode (true = show inactive branches, false = show active branches)
  // const filteredBranchData = branchData.filter(
  //   (branch) => branch.ActiveStatus === (deleteMode ? "False" : "True")
  // );

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = branchData.slice(
    indexOfFirstMember,
    indexOfLastMember
  );
  const totalPages = Math.ceil(branchData.length / membersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div>
        <h2 className="text-center border-bottom mb-4 pt-3">শাঁখার তালিকা </h2>
        <div className="col-md-3 mb-3 justify-content-end mt-3">
          <label className="form-label">Show Deleted Branches</label>
          <button
            type="button"
            className={`btn btn-lg btn-toggle ${deleteMode ? "active" : ""}`}
            onClick={handleToggleClick}
            aria-pressed={deleteMode}
          >
            <div className="handle"></div>
          </button>
        </div>
      </div>

      <div className="mt-5 bg-light">
        <table className="table table-bordered table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>নাম</th>
              <th>ঠিকানা</th>
              <th>মোবাইল</th>
              <th>ম্যানেজার</th>
              <th>কেন্দ্র সংখ্যা</th>
              <th>পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((branch) => (
              <tr key={branch.BranchID}>
                <td>{branch.BranchID}</td>
                <td>{branch.BranchName}</td>
                <td>{branch.BranchAddress}</td>
                <td>{branch.BranchMobile}</td>
                <td>{branch.selectedManager}</td>
                <td>{centerCounts[branch.BranchName] || 0}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEditClick(branch)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(branch)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  <button onClick={() => paginate(i + 1)} className="page-link">
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
  );
}

export default BranchList;
