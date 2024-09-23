// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoanDetailsForBranch() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loans, setLoans] = useState({});
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);

  const [username, setUsername] = useState(""); // Add username state
  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false

  const [deleteMode, setDeleteMode] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page

  const [members, setMembers] = useState([]);

  // const restrictedDesignations = [
  //   "উর্দ্ধতন কর্মসূচী সংগঠক",
  //   "কর্মসূচী সংগঠক",
  //   "সহকারী কর্মসূচী সংগঠক",
  // ];

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

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state

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

  const fetchInstallmentDateCount = async (loanID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/installment-dates-count/${loanID}`
      );
      return response.data[0]?.installmentDateCount || 0;
    } catch (error) {
      console.error("Error fetching installment date count:", error);
      return 0;
    }
  };

  const handleBranchChange = async (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    try {
      const response = await axios.get(
        `http://localhost:5000/loan-callback-by-branch/${encodeURIComponent(
          branch
        )}`
      );

      const loansWithInstallmentCount = await Promise.all(
        response.data.map(async (loan) => {
          const installmentDateCount = await fetchInstallmentDateCount(
            loan.loanID
          );
          const remainingInstallments =
            loan.totalInstallment - installmentDateCount;
          return { ...loan, installmentDateCount, remainingInstallments };
        })
      );

      // Filter members based on deleteMode
      if (deleteMode) {
        const inactiveCenters = loansWithInstallmentCount.filter(
          (loan) => loan.ActiveStatus === "False"
        );
        setMembers(inactiveCenters); // Set the members to inactive centers
      } else {
        const activeCenters = loansWithInstallmentCount.filter(
          (loan) => loan.ActiveStatus !== "False"
        );
        setMembers(activeCenters); // Set the members to active centers
        setCurrentPage(1); // Reset to the first page after fetching new members
      }

      setLoans((prevLoans) => ({
        ...prevLoans,
        [branch]: loansWithInstallmentCount,
      }));
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  const totalAmount =
    selectedBranch &&
    loans[selectedBranch]?.reduce(
      (total, loan) => total + (loan.OLamount || 0),
      0
    );

  const handleViewForCenter = (loanItem) => {
    navigate("/home/loanview", {
      state: { loanID: loanItem.loanID, from: "LoanDetails" },
    });
  };

  const handleEditForCenter = (loanItem) => {
    navigate("/home/LoanEdit", {
      state: { loanID: loanItem.loanID, from: "LoanDetails" },
    });
  };

  const handleLoanAllDate = (loanItem) => {
    navigate("/home/LoanAllDates", { state: { loanID: loanItem.loanID } });
  };

  const handleDeleteClick = (center) => {
    if (window.confirm("Delete the selected Center")) {
      const deleteDate = new Date().toISOString(); // Get the current date

      axios
        .put(`http://localhost:5000/openloan/ActiveStatus/${center._id}`, {
          username, // Pass username to the backend
          deleteDate, // Pass the current date to the backend
        })
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

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">শাখার ঋণের তালিকা</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  // Toggle button function remains the same
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    // Refetch the centers based on the new delete mode
    handleBranchChange({ target: { value: selectedBranch } });
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
        <h2 className="text-center mb-4 pt-4">শাখার ঋণের তালিকা </h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="branchSelect" className="form-label">
            শাঁখা নির্বাচন করুণ
          </label>
          <select
            className="form-select"
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
                  .filter((branch) => userBranches.includes(branch.BranchName))
                  .map((branch) => (
                    <option key={branch._id} value={branch.BranchName}>
                      {branch.BranchName}
                    </option>
                  ))}
          </select>
        </div>
        <div className="col-md-3 mb-3  justify-content-end  mt-3">
          <label className="form-label">Show Deleted Member</label>
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

      <div className="table-responsive">
        {selectedBranch && currentMembers.length > 0 && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>সদস্য ID</th>
                <th>মোবাইল</th>
                <th>ঋণের ধরণ</th>
                <th>ঋণের পরিমাণ</th>
                <th>মোট কিস্তি</th>
                <th>কিস্তি জমা</th>
                <th>কিস্তি বাকি</th>
                <th>কেন্দ্র</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((loanItem) => (
                <tr key={loanItem.loanID}>
                  <td>{loanItem.loanID}</td>
                  <td>{loanItem.OLname}</td>
                  <td>{loanItem.memberID}</td>
                  <td>{loanItem.OLmobile}</td>
                  <td>{loanItem.loanType}</td>
                  <td>{loanItem.OLamount}</td>
                  <td>{loanItem.totalInstallment}</td>
                  <td>{loanItem.installmentDateCount}</td>
                  <td>{loanItem.remainingInstallments}</td>
                  <td>{loanItem.OLcenter}</td>
                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleViewForCenter(loanItem)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>

                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEditForCenter(loanItem)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleLoanAllDate(loanItem)}
                    >
                      Date
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(loanItem)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4">
          <p>মোট ঋণ সংখ্যা: {loans[selectedBranch]?.length || 0} টি</p>
          <p>মোট ঋণের পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
      {/* Pagination controls */}
      {selectedBranch && (
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
      )}
    </div>
  );
}

export default LoanDetailsForBranch;
