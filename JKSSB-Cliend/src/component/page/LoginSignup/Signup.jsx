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

      if (designations.length > 0) {
        const loggedUserDesignation = designations[0]; // Get the first designation if present
        localStorage.setItem("selectedDesignationName", loggedUserDesignation);
      } else {
        console.log("No designation found for the logged-in user.");
      }

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";

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

      // Store the username in the formData to use it later in handleSubmit
      setmemberData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
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
      (designation) => designation.DesignationID === selectedDesignationID
    )?.DesignationName;

    setdesignation(selectedDesignationName); // Set the designation state to DesignationName

    if (
      [
        "নির্বাহী পরিচালক ",
        "সহকারী নির্বাহী পরিচালক ",
        "অর্থ পরিচালক ",
        "প্রোগ্রাম অফিসার ",
        "অডিট অফিসার ",
        "সহকারী অডিট অফিসার ",
        "এরিয়া ম্যানাজার ",
      ].includes(selectedDesignationName)
    ) {
      setShowUserBranch(false);
      setShowCenterIDMember(false);
    } else if (
      [
        "শাখা ব্যাবস্থাপক ",
        "সহকারী শাখা ব্যাবস্থাপক ",
        "শাখা হিসাব রক্ষক ",
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
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Create Account</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-5">
            <h2 className="text-center mb-4">Create Account</h2>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="accountName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  id="accountName"
                  value={accountName}
                  onChange={handleAccountNameChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Your Phone Number"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Unique Username"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
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

                  {loggedUserDesignation === "নির্বাহী পরিচালক " ||
                  loggedUserDesignation === "সহকারী নির্বাহী পরিচালক " ||
                  loggedUserDesignation === "অর্থ পরিচালক " ||
                  loggedUserDesignation === "প্রোগ্রাম অফিসার " ||
                  loggedUserDesignation === "অডিট অফিসার " ||
                  loggedUserDesignation === "সহকারী অডিট অফিসার " ||
                  loggedUserDesignation === "এরিয়া ম্যানাজার "
                    ? // User with full access can view all designations
                      designations.map((designation) => (
                        <option
                          key={designation.DesignationID}
                          value={designation.DesignationID}
                        >
                          {designation.DesignationName}
                        </option>
                      ))
                    : loggedUserDesignation === "শাখা ব্যাবস্থাপক " ||
                      loggedUserDesignation === "সহকারী শাখা ব্যাবস্থাপক " ||
                      loggedUserDesignation === "শাখা হিসাব রক্ষক " ||
                      loggedUserDesignation === "সহকারী শাখা হিসাবরক্ষক"
                    ? // User with restricted access can view only specific designations
                      designations
                        .filter((designation) =>
                          [
                            "উর্দ্ধতন কর্মসূচী সংগঠক",
                            "কর্মসূচী সংগঠক",
                            "সহকারী কর্মসূচী সংগঠক",
                          ].includes(designation.DesignationName)
                        )
                        .map((filteredDesignation) => (
                          <option
                            key={filteredDesignation.DesignationID}
                            value={filteredDesignation.DesignationID}
                          >
                            {filteredDesignation.DesignationName}
                          </option>
                        ))
                    : null}
                </select>
              </div>

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
                    {/* Step 3: Filter branches based on userBranches */}
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

              {showCenterIDMember && (
                <div className="mb-3">
                  <label htmlFor="UserCenter" className="form-label">
                    কেন্দ্র নির্বাচন করুণ
                  </label>
                  <select
                    id="UserCenter"
                    name="UserCenter"
                    className="form-select"
                    value={memberData.CenterMember}
                    required
                    onChange={handleCenterChange} // Update to use handleCenterChange
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

              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  Create Account
                </button>
              </div>

              <div className="mb-3 text-center">
                <Link to="/">Login</Link>
              </div>
            </form>
          </div>
          {submitMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
