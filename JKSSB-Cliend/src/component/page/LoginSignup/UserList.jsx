// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

function UserList() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [, setSelectedCenter] = useState(null);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [userBranches, setUserBranches] = useState([]);
  const [username, setUsername] = useState(""); // Add username state
  const [deleteMode, setDeleteMode] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [designations, setDesignations] = useState([]); // State for designations
  const [selectedDesignation, setSelectedDesignation] = useState(""); // State for selected designation

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

    // Fetch all designations
    axios
      .get("http://localhost:5000/designation-callback")
      .then((response) => {
        setDesignations(response.data); // Store designations in state
      })
      .catch((error) => {
        console.error("Error fetching designation data:", error);
      });

    // Retrieve user branch data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);
      const userBranches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      setUserBranches(userBranches);

      if (userBranches.includes("AllBranch")) {
        setHasAccess(true);
      }

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state
    }
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

    // If both branch and designation are selected
    if (branch && designation) {
      apiUrl = `http://localhost:5000/get-user-branch-designation?branch=${encodeURIComponent(
        branch
      )}&designation=${encodeURIComponent(designation)}`;
    }
    // If only branch is selected
    else if (branch) {
      apiUrl = `http://localhost:5000/get-user-UserBranch/${encodeURIComponent(
        branch
      )}`;
    }
    // If only designation is selected
    else if (designation) {
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
            // Show only users with ActiveStatus "False"
            userData = userData.filter((user) => user.ActiveStatus === "False");
          } else {
            // Show users with ActiveStatus not "False"
            userData = userData.filter((user) => user.ActiveStatus !== "False");
          }
          setUsers(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
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
          // After updating, refetch the centers for the selected branch or designation
          fetchUsers({
            branch: selectedBranch,
            designation: selectedDesignation,
          });
        })
        .catch((error) => {
          console.error("Error updating ActiveStatus:", error);
        });
    }
  };

  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    // Refetch the centers based on the new delete mode
    fetchUsers({
      branch: selectedBranch,
      designation: selectedDesignation,
    });
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">User List</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">User List </h2>
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
            {/* Filter branches based on userBranches */}
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

        <div className="col-md-3">
          <label htmlFor="Designation" className="form-label">
            পদবি
          </label>
          <select
            id="Designation"
            name="Designation"
            className="form-select"
            value={selectedDesignation}
            onChange={handleDesignationChange}
          >
            <option value="">Choose...</option>
            {/* Map over the designations state to create options */}
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

        <div className="col-md-3 mb-3">
          <label className="form-label">Total User</label>
          <input
            type="text"
            className="form-control"
            value={users.length}
            readOnly
          />
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
      </div>
      <div className="table-responsive">
        {users.length > 0 && (
          <table className="table table-hover">
            <thead>
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
              {users.map((user) => (
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
        {users.length === 0 &&
          selectedBranch === "" &&
          selectedDesignation === "" && (
            <p className="text-center">
              Please select a branch or designation to view users.
            </p>
          )}
        {users.length === 0 &&
          (selectedBranch !== "" || selectedDesignation !== "") && (
            <p className="text-center">
              No users found for the selected criteria.
            </p>
          )}
      </div>
    </div>
  );
}

export default UserList;
