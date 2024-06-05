// Signup.js
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
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

  const API_URL = "https://ashalota.gandhipoka.com/signup";
  const DESIGNATION_API_URL =
    "https://ashalota.gandhipoka.com/designation-callback";

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
  }, []);

  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
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

  const handleRankChange = (e) => setdesignation(e.target.value);
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
      const response = await axios.post(API_URL, {
        phoneNumber,
        username,
        password,
        designation,
        accountName,
      });
      console.log("Response:", response);

      // Reset form fields
      setPhoneNumber("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setdesignation("");
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
                  {designations.map((designation) => (
                    <option
                      key={designation.DesignationID}
                      value={designation.DesignationID}
                    >
                      {designation.DesignationName}
                    </option>
                  ))}
                </select>
              </div>
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
