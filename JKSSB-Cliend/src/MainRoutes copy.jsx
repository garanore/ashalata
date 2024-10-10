// /src/MainRoutes.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./component/page/LoginSignup/Login";
import Signup from "./component/page/LoginSignup/Signup";
import Home from "./component/page/home/Home";
import LoanView from "./component/page/loan/LoanView";
import WorkerEdit from "./component/page/office/WorkerEdit";
import WorkerDetails from "./component/page/office/WorkerDetails";
import OfficeWorkerGranted from "./component/page/office/OfficeWorkerGranted";
import MemberListCenter from "./component/page/center/MemberListCenter";
import MemberListBranch from "./component/page/branch/MemberListBranch";
import AllMemberList from "./component/page/Account/AllMemberList";
import SavingDetails from "./component/page/center/SavingsDetails";
import SavingsDetailsForBranch from "./component/page/branch/SavingsDetailsFroBranch";
import BranchList from "./component/page/branch/BranchList";
import OpenBranch from "./component/page/branch/OpenBranch";

const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="home" element={<Home />} />
          <Route path="LoanView" element={<LoanView />} />
          <Route path="home/WorkerEdit" element={<WorkerEdit />} />
          <Route path="home/WorkerDetails" element={<WorkerDetails />} />
          <Route
            path="home/OfficeWorkerGranted"
            element={<OfficeWorkerGranted />}
          />
          <Route path="home/MemberListCenter" element={<MemberListCenter />} />

          <Route path="home/BranchMemberList" element={<MemberListBranch />} />

          <Route path="home/AllMemberList" element={<AllMemberList />} />
          <Route path="home/SavingsDetails" element={<SavingDetails />} />
          <Route
            path="home/SavingsDetailsFroBranch"
            element={<SavingsDetailsForBranch />}
          />
          <Route path="/home/BranchList" element={<BranchList />} />
          <Route path="/home/OpenBranch" element={<OpenBranch />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default MainRoutes;
