// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MEMBER_LIST_CENTER_ROUTE = "/home/Signup";

const UserEdit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [centers, setCenters] = useState([]);
  const [branchs, setbranchs] = useState([]);
  const [designations, setdesignations] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

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
    const fetchUserData = async () => {
      if (username) {
        try {
          const response = await axios.get(
            `http://localhost:5000/get-user-username/${username}`
          );

          if (response.data.length > 0) {
            setSelectedUser(response.data[0]); // Assuming the response returns an array
            setError("");
          } else {
            setSelectedUser(null);
            setError("User not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          setError("Failed to fetch user data");
        }
      }
    };

    fetchUserData();

    axios
      .get("http://localhost:5000/center-callback")
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setbranchs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    axios
      .get("http://localhost:5000/designation-callback")
      .then((response) => {
        setdesignations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, [username]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  // For Center

  const handleCenterChange = (e, index) => {
    const updatedCenters = [...selectedUser.UserCenter];
    updatedCenters[index] = e.target.value;
    setSelectedUser((prevState) => ({
      ...prevState,
      UserCenter: updatedCenters,
    }));
  };
  const handleAddCenter = () => {
    setSelectedUser((prevState) => ({
      ...prevState,
      UserCenter: [...prevState.UserCenter, ""],
    }));
  };

  const handleRemoveCenter = (index) => {
    const updatedCenters = selectedUser.UserCenter.filter(
      (_, i) => i !== index
    );
    setSelectedUser((prevState) => ({
      ...prevState,
      UserCenter: updatedCenters,
    }));
  };

  // For Account Name

  const handleAccountNameChange = (e) => {
    const updatedAccountName = e.target.value;
    setSelectedUser((prevState) => ({
      ...prevState,
      accountName: updatedAccountName,
    }));
  };
  const handlePhoneNumberChange = (e) => {
    const updatedPhoneNumber = e.target.value;
    setSelectedUser((prevState) => ({
      ...prevState,
      phoneNumber: updatedPhoneNumber,
    }));
  };

  const handleBranchChange = (e, index) => {
    const updatedBranches = [...selectedUser.UserBranch];
    updatedBranches[index] = e.target.value;
    setSelectedUser((prevState) => ({
      ...prevState,
      UserBranch: updatedBranches,
    }));
  };
  const handleAddBranch = () => {
    setSelectedUser((prevState) => ({
      ...prevState,
      UserBranch: [...prevState.UserBranch, ""],
    }));
  };
  const handleRemoveBranch = (index) => {
    const updatedBranches = selectedUser.UserBranch.filter(
      (_, i) => i !== index
    );
    setSelectedUser((prevState) => ({
      ...prevState,
      UserBranch: updatedBranches,
    }));
  };

  const handleDesignationChange = (e) => {
    const selectedDesignation = e.target.value;
    setSelectedUser((prevState) => ({
      ...prevState,
      designation: selectedDesignation,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    try {
      const updatedUserData = {
        phoneNumber: selectedUser.phoneNumber,
        username: selectedUser.username,
        designation: selectedUser.designation,
        accountName: selectedUser.accountName,
        UserBranch: selectedUser.UserBranch,
        UserCenter: selectedUser.UserCenter,
      };

      const response = await axios.put(
        `http://localhost:5000/update-user/${selectedUser._id}`,
        updatedUserData
      );

      if (response.status === 200) {
        setSubmitMessage("User updated successfully!");
      } else {
        setSubmitMessage("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("An error occurred while updating the user");
    }
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">User Edit</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-row bg-light container-fluid p-2 ">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">User Edit</h2>
          </div>

          <div className="mb-3 row">
            <div className="col-3">
              <label htmlFor="memberID" className="form-label">
                User Name
              </label>
              <input
                type="text"
                id="memberID"
                className="form-control"
                placeholder="Enter user name"
                value={username}
                onChange={handleUsernameChange}
              />
              {error && <div className="text-danger mt-1">{error}</div>}
            </div>
          </div>
          {selectedUser && (
            <div className="mt-3 row">
              <div className="col-2">
                <label htmlFor="accountName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  className="form-control"
                  value={selectedUser.accountName || ""}
                  onChange={handleAccountNameChange}
                />
              </div>

              <div className="col-2">
                <label htmlFor="username" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={selectedUser.username || ""}
                  readOnly
                />
              </div>

              <div className="col-3">
                <label htmlFor="designation" className="form-label">
                  Designation
                </label>

                <select
                  id="designation"
                  className="form-control"
                  value={selectedUser.designation || ""}
                  onChange={handleDesignationChange}
                >
                  <option value="">Choose...</option>
                  {designations.map((designation) => (
                    <option
                      key={designation._id}
                      value={designation.DesignationName}
                    >
                      {designation.DesignationName}
                    </option>
                  ))}
                </select>
              </div>

              {/* UserBranch Section */}
              {selectedUser.UserBranch?.map((branch, index) => (
                <div className="col-3 d-flex align-items-center" key={index}>
                  <div className="w-100">
                    <label
                      htmlFor={`UserBranch${index}`}
                      className="form-label"
                    >
                      Branch
                    </label>
                    <select
                      id={`UserBranch${index}`}
                      className="form-control"
                      value={branch || "N/A"}
                      onChange={(e) => handleBranchChange(e, index)}
                    >
                      <option value="">Choose...</option>
                      {branchs.map((branch) => (
                        <option key={branch._id} value={branch.BranchName}>
                          {branch.BranchName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm ms-2 mt-4"
                    onClick={handleAddBranch}
                  >
                    +
                  </button>
                  {selectedUser.UserBranch.length > 1 && index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2 mt-4"
                      onClick={() => handleRemoveBranch(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              {/* UserCenter Section */}
              {selectedUser.UserCenter?.map((center, index) => (
                <div className="col-3 d-flex align-items-center" key={index}>
                  <div className="w-100">
                    <label
                      htmlFor={`UserCenter${index}`}
                      className="form-label"
                    >
                      Center
                    </label>
                    <select
                      id={`UserCenter${index}`}
                      className="form-control"
                      value={center || "N/A"}
                      onChange={(e) => handleCenterChange(e, index)}
                    >
                      <option value="">Choose...</option>
                      {centers.map((center) => (
                        <option key={center._id} value={center.centerID}>
                          {center.centerID}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm ms-2 mt-4"
                    onClick={handleAddCenter}
                  >
                    +
                  </button>
                  {selectedUser.UserCenter.length > 1 && index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2 mt-4"
                      onClick={() => handleRemoveCenter(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              <div className="col-3 mt-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Mobile
                </label>
                <input
                  type="number"
                  id="phoneNumber"
                  className="form-control"
                  value={selectedUser.phoneNumber || ""}
                  onChange={handlePhoneNumberChange}
                />
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between mt-5">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-primary btn-md"
          >
            Cancel
          </button>
        </div>
      </form>
      {submitMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {submitMessage}
        </div>
      )}
    </div>
  );
};

export default UserEdit;
