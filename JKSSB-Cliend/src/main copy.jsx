import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MemberAdmission from "./component/page/member/MemberAdmission";
import Home from "./component/page/home/Home";
import WorkerAdmission from "./component/page/office/OfficeWorkerAdd.jsx";
import WorkerDetails from "./component/page/office/WorkerDetails.jsx";
import OpenCenter from "./component/page/center/OpendCenter.jsx";
import CenterList from "./component/page/center/CenterList.jsx";
import MemberListCenter from "./component/page/center/MemberListCenter.jsx";
import OpenBranch from "./component/page/branch/OpenBranch.jsx";
import BranchList from "./component/page/branch/BranchList.jsx";
import MemberListBranch from "./component/page/branch/MemberListBranch.jsx";
import OfficeCollection from "./component/page/branch/OfficeCollection.jsx";
import OpenLoan from "./component/page/loan/OpenLoan.jsx";
// import LoanDetails from "./component/page/loan/LoanDetails.jsx";
import OpenSavings from "./component/page/saving/OpenSavings.jsx";
import SavingsCollection from "./component/page/saving/SavingsCollection.jsx";

import SavingsWithdraw from "./component/page/saving/SavingsWithdraw.jsx";
import WorkerTransfer from "./component/page/office/WorkerTransfer.jsx";
import InstallmentList from "./component/page/loan/InstallmentList.jsx";
import InstallmentCollection from "./component/page/loan/InstallmentCollection.jsx";
import SavingList from "./component/page/saving/SavingList.jsx";
import Login from "./component/page/LoginSignup/Login.jsx";
import Signup from "./component/page/LoginSignup/Signup.jsx";
import ForgotPassword from "./component/page/LoginSignup/ForgetPassword.jsx";
import MemberEdit from "./component/page/member/MemberEdit.jsx";
import BranchEditModal from "./component/page/branch/BranchEditModal.jsx";
import WorkerEdit from "./component/page/office/WorkerEdit.jsx";
import CenterEdit from "./component/page/center/CenterEdit.jsx";
import AllMemberList from "./component/page/Account/AllMemberList.jsx";
import MemberAbout from "./component/page/member/MemberAbout.jsx";
import LoanView from "./component/page/loan/LoanView.jsx";
import LoanEdit from "./component/page/loan/LoanEdit.jsx";
import Designation from "./component/page/office/AddDesignation.jsx";
import SavingView from "./component/page/saving/SavingView.jsx";
import SavingEdit from "./component/page/saving/SavingEdit.jsx";
import Salary from "./component/page/office/Salary.jsx";
import LoanPortfolioStatement from "./component/page/Account/LoanProtfulioStatement.jsx";
import DailyDepositRegister from "./component/page/Account/DailyDepositRegister";
import MonthlyServiceChargeStatement from "./component/page/Account/MonthlyServiceChargeStatement";
import SavingAllDates from "./component/page/saving/SavingAllDates.jsx";
import LoanAllDates from "./component/page/loan/LoanAllDates.jsx";
import LoanDetails from "./component/page/center/LoanDetails";
import LoanDetailsForBranch from "./component/page/branch/LoanDetailsForBranch.jsx";
import SavingDetails from "./component/page/center/SavingsDetails.jsx";
import SavingsDetailsFroBranch from "./component/page/branch/SavingsDetailsFroBranch.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "MemberAdmission", element: <MemberAdmission /> },
      { path: "MemberEdit", element: <MemberEdit /> },
      { path: "MemberAbout", element: <MemberAbout /> },
      { path: "Home", element: <Home /> },
      { path: "Login", element: <Login /> },
      { path: "Signup", element: <Signup /> },
      { path: "ForgotPassword", element: <ForgotPassword /> },

      // Center Section

      { path: "OpenCenter", element: <OpenCenter /> },
      { path: "CenterList", element: <CenterList /> },
      {
        path: "MemberListCenter",
        element: <MemberListCenter />,
      },
      {
        path: "CenterEdit",
        element: <CenterEdit />,
      },
      { path: "LoanDetails", element: <LoanDetails /> },
      { path: "SavingsDetails", element: <SavingDetails /> },
      // Branch Section

      { path: "OpenBranch", element: <OpenBranch /> },
      { path: "BranchList", element: <BranchList /> },
      { path: "BranchMemberList", element: <MemberListBranch /> },
      { path: "OfficeCollection", element: <OfficeCollection /> },
      { path: "BranchEditModal", element: <BranchEditModal /> },
      { path: "LoanDetailsForBranch", element: <LoanDetailsForBranch /> },
      { path: "SavingsDetailsFroBranch", element: <SavingsDetailsFroBranch /> },

      // Loan Section

      { path: "OpenLoan", element: <OpenLoan /> },
      // { path: "LoanDetails", element: <LoanDetails /> },
      { path: "InstallmentList", element: <InstallmentList /> },
      { path: "InstallmentCollection", element: <InstallmentCollection /> },
      { path: "LoanView", element: <LoanView /> },
      { path: "LoanEdit", element: <LoanEdit /> },
      { path: "LoanAllDates", element: <LoanAllDates /> },

      // Savings Section

      { path: "OpenSavings", element: <OpenSavings /> },

      { path: "SavingView", element: <SavingView /> },
      { path: "SavingEdit", element: <SavingEdit /> },
      { path: "SavingsCollection", element: <SavingsCollection /> },
      { path: "SavingsWithdraw", element: <SavingsWithdraw /> },
      { path: "SavingList", element: <SavingList /> },
      { path: "SavingAllDates", element: <SavingAllDates /> },

      //Office Section
      { path: "WorkerAdmission", element: <WorkerAdmission /> },
      { path: "WorkerDetails", element: <WorkerDetails /> },
      { path: "WorkerTransfer", element: <WorkerTransfer /> },
      { path: "WorkerEdit", element: <WorkerEdit /> },

      // Account Section
      { path: "AllMemberList", element: <AllMemberList /> },
      { path: "Designation", element: <Designation /> },
      { path: "Salary", element: <Salary /> },
      { path: "LoanPortfolioStatement", element: <LoanPortfolioStatement /> },
      { path: "DailyDepositRegister", element: <DailyDepositRegister /> },
      {
        path: "MonthlyServiceChargeStatement",
        element: <MonthlyServiceChargeStatement />,
      },

      // Auth
      { path: "Auth-register", element: <Signup /> },
    ],
  },
  {},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
