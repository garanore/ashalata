// src/component/page/LoginSignup/PrivateRoute.jsx

// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

export default PrivateRoute;
