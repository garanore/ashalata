// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="navbar-expand-sm">
      <div className=" ">
        <div className="">
          {/* <!-- Sidebar --> */}
          <aside id="sidebar" className="js-sidebar ">
            <div className="h-100">
              <div className="sidebar-logo">{/* <a href="#"></a> */}</div>

              <div>
                <ul className="sidebar-nav">
                  <li className="sidebar-header">Admin Elements</li>
                  <li className="sidebar-item">
                    <Link to="/Home" className="sidebar-link">
                      <i className="fa-solid fa-list pe-2"></i>
                      ড্যাশবোর্ড
                    </Link>
                  </li>

                  {/* সদস্য শুরু  */}

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#member"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-file-lines pe-2"></i>
                      সদস্য
                    </a>

                    <ul
                      id="member"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="/MemberAdmission" className="sidebar-link">
                          সদস্য ভর্তি করুণ
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* সদস্য শেষ */}

                  {/* কেন্দ্র শুরু */}

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#center"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      কেন্দ্র
                    </a>
                    <ul
                      id="center"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="OpenCenter" className="sidebar-link">
                          কেন্দ্র যোগ করুণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="CenterList" className="sidebar-link">
                          কেদ্রের তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="MemberListCenter" className="sidebar-link">
                          কেদ্রের সদস্য তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="LoanDetails" className="sidebar-link">
                          কেন্দ্রের ঋণ বিবরণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
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

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#branch"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      শাঁখা
                    </a>
                    <ul
                      id="branch"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="OpenBranch" className="sidebar-link">
                          শাঁখা যোগ করুণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="BranchList" className="sidebar-link">
                          শাখার তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="BranchMemberList" className="sidebar-link">
                          শাখার সদস্য তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link
                          to="LoanDetailsForBranch"
                          className="sidebar-link"
                        >
                          শাখার ঋণের তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
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

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#loan"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      ঋণ
                    </a>
                    <ul
                      id="loan"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="OpenLoan" className="sidebar-link">
                          ঋণ বিতরণ
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link to="InstallmentList" className="sidebar-link">
                          কিস্তির তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
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

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#savings"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      সঞ্চয়
                    </a>
                    <ul
                      id="savings"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="OpenSavings" className="sidebar-link">
                          সঞ্চয় খুলুন
                        </Link>
                      </li>

                      <li className="sidebar-item">
                        <Link to="SavingList" className="sidebar-link">
                          সঞ্চয় তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="SavingsCollection" className="sidebar-link">
                          সঞ্চয় কালেকশন
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="SavingsWithdraw" className="sidebar-link">
                          সঞ্চয় উত্তলন
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* সঞ্চয় শেষ  */}

                  {/* অফিস শুরু  */}
                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#Office"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      অফিস
                    </a>
                    <ul
                      id="Office"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="WorkerAdmission" className="sidebar-link">
                          অফিস কর্মী যোগ করুণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="WorkerDetails" className="sidebar-link">
                          অফিস কর্মী বিবরণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="WorkerTransfer" className="sidebar-link">
                          অফিস কর্মী ট্র্যান্সফার
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="Designation" className="sidebar-link">
                          পদবি যোগ করুণ
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="Salary" className="sidebar-link">
                          বেতন
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="OfficeCollection" className="sidebar-link">
                          অফিস জমা
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* অফিস শুরু  */}

                  {/* হিসাব শুরু */}

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#account"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-sliders pe-2"></i>
                      হিসাব
                    </a>
                    <ul
                      id="account"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="AllMemberList" className="sidebar-link">
                          সকল সদস্য তালিকা
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link
                          to="LoanPortfolioStatement"
                          className="sidebar-link"
                        >
                          Loan Portfolio Statement
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link
                          to="DailyDepositRegister"
                          className="sidebar-link"
                        >
                          Daily Deposit Register
                        </Link>
                      </li>
                      <li className="sidebar-item">
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

                  <li className="sidebar-item">
                    <a
                      href="#"
                      className="sidebar-link collapsed"
                      data-bs-target="#auth"
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <i className="fa-regular fa-user pe-2"></i>
                      Auth
                    </a>
                    <ul
                      id="auth"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      <li className="sidebar-item">
                        <Link to="Login" className="sidebar-link">
                          Login
                        </Link>
                      </li>
                      <li className="sidebar-item">
                        <Link to="Auth-register" className="sidebar-link">
                          Register
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
