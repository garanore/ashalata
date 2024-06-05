// src/AppRouter.jsx

// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App.jsx";
import Login from "./component/page/LoginSignup/Login.jsx";
import Home from "./component/page/home/Home";
import MemberAdmission from "./component/page/member/MemberAdmission";
import MemberEdit from "./component/page/member/MemberEdit.jsx";
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
import OpenSavings from "./component/page/saving/OpenSavings.jsx";
import SavingsCollection from "./component/page/saving/SavingsCollection.jsx";
import SavingsWithdraw from "./component/page/saving/SavingsWithdraw.jsx";
import WorkerTransfer from "./component/page/office/WorkerTransfer.jsx";
import InstallmentList from "./component/page/loan/InstallmentList.jsx";
import InstallmentCollection from "./component/page/loan/InstallmentCollection.jsx";
import SavingList from "./component/page/saving/SavingList.jsx";
import Signup from "./component/page/LoginSignup/Signup.jsx";
import ForgotPassword from "./component/page/LoginSignup/ForgetPassword.jsx";
import BranchEditModal from "./component/page/branch/BranchEditModal.jsx";
import WorkerEdit from "./component/page/office/WorkerEdit.jsx";
import CenterEdit from "./component/page/center/CenterEdit.jsx";
import AllMemberList from "./component/page/Account/AllMemberList.jsx";
import MemberAbout from "./component/page/member/MemberAbout.jsx";
import LoanView from "./component/page/loan/LoanView.jsx"; // Import LoanView component
import LoanEdit from "./component/page/loan/LoanEdit.jsx";
import Designation from "./component/page/office/AddDesignation.jsx";
import SavingView from "./component/page/saving/SavingView.jsx"; // Import SavingView component
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
import PrivateRoute from "./component/page/LoginSignup/PrivateRoute.jsx";

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const AppRouter = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated() ? <Navigate to="/home" replace /> : <Login />,
    },
    {
      path: "/login",
      element: isAuthenticated() ? <Navigate to="/home" replace /> : <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },

    {
      path: "/home",
      element: isAuthenticated() ? <App /> : <Navigate to="/login" replace />,
      children: [
        { path: "", element: <PrivateRoute element={<Home />} /> },

        {
          path: "Signup",
          element: <PrivateRoute element={<Signup />} />,
        },

        {
          path: "MemberAdmission",
          element: <PrivateRoute element={<MemberAdmission />} />,
        },
        {
          path: "MemberEdit",
          element: <PrivateRoute element={<MemberEdit />} />,
        },
        {
          path: "MemberAbout",
          element: <PrivateRoute element={<MemberAbout />} />,
        },
        {
          path: "OpenCenter",
          element: <PrivateRoute element={<OpenCenter />} />,
        },
        {
          path: "CenterList",
          element: <PrivateRoute element={<CenterList />} />,
        },
        {
          path: "MemberListCenter",
          element: <PrivateRoute element={<MemberListCenter />} />,
        },
        {
          path: "CenterEdit",
          element: <PrivateRoute element={<CenterEdit />} />,
        },
        {
          path: "LoanDetails",
          element: <PrivateRoute element={<LoanDetails />} />,
        },
        {
          path: "SavingsDetails",
          element: <PrivateRoute element={<SavingDetails />} />,
        },
        {
          path: "OpenBranch",
          element: <PrivateRoute element={<OpenBranch />} />,
        },
        {
          path: "BranchList",
          element: <PrivateRoute element={<BranchList />} />,
        },
        {
          path: "BranchMemberList",
          element: <PrivateRoute element={<MemberListBranch />} />,
        },
        {
          path: "OfficeCollection",
          element: <PrivateRoute element={<OfficeCollection />} />,
        },
        {
          path: "BranchEditModal",
          element: <PrivateRoute element={<BranchEditModal />} />,
        },
        {
          path: "LoanDetailsForBranch",
          element: <PrivateRoute element={<LoanDetailsForBranch />} />,
        },
        {
          path: "SavingsDetailsFroBranch",
          element: <PrivateRoute element={<SavingsDetailsFroBranch />} />,
        },
        {
          path: "OpenLoan",
          element: <PrivateRoute element={<OpenLoan />} />,
        },
        {
          path: "InstallmentList",
          element: <PrivateRoute element={<InstallmentList />} />,
        },
        {
          path: "InstallmentCollection",
          element: <PrivateRoute element={<InstallmentCollection />} />,
        },
        {
          path: "LoanView",
          element: <PrivateRoute element={<LoanView />} />, // Define the LoanView route
        },
        {
          path: "LoanEdit",
          element: <PrivateRoute element={<LoanEdit />} />,
        },
        {
          path: "LoanAllDates",
          element: <PrivateRoute element={<LoanAllDates />} />,
        },
        {
          path: "OpenSavings",
          element: <PrivateRoute element={<OpenSavings />} />,
        },
        {
          path: "SavingView",
          element: <PrivateRoute element={<SavingView />} />, // Define the SavingView route
        },
        {
          path: "SavingEdit",
          element: <PrivateRoute element={<SavingEdit />} />,
        },
        {
          path: "SavingsCollection",
          element: <PrivateRoute element={<SavingsCollection />} />,
        },
        {
          path: "SavingsWithdraw",
          element: <PrivateRoute element={<SavingsWithdraw />} />,
        },
        {
          path: "SavingList",
          element: <PrivateRoute element={<SavingList />} />,
        },
        {
          path: "SavingAllDates",
          element: <PrivateRoute element={<SavingAllDates />} />,
        },
        {
          path: "WorkerAdmission",
          element: <PrivateRoute element={<WorkerAdmission />} />,
        },
        {
          path: "WorkerDetails",
          element: <PrivateRoute element={<WorkerDetails />} />,
        },
        {
          path: "WorkerTransfer",
          element: <PrivateRoute element={<WorkerTransfer />} />,
        },
        {
          path: "WorkerEdit",
          element: <PrivateRoute element={<WorkerEdit />} />,
        },
        {
          path: "AllMemberList",
          element: <PrivateRoute element={<AllMemberList />} />,
        },
        {
          path: "Designation",
          element: <PrivateRoute element={<Designation />} />,
        },
        {
          path: "Salary",
          element: <PrivateRoute element={<Salary />} />,
        },
        {
          path: "LoanPortfolioStatement",
          element: <PrivateRoute element={<LoanPortfolioStatement />} />,
        },
        {
          path: "DailyDepositRegister",
          element: <PrivateRoute element={<DailyDepositRegister />} />,
        },
        {
          path: "MonthlyServiceChargeStatement",
          element: <PrivateRoute element={<MonthlyServiceChargeStatement />} />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />,
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRouter;
