// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

const SideBar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? "" : menu);
  };

  return (
    <div className="navbar-expand-sm ">
      <div className="">
        {/* <!-- Sidebar --> */}
        <aside id="sidebar" className="js-sidebar ">
          <div className="h-100">
            <div className="sidebar-logo">{/* <a href="#"></a> */}</div>

            <div className="mt-5">
              <ul className="sidebar-nav">
                <li className="sidebar-header">Admin Elements</li>
                <li
                  className={`sidebar-item ${
                    location.pathname === "/Home" ? "active" : ""
                  }`}
                >
                  <Link to="/Home" className="sidebar-link">
                    <i className="fa-solid fa-list pe-2"></i>
                    ড্যাশবোর্ড
                  </Link>
                </li>

                {/* সদস্য শুরু  */}
                <li
                  className={`sidebar-item ${
                    activeMenu === "member" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "member" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("member")}
                    aria-expanded={activeMenu === "member"}
                    style={{
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      fontWeight: activeMenu === "member" ? "bold" : "normal",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-file-lines me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">সদস্য</span>{" "}
                      {/* Text label */}
                    </div>

                    <i
                      className={`fa-solid ${
                        activeMenu === "member"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="member"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "member" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/MemberAdmission" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="MemberAdmission"
                        className={`sidebar-link text-light d-flex align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/MemberAdmission"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          fontWeight:
                            location.pathname === "/MemberAdmission"
                              ? "bold"
                              : "normal",
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-user-plus pe-2"></i>{" "}
                        {/* Optional icon */}
                        সদস্য ভর্তি করুণ
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* সদস্য শেষ */}

                {/* কেন্দ্র শুরু */}

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "center" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "center" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("center")}
                    aria-expanded={activeMenu === "center"}
                    style={{
                      fontWeight: activeMenu === "center" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-sliders me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">কেন্দ্র</span>{" "}
                      {/* Text label */}
                    </div>

                    <i
                      className={`fa-solid ${
                        activeMenu === "center"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  {/* Dropdown Menu */}
                  <ul
                    id="center"
                    className={`sidebar-dropdown list-unstyled ps-2 collapse ${
                      activeMenu === "center" ? "show" : ""
                    }`}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/OpenCenter" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="OpenCenter"
                        className={`sidebar-link text-light d-flex justify-content-start align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/OpenCenter"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-plus-circle me-3"></i>{" "}
                        {/* Icon added here */}
                        <span>কেন্দ্র যোগ করুণ</span>
                      </Link>
                    </li>

                    {/* Center List */}
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/CenterList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="CenterList"
                        className={`sidebar-link text-light d-flex justify-content-start align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/CenterList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-list me-3"></i>{" "}
                        {/* Icon added */}
                        <span>কেদ্রের তালিকা</span>
                      </Link>
                    </li>

                    {/* Member List Center */}
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/MemberListCenter"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="MemberListCenter"
                        className={`sidebar-link text-light d-flex justify-content-start align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/MemberListCenter"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-users me-3"></i>{" "}
                        {/* Icon added */}
                        <span>কেদ্রের সদস্য তালিকা</span>
                      </Link>
                    </li>

                    {/* Loan Details */}
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/LoanDetails" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="LoanDetails"
                        className={`sidebar-link text-light d-flex justify-content-start align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/LoanDetails"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-money-check-dollar me-3"></i>{" "}
                        {/* Icon added */}
                        <span>কেন্দ্রের ঋণ বিবরণ</span>
                      </Link>
                    </li>

                    {/* Savings Details */}
                    <li
                      className={`sidebar-item mb-2 ${
                        location.pathname === "/SavingsDetails" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="SavingsDetails"
                        className={`sidebar-link text-light d-flex justify-content-start align-items-center px-3 py-2 rounded-3 ${
                          location.pathname === "/SavingsDetails"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{
                          transition:
                            "background-color 0.3s ease, font-weight 0.3s",
                        }}
                      >
                        <i className="fa-solid fa-piggy-bank me-3"></i>{" "}
                        {/* Icon added */}
                        <span>কেন্দ্রের সঞ্চয় বিবরণ</span>
                      </Link>
                    </li>

                    <li className="sidebar-item">
                      <a
                        href="#"
                        className="sidebar-link text-light d-flex align-items-center hover-bg"
                      >
                        কেদ্রের হিসাব
                      </a>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2${
                    activeMenu === "branch" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "branch" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("branch")}
                    aria-expanded={activeMenu === "branch"}
                    style={{
                      fontWeight: activeMenu === "branch" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-building me-2 me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">শাঁখা</span>{" "}
                      {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "branch"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="branch"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "branch" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/OpenBranch" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="OpenBranch"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/OpenBranch"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-plus-circle me-2"></i>{" "}
                        {/* Icon for "Add Branch" */}
                        শাঁখা যোগ করুণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/BranchList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="BranchList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/BranchList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-list me-2"></i>{" "}
                        {/* Icon for "Branch List" */}
                        শাখার তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/BranchMemberList"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="BranchMemberList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/BranchMemberList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-users me-2"></i>{" "}
                        {/* Icon for "Branch Member List" */}
                        শাখার সদস্য তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/LoanDetailsForBranch"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="LoanDetailsForBranch"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/LoanDetailsForBranch"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-hand-holding-dollar me-2"></i>{" "}
                        {/* Icon for "Branch Loan Details" */}
                        শাখার ঋণের তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/SavingsDetailsFroBranch"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="SavingsDetailsFroBranch"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/SavingsDetailsFroBranch"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-piggy-bank me-2"></i>{" "}
                        {/* Icon for "Branch Savings Details" */}
                        শাখার সঞ্চয়ের তালিকা
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "loan" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "loan" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("loan")}
                    aria-expanded={activeMenu === "loan"}
                    style={{
                      fontWeight: activeMenu === "loan" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-money-bill-wave me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">ঋণ</span> {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "loan"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="loan"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "loan" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/OpenLoan" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="OpenLoan"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/OpenLoan"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-hand-holding-dollar me-2"></i>{" "}
                        {/* Icon for "Distribute Loan" */}
                        ঋণ বিতরণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/InstallmentList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="InstallmentList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/InstallmentList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-list-ul me-2"></i>{" "}
                        {/* Icon for "Installment List" */}
                        কিস্তির তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/InstallmentCollection"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="InstallmentCollection"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/InstallmentCollection"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-coins me-2"></i>{" "}
                        {/* Icon for "Installment Collection" */}
                        কিস্তি কালেকশন
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "savings" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "savings" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("savings")}
                    aria-expanded={activeMenu === "savings"}
                    style={{
                      fontWeight: activeMenu === "savings" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-piggy-bank me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">সঞ্চয়</span>{" "}
                      {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "savings"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="savings"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "savings" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/OpenSavings" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="OpenSavings"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/OpenSavings"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-folder-plus me-2"></i>{" "}
                        {/* Icon for "Open Savings" */}
                        সঞ্চয় খুলুন
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/SavingList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="SavingList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/SavingList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-list-alt me-2"></i>{" "}
                        {/* Icon for "Savings List" */}
                        সঞ্চয় তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/SavingsCollection"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="SavingsCollection"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/SavingsCollection"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-coins me-2"></i>{" "}
                        {/* Icon for "Savings Collection" */}
                        সঞ্চয় কালেকশন
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/SavingsWithdraw" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="SavingsWithdraw"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/SavingsWithdraw"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-hand-holding-usd me-2"></i>{" "}
                        {/* Icon for "Savings Withdrawal" */}
                        সঞ্চয় উত্তলন
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "Office" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "Office" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("Office")}
                    aria-expanded={activeMenu === "Office"}
                    style={{
                      fontWeight: activeMenu === "Office" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-building me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">অফিস</span>{" "}
                      {/* Text label */}
                    </div>

                    <i
                      className={`fa-solid ${
                        activeMenu === "Office"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="Office"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "Office" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/WorkerAdmission" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="WorkerAdmission"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/WorkerAdmission"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-user-plus me-2"></i>{" "}
                        {/* Icon for Worker Admission */}
                        অফিস কর্মী যোগ করুণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/WorkerDetails" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="WorkerDetails"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/WorkerDetails"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-id-badge me-2"></i>{" "}
                        {/* Icon for Worker Details */}
                        কর্মী বিবরণ ও ট্র্যান্সফার
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/Designation" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="Designation"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/Designation"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-user-tag me-2"></i>{" "}
                        {/* Icon for Designation */}
                        পদবী যোগ করুণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/Salary" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="Salary"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/Salary"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-coins me-2"></i>{" "}
                        {/* Icon for Salary */}
                        বেতন তৈরি করুণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/SalaryList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="SalaryList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/SalaryList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-file-invoice-dollar me-2"></i>{" "}
                        {/* Icon for Salary List */}
                        বেতন বিবরণ
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/OfficeCollection"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="OfficeCollection"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/OfficeCollection"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-cash-register me-2"></i>{" "}
                        {/* Icon for Office Collection */}
                        অফিস জমা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/Voucher" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="Voucher"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/Voucher"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-receipt me-2"></i>{" "}
                        {/* Icon for Voucher */}
                        ভাউচার
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "account" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "account" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("account")}
                    aria-expanded={activeMenu === "account"}
                    style={{
                      fontWeight: activeMenu === "account" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-calculator me-3 "
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">হিসাব</span>{" "}
                      {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "account"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>
                  <ul
                    id="account"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "account" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/AllMemberList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="AllMemberList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/AllMemberList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-users me-2"></i>{" "}
                        {/* Icon for All Member List */}
                        সকল সদস্য তালিকা
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/LoanPortfolioStatement"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="LoanPortfolioStatement"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/LoanPortfolioStatement"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-file-invoice me-2"></i>{" "}
                        {/* Icon for Loan Portfolio Statement */}
                        Loan Portfolio Statement
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/BalanceSheet" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="BalanceSheet"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/BalanceSheet"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-balance-scale me-2"></i>{" "}
                        {/* Icon for Balance Sheet */}
                        Balance Sheet
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/DailyDepositRegister"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="DailyDepositRegister"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/DailyDepositRegister"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-calendar-day me-2"></i>{" "}
                        {/* Icon for Daily Deposit Register */}
                        Daily Deposit Register
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/MonthlyServiceChargeStatement"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="MonthlyServiceChargeStatement"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/MonthlyServiceChargeStatement"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-file-alt me-2"></i>{" "}
                        {/* Icon for Monthly Service Charge Statement */}
                        Monthly Service Charge Statement
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/IncomeExpenseReport"
                          ? "active"
                          : ""
                      }`}
                    >
                      <Link
                        to="IncomeExpenseReport"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/IncomeExpenseReport"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-chart-line me-2"></i>{" "}
                        {/* Icon for Income Expense Report */}
                        Income Expense Report
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "auth" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "auth" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("auth")}
                    aria-expanded={activeMenu === "auth"}
                    style={{
                      fontWeight: activeMenu === "auth" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-regular fa-user me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">Auth</span>{" "}
                      {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "auth"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="auth"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "auth" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/signup" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="signup"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/signup"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-regular fa-user-plus me-2"></i>{" "}
                        {/* Icon for Account Create */}
                        Account Create
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/UserEdit" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="UserEdit"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/UserEdit"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-regular fa-user-pen me-2"></i>{" "}
                        {/* Icon for User Update */}
                        User Update
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/UserList" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="UserList"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/UserList"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-users me-2"></i>{" "}
                        {/* Icon for User List */}
                        User List
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`sidebar-item mb-2 ${
                    activeMenu === "Permission" ? "active" : ""
                  }`}
                >
                  <a
                    href="#"
                    className={`sidebar-link d-flex justify-content-between align-items-center px-3 py-2 rounded-3 text-light ${
                      activeMenu === "Permission" ? "bg-info" : "hover-bg"
                    }`}
                    onClick={() => handleMenuClick("Permission")}
                    aria-expanded={activeMenu === "Permission"}
                    style={{
                      fontWeight:
                        activeMenu === "Permission" ? "bold" : "normal",
                      transition:
                        "background-color 0.3s ease, font-weight 0.3s ease",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-start py-2 px-3 hover-bg rounded-3">
                      <i
                        className="fa-solid fa-user-shield me-3 text-light"
                        style={{ fontSize: "1.2rem" }}
                      ></i>{" "}
                      {/* Icon added with spacing */}
                      <span className="text-light">অনুমতি</span>{" "}
                      {/* Text label */}
                    </div>
                    <i
                      className={`fa-solid ${
                        activeMenu === "Permission"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </a>

                  <ul
                    id="Permission"
                    className={`sidebar-dropdown list-unstyled collapse ${
                      activeMenu === "Permission" ? "show" : ""
                    }`}
                    data-bs-parent="#sidebar"
                  >
                    <li
                      className={`sidebar-item ${
                        location.pathname === "/Permission" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="Permission"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/Permission"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-user-shield me-2"></i>{" "}
                        {/* Icon for Permission */}
                        অনুমতি
                      </Link>
                    </li>

                    <li
                      className={`sidebar-item ${
                        location.pathname === "/Review" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="Review"
                        className={`sidebar-link text-light d-flex align-items-center ${
                          location.pathname === "/Review"
                            ? "bg-info"
                            : "hover-bg"
                        }`}
                        style={{ transition: "background-color 0.3s ease" }}
                      >
                        <i className="fa-solid fa-clipboard-check me-2"></i>{" "}
                        {/* Icon for Review */}
                        পুনঃনিরীক্ষণ
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4"></main>
      </div>
    </div>
  );
};

export default SideBar;
