// /src/MainRoutes.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./component/page/LoginSignup/Login";
import Signup from "./component/page/LoginSignup/Signup";
import Home from "./component/page/home/Home";
import LoanView from "./component/page/loan/LoanView";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="LoanView" element={<LoanView />} />
          {/* Add any other routes you need here */}
          {/* Add any other routes you need here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
