// /src/components/auth/Login.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLoginInfoChange = (e) => {
    setLoginInfo(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Step 1: Authenticate the user
      const response = await axios.post("http://localhost:5000/login", {
        loginInfo,
        password,
      });

      const username = response.data.username; // Now this should be correct
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("accountName", response.data.accountName);
      localStorage.setItem("username", username); // Store the username

      // Step 2: Fetch user data using the correct username
      const userResponse = await axios.get(
        `http://localhost:5000/get-branch-center/${username}`
      );
      localStorage.setItem("BranchData", JSON.stringify(userResponse.data));

      // Clear any previous error
      setError("");

      // Step 3: Redirect to the home page immediately after successful login

      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  // Check if the user is already logged in on page load
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-5">
            <h2 className="text-center mb-4">Welcome Back Ashalata</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="loginInfo" className="form-label">
                  Username/Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="loginInfo"
                  value={loginInfo}
                  onChange={handleLoginInfoChange}
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
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleShowPasswordToggle}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
