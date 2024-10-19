// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/Signup";

const UserEdit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [centers, setCenters] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [, setHasAccess] = useState(false);
  const [accountName, setAccountName] = useState(""); // Add accountName state
  const [currentUserDesignation, setCurrentUserDesignation] = useState(""); // Track logged-in user's designation

  useEffect(() => {
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);
      setUsername(userNames[0] || "Unknown");

      // Fetch current user designation
      const currentUserDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];
      setCurrentUserDesignation(currentUserDesignation);

      setHasAccess(branches.includes("AllBranch"));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const response = await axios.get(
            `http://localhost:5000/get-user-username/${username}`
          );
          setSelectedUser(response.data[0] || null);
          setError(response.data.length > 0 ? "" : "User not found");
          if (response.data.length > 0) {
            setAccountName(response.data[0].accountName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          setError("Failed to fetch user data");
        }
      }

      try {
        const [centerResponse, branchResponse, designationResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/center-callback"),
            axios.get("http://localhost:5000/branch-callback"),
            axios.get("http://localhost:5000/designation-callback"),
          ]);
        setCenters(centerResponse.data);
        setBranchs(branchResponse.data);
        setDesignations(designationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const forbiddenDesignations = [
    "কর্মসূচী সংগঠক",
    "সহকারী কর্মসূচী সংগঠক",
    "উর্দ্ধতন কর্মসূচী সংগঠক",
  ];

  // Determine if current user has forbidden designation
  const currentUserHasForbiddenDesignation = forbiddenDesignations.includes(
    currentUserDesignation
  );

  const handleUsernameChange = (e) => setUsername(e.target.value.trim());

  const handleCenterChange = (e, index) => {
    const updatedCenters = [...selectedUser.UserCenter];
    updatedCenters[index] = e.target.value;
    setSelectedUser({ ...selectedUser, UserCenter: updatedCenters });
  };

  const handleAddCenter = () =>
    setSelectedUser({
      ...selectedUser,
      UserCenter: [...selectedUser.UserCenter, ""],
    });

  const handleRemoveCenter = (index) => {
    const updatedCenters = selectedUser.UserCenter.filter(
      (_, i) => i !== index
    );
    setSelectedUser({ ...selectedUser, UserCenter: updatedCenters });
  };

  const handleAccountNameChange = (e) =>
    setSelectedUser({ ...selectedUser, accountName: e.target.value });

  const handlePhoneNumberChange = (e) =>
    setSelectedUser({ ...selectedUser, phoneNumber: e.target.value });

  const handleBranchChange = (e, index) => {
    const updatedBranches = [...selectedUser.UserBranch];
    updatedBranches[index] = e.target.value;
    setSelectedUser({ ...selectedUser, UserBranch: updatedBranches });
  };

  const handleAddBranch = () =>
    setSelectedUser({
      ...selectedUser,
      UserBranch: [...selectedUser.UserBranch, ""],
    });

  const handleRemoveBranch = (index) => {
    const updatedBranches = selectedUser.UserBranch.filter(
      (_, i) => i !== index
    );
    setSelectedUser({ ...selectedUser, UserBranch: updatedBranches });
  };

  const handleDesignationChange = (e) =>
    setSelectedUser({ ...selectedUser, designation: e.target.value });

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

      setSubmitMessage(
        response.status === 200
          ? "User updated successfully!"
          : "Failed to update user."
      );
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("An error occurred while updating the user");
    }
  };

  const handleCancel = () => navigate(MEMBER_LIST_CENTER_ROUTE);

  if (currentUserHasForbiddenDesignation) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-4">
          <div className="border-bottom mb-4">
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#2D3748" }}
            >
              <i
                className="fas fa-user-edit"
                style={{ marginRight: "10px" }}
              ></i>
              User Edit
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
    <div className="form-row bg-light container-fluid p-2 ">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Header */}
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
                  <i
                    className="fas fa-user-edit"
                    style={{ marginRight: "10px" }}
                  ></i>{" "}
                  User Edit
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

          <div className="col-md-3 mb-3">
            <label
              htmlFor="memberID"
              className="form-label"
              style={{
                fontWeight: "bold",
                color: "#2D3748",
                fontSize: "0.95rem",
              }}
            >
              <i className="fas fa-user"></i> User Name
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{ borderRadius: "5px 0 0 5px" }}
              >
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="memberID"
                className="form-control border-primary"
                placeholder="Enter user name"
                value={username}
                onChange={handleUsernameChange}
                style={{
                  borderRadius: "0 5px 5px 0",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                }}
              />
            </div>
            {error && <div className="text-danger mt-2">{error}</div>}
          </div>

          {selectedUser && (
            <div className="mt-3 row">
              <div className="col-md-4 mb-3">
                <label
                  htmlFor="accountName"
                  className="form-label"
                  style={{
                    fontWeight: "bold",
                    color: "#2D3748",
                    fontSize: "0.95rem",
                  }}
                >
                  <i className="fas fa-user"></i> নাম
                </label>
                <div className="input-group shadow-sm">
                  <span
                    className="input-group-text bg-primary text-white"
                    style={{ borderRadius: "5px 0 0 5px" }}
                  >
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="accountName"
                    className="form-control border-primary shadow-sm"
                    value={selectedUser.accountName || ""}
                    onChange={handleAccountNameChange}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <label
                  htmlFor="accountName"
                  className="form-label"
                  style={{
                    fontWeight: "bold",
                    color: "#2D3748",
                    fontSize: "0.95rem",
                  }}
                >
                  <i className="fas fa-user"></i> User Name
                </label>
                <div className="input-group shadow-sm">
                  <span
                    className="input-group-text bg-primary text-white"
                    style={{ borderRadius: "5px 0 0 5px" }}
                  >
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="accountName"
                    className="form-control border-primary shadow-sm"
                    value={selectedUser.username || ""}
                    readOnly
                    onChange={handleAccountNameChange}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <label
                  htmlFor="Designation"
                  className="form-label"
                  style={{
                    fontWeight: "bold",
                    color: "#2D3748",
                    fontSize: "0.95rem",
                  }}
                >
                  <i className="fas fa-user-tie"></i> Designation
                </label>
                <div className="input-group shadow-sm">
                  <span
                    className="input-group-text bg-primary text-white"
                    style={{ borderRadius: "5px 0 0 5px" }}
                  >
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <select
                    id="designation"
                    className="form-select border-primary"
                    value={selectedUser.designation || ""}
                    onChange={handleDesignationChange}
                    style={{
                      borderRadius: "0 5px 5px 0",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <option value="">--------</option>
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
              </div>

              {/* UserBranch Section */}
              {selectedUser.UserBranch?.map((branch, index) => (
                <div className=" col-3 d-flex align-items-center" key={index}>
                  <div className="w-100">
                    <label
                      htmlFor="BranchMember"
                      className="form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-code-branch"></i>
                      Branch
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-code-branch"></i>
                      </span>
                      <select
                        id={`UserBranch${index}`}
                        className="form-select border-primary"
                        value={branch || "N/A"}
                        onChange={(e) => handleBranchChange(e, index)}
                      >
                        <option value="">--------</option>
                        {branchs.map((branch) => (
                          <option key={branch._id} value={branch.BranchName}>
                            {branch.BranchName}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      htmlFor="UserCenter"
                      className="form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-map-marker-alt"></i> Center
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <select
                        id={`UserCenter${index}`}
                        className="form-select border-primary"
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

              <div className="col-3">
                <label
                  htmlFor="MemberMobile"
                  className="col-form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-mobile-alt"></i>
                  Mobile
                </label>
                <div className="input-group shadow-sm">
                  <span
                    className="input-group-text bg-primary text-white"
                    style={{
                      background: "linear-gradient(45deg, #007bff, #00d4ff)",
                      color: "#fff",
                    }}
                  >
                    <i className="fas fa-mobile-alt"></i>
                  </span>
                  <input
                    type="number"
                    id="phoneNumber"
                    className="form-control border-primary"
                    value={selectedUser.phoneNumber || ""}
                    onChange={handlePhoneNumberChange}
                    style={{ borderRadius: "5px" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between mt-5">
          <button
            type="submit"
            className="btn btn-primary btn-lg shadow"
            style={{
              background: "linear-gradient(45deg, #007bff, #00d4ff)",
              color: "#fff",
            }}
          >
            <i className="fas fa-paper-plane"></i> Update
          </button>

          {/* <button type="submit" className="btn btn-primary">
            Update
          </button> */}

          <button
            type="button"
            className="btn btn-primary btn-lg shadow"
            onClick={handleCancel}
            style={{
              background: "linear-gradient(45deg, #007bff, #00d4ff)",
              color: "#fff",
            }}
          >
            <i className="fas fa-cancel"></i> Cancel
          </button>
        </div>
      </form>
      {submitMessage && (
        <div
          className="alert alert-success mt-3 d-flex align-items-center"
          role="alert"
          style={{
            borderRadius: "0.5rem", // Rounded corners
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
          }}
        >
          <i
            className="fas fa-check-circle"
            style={{
              fontSize: "1.5rem",
              marginRight: "10px", // Space between icon and text
              color: "#155724", // Dark green for the icon
            }}
          ></i>
          <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
        </div>
      )}
    </div>
  );
};

export default UserEdit;
