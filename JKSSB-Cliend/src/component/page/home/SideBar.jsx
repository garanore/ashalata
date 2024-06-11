// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? "" : menu);
  };

  return (
    <div className="navbar-expand-sm">
      <div className="">
        <div className="">
          {/* <!-- Sidebar --> */}
          <aside id="sidebar" className="js-sidebar ">
            <div className="h-100">
              <div className="sidebar-logo">{/* <a href="#"></a> */}</div>

              <div>
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
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("member")}
                      aria-expanded={activeMenu === "member"}
                    >
                      <i className="fa-solid fa-file-lines pe-2"></i>
                      সদস্য
                    </a>

                    <ul
                      id="member"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        activeMenu === "member" ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/MemberAdmission"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="MemberAdmission" className="sidebar-link">
                          সদস্য ভর্তি করুণ
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* সদস্য শেষ */}

                  {/* কেন্দ্র শুরু */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "center" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("center")}
                      aria-expanded={activeMenu === "center"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      কেন্দ্র
                    </a>
                    <ul
                      id="center"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        activeMenu === "center" ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/OpenCenter" ? "active" : ""
                        }`}
                      >
                        <Link to="OpenCenter" className="sidebar-link">
                          কেন্দ্র যোগ করুণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/CenterList" ? "active" : ""
                        }`}
                      >
                        <Link to="CenterList" className="sidebar-link">
                          কেদ্রের তালিকা
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/MemberListCenter"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="MemberListCenter" className="sidebar-link">
                          কেদ্রের সদস্য তালিকা
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/LoanDetails" ? "active" : ""
                        }`}
                      >
                        <Link to="LoanDetails" className="sidebar-link">
                          কেন্দ্রের ঋণ বিবরণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/SavingsDetails"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="SavingsDetails" className="sidebar-link">
                          কেন্দ্রের সঞ্চয় বিবরণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                          কেদ্রের হিসাব
                        </a>
                      </li>
                    </ul>
                  </li>

                  {/* কেন্দ্র শেষ  */}

                  {/* শাঁখা শুরু */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "branch" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("branch")}
                      aria-expanded={activeMenu === "branch"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      শাঁখা
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
                        <Link to="OpenBranch" className="sidebar-link">
                          শাঁখা যোগ করুণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/BranchList" ? "active" : ""
                        }`}
                      >
                        <Link to="BranchList" className="sidebar-link">
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
                        <Link to="BranchMemberList" className="sidebar-link">
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
                          className="sidebar-link"
                        >
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
                          className="sidebar-link"
                        >
                          শাখার সঞ্চয়ের তালিকা
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* শাঁখা শেষ  */}

                  {/* ঋণ শুরু  */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "loan" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("loan")}
                      aria-expanded={activeMenu === "loan"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      ঋণ
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
                        <Link to="OpenLoan" className="sidebar-link">
                          ঋণ বিতরণ
                        </Link>
                      </li>

                      <li
                        className={`sidebar-item ${
                          location.pathname === "/InstallmentList"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="InstallmentList" className="sidebar-link">
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
                          className="sidebar-link"
                        >
                          কিস্তি কালেকশন
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* ঋণ শেষ  */}

                  {/* সঞ্চয় শুরু  */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "savings" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("savings")}
                      aria-expanded={activeMenu === "savings"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      সঞ্চয়
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
                        <Link to="OpenSavings" className="sidebar-link">
                          সঞ্চয় খুলুন
                        </Link>
                      </li>

                      <li
                        className={`sidebar-item ${
                          location.pathname === "/SavingList" ? "active" : ""
                        }`}
                      >
                        <Link to="SavingList" className="sidebar-link">
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
                        <Link to="SavingsCollection" className="sidebar-link">
                          সঞ্চয় কালেকশন
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/SavingsWithdraw"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="SavingsWithdraw" className="sidebar-link">
                          সঞ্চয় উত্তলন
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* সঞ্চয় শেষ  */}

                  {/* অফিস শুরু  */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "Office" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("Office")}
                      aria-expanded={activeMenu === "Office"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      অফিস
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
                          location.pathname === "/WorkerAdmission"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="WorkerAdmission" className="sidebar-link">
                          অফিস কর্মী যোগ করুণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/WorkerDetails" ? "active" : ""
                        }`}
                      >
                        <Link to="WorkerDetails" className="sidebar-link">
                          অফিস কর্মী বিবরণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/WorkerTransfer"
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link to="WorkerTransfer" className="sidebar-link">
                          অফিস কর্মী ট্র্যান্সফার
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/Designation" ? "active" : ""
                        }`}
                      >
                        <Link to="Designation" className="sidebar-link">
                          পদবি যোগ করুণ
                        </Link>
                      </li>
                      <li
                        className={`sidebar-item ${
                          location.pathname === "/Salary" ? "active" : ""
                        }`}
                      >
                        <Link to="Salary" className="sidebar-link">
                          বেতন তৈরি করুণ
                        </Link>
                      </li>

                      <li
                        className={`sidebar-item ${
                          location.pathname === "/SalaryList" ? "active" : ""
                        }`}
                      >
                        <Link to="SalaryList" className="sidebar-link">
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
                        <Link to="OfficeCollection" className="sidebar-link">
                          অফিস জমা
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* অফিস শেষ  */}

                  {/* হিসাব শুরু */}
                  <li
                    className={`sidebar-item ${
                      activeMenu === "account" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("account")}
                      aria-expanded={activeMenu === "account"}
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      হিসাব
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
                        <Link to="AllMemberList" className="sidebar-link">
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
                          className="sidebar-link"
                        >
                          Loan Portfolio Statement
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
                          className="sidebar-link"
                        >
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
                          className="sidebar-link"
                        >
                          Monthly Service Charge Statement
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* হিসাব শেষ  */}

                  <li
                    className={`sidebar-item ${
                      activeMenu === "auth" ? "active" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      onClick={() => handleMenuClick("auth")}
                      aria-expanded={activeMenu === "auth"}
                    >
                      <i className="fa-regular fa-user pe-2"></i>
                      Auth
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
                        <Link to="signup" className="sidebar-link">
                          Account Create
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
    </div>
  );
};

export default SideBar;
