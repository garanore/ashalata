// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [designation, setdesignation] = useState("");
  const [, setDesignationName] = useState(""); // DesignationName
  const [accountName, setAccountName] = useState("");
  const [designations, setDesignations] = useState([]);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [, setUserBranch] = useState("");
  const [, setUserCenter] = useState("");
  const [centers, setCenters] = useState([]);
  const [memberData, setmemberData] = useState({});
  const [, setSelectedCenter] = useState({});
  const [showUserBranch, setShowUserBranch] = useState(false);
  const [showCenterIDMember, setShowCenterIDMember] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [userBranches, setUserBranches] = useState([]);

  const API_URL = "http://localhost:5000/signup";
  const DESIGNATION_API_URL = "http://localhost:5000/designation-callback";

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axios.get(DESIGNATION_API_URL);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error.message);
      }
    };

    fetchDesignations();

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

      if (designations.length > 0) {
        localStorage.setItem("selectedDesignationName", designations[0]);
      }

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

      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );
      setHasAccess(!userHasRestrictedDesignation);

      setmemberData((prevData) => ({
        ...prevData,
        submittedBy: username,
      }));
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value); // New handler for email
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleAccountNameChange = (e) => setAccountName(e.target.value);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatchError(e.target.value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError(e.target.value !== password);
  };

  // Get logged-in user's designation from localStorage
  const loggedUserDesignation = localStorage.getItem("selectedDesignationName");

  const handleRankChange = (e) => {
    const selectedDesignationID = e.target.value;

    const selectedDesignationName = designations.find(
      (designation) => designation.DesignationName === selectedDesignationID
    )?.DesignationName;

    setdesignation(selectedDesignationID); // Set this to DesignationID for the select's value binding
    setDesignationName(selectedDesignationName); // Use another state to store DesignationName for display/logic

    if (
      [
        "নির্বাহী পরিচালক",
        "সহকারী নির্বাহী পরিচালক",
        "অর্থ পরিচালক",
        "প্রোগ্রাম অফিসার",
        "অডিট অফিসার",
        "সহকারী অডিট অফিসার",
        "এরিয়া ম্যানাজার",
      ].includes(selectedDesignationName)
    ) {
      setShowUserBranch(false);
      setShowCenterIDMember(false);
    } else if (
      [
        "শাখা ব্যাবস্থাপক",
        "সহকারী শাখা ব্যাবস্থাপক",
        "শাখা হিসাব রক্ষক",
        "সহকারী শাখা হিসাবরক্ষক",
      ].includes(selectedDesignationName)
    ) {
      setShowUserBranch(true);
      setShowCenterIDMember(false);
    } else {
      setShowUserBranch(true);
      setShowCenterIDMember(true);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      // Retrieve the logged-in user's data from localStorage
      const storedUserData = localStorage.getItem("userBranchData");
      const parsedData = storedUserData ? JSON.parse(storedUserData) : null;

      // Get the logged-in user's username to set in 'submittedBy'
      const loggedInUsername = parsedData?.username || "Unknown"; // Fallback if username is not found

      // Check if no branch is selected and set UserBranch to an empty array if so
      const UserBranch = selectedBranch ? [selectedBranch] : [];
      const UserCenter = memberData.CenterIDMember
        ? [memberData.CenterIDMember]
        : [];

      // Send the form data to the API
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, {
        phoneNumber,
        email,
        username,
        password,
        designation,
        accountName,
        UserBranch,
        UserCenter,
        submittedBy: loggedInUsername, // Set 'submittedBy' to the logged-in user's username
        GrantedBy: "Null", // Set to "Null" as required
        DeletedStatus: "Null", // Set to "Null" as required
        approvalStatus: "Pending", // Set to "Pending"
        ActiveStatus: "True", // Set to "True"
      });

      // Reset form fields
      setPhoneNumber("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setdesignation("");
      setUserBranch("");
      setUserCenter("");
      setAccountName("");
      setPasswordMatchError(false);
      setFormError("");
      setSubmitMessage("Account created successfully!");
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Error submitting the form"
      );
      console.error("Error submitting the form:", error.response?.data);
    }
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    setUserBranch(branch); // Update UserBranch with selected branch

    if (branch) {
      axios
        .get(
          `http://localhost:5000/center-callback?selectedBranch=${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          setCenters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching worker data:", error);
        });
    }
  };

  const handleCenterChange = (e) => {
    const selectedCenterID = e.target.value;
    setUserCenter(selectedCenterID); // Update UserCenter with selected center ID

    axios
      .get(`http://localhost:5000/center-callback-id/${selectedCenterID}`)
      .then((response) => {
        const center = response.data;

        setSelectedCenter(center[0]);
        setmemberData((prevData) => ({
          ...prevData,
          CenterIDMember: selectedCenterID, // Update CenterIDMember in memberData
          CenterNameMember: center[0].CenterName,
        }));
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
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
              <i className="fas fa-users" style={{ marginRight: "10px" }}></i>
              Account Create
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-5 border-0 rounded-3">
            <h2 className="text-center mb-4 text-primary">Create Account</h2>

            {formError && (
              <div className="alert alert-danger text-center">{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="accountName"
                  placeholder="Your Name"
                  value={accountName || ""}
                  onChange={handleAccountNameChange}
                  required
                />
                <label htmlFor="accountName">Name</label>
              </div>

              {/* Phone Number Input */}
              <div className="form-floating mb-3">
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  placeholder="Your Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                />
                <label htmlFor="phoneNumber">Phone Number</label>
              </div>

              {/* Email Input */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>

              {/* Username Input */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Unique Username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                <label htmlFor="username">Username</label>
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      passwordMatchError ? "is-invalid" : ""
                    }`}
                    id="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={handlePasswordChange}
                    minLength="8"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordMatchError && (
                  <div className="invalid-feedback">
                    Passwords do not match.
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      passwordMatchError ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    placeholder="Must be the same password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    minLength="8"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordMatchError && (
                  <div className="invalid-feedback">
                    Passwords do not match.
                  </div>
                )}
              </div>

              {/* Designation Select */}
              <div className="mb-3">
                <label htmlFor="designation" className="form-label">
                  পদ নির্বাচন করুণ
                </label>
                <select
                  className="form-select"
                  id="designation"
                  value={designation}
                  onChange={handleRankChange}
                  required
                >
                  <option value="" disabled>
                    বাছাই করুণ
                  </option>
                  {/* Full Access or Restricted Access Designations */}
                  {loggedUserDesignation === "নির্বাহী পরিচালক" ||
                  loggedUserDesignation === "সহকারী নির্বাহী পরিচালক" ||
                  loggedUserDesignation === "অর্থ পরিচালক" ||
                  loggedUserDesignation === "প্রোগ্রাম অফিসার" ||
                  loggedUserDesignation === "অডিট অফিসার" ||
                  loggedUserDesignation === "সহকারী অডিট অফিসার" ||
                  loggedUserDesignation === "এরিয়া ম্যানাজার"
                    ? designations.map((designation) => (
                        <option
                          key={designation.DesignationName}
                          value={designation.DesignationName}
                        >
                          {designation.DesignationName}
                        </option>
                      ))
                    : designations
                        .filter((d) =>
                          [
                            "উর্দ্ধতন কর্মসূচী সংগঠক",
                            "কর্মসূচী সংগঠক",
                            "সহকারী কর্মসূচী সংগঠক",
                          ].includes(d.DesignationName)
                        )
                        .map((filteredDesignation) => (
                          <option
                            key={filteredDesignation.DesignationName}
                            value={filteredDesignation.DesignationName}
                          >
                            {filteredDesignation.DesignationName}
                          </option>
                        ))}
                </select>
              </div>

              {/* User Branch */}
              {showUserBranch && (
                <div className="mb-3">
                  <label htmlFor="UserBranch" className="form-label">
                    শাঁখা নির্বাচন করুণ
                  </label>
                  <select
                    className="form-select"
                    id="UserBranch"
                    onChange={handleBranchChange}
                    value={selectedBranch}
                    required
                  >
                    <option value="" disabled>
                      বাছাই করুণ
                    </option>
                    {userBranches.includes("AllBranch") ||
                    userBranches.includes("AllCenter")
                      ? branches.map((branch) => (
                          <option key={branch._id} value={branch.BranchName}>
                            {branch.BranchName}
                          </option>
                        ))
                      : branches
                          .filter((branch) =>
                            userBranches.includes(branch.BranchName)
                          )
                          .map((branch) => (
                            <option key={branch._id} value={branch.BranchName}>
                              {branch.BranchName}
                            </option>
                          ))}
                  </select>
                </div>
              )}

              {/* User Center */}
              {showCenterIDMember && (
                <div className="mb-3">
                  <label htmlFor="UserCenter" className="form-label">
                    কেন্দ্র নির্বাচন করুণ
                  </label>
                  <select
                    id="UserCenter"
                    className="form-select"
                    value={memberData.CenterMember}
                    onChange={handleCenterChange}
                    required
                  >
                    <option value="">Choose...</option>
                    {centers.map((center) => (
                      <option key={center.centerID} value={center.centerID}>
                        {center.centerID}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <div className="d-grid mb-4">
                <button
                  type="submit"
                  className="btn btn-primary py-2 fw-bold rounded-pill"
                  style={{
                    background: "linear-gradient(135deg, #007bff, #00d2ff)",
                    border: "none",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background =
                      "linear-gradient(135deg, #00d2ff, #007bff)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background =
                      "linear-gradient(135deg, #007bff, #00d2ff)")
                  }
                >
                  Create Account
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-decoration-none fw-semibold"
                  style={{ color: "#007bff" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00d2ff")}
                  onMouseLeave={(e) => (e.target.style.color = "#007bff")}
                >
                  Already have an account? Login
                </Link>
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
        </div>
      </div>
    </div>
  );
};

export default Signup;
