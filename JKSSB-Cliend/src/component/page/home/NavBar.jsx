// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const NavBar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const storedAccountName = localStorage.getItem("accountName");
    if (storedAccountName) {
      setAccountName(storedAccountName);
    }
  }, []);

  const handleToggleClick = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("collapsed");
    }
  };

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accountName");
    window.location.href = "/login";
  };

  return (
    <div>
      <div className="main">
        <nav className="navbar navbar-expand px-3 border-bottom">
          <button
            className="btn"
            id="sidebar-toggle"
            onClick={handleToggleClick}
            type="button"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-collapse navbar">
            <h5 className="navbar-text mx-auto" aria-label="Site Name">
              আশা লতা সংস্থা
            </h5>
            <div className="d-flex align-items-center">
              <form
                className={`d-flex ${
                  isSearchVisible ? "d-flex" : "d-none d-md-flex"
                }`}
                aria-label="Search Form"
              >
                <input
                  className="form-control me-2"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button id="search" className="btn btn-primary" type="button">
                  Search
                </button>
              </form>
              <button
                className="btn d-md-none"
                id="search-toggle"
                onClick={handleSearchClick}
                type="button"
                aria-label="Search"
              >
                <i className="fa fa-search"></i>
              </button>
              <div className="d-flex align-items-center">
                <span className="navbar-text mx-2">{accountName}</span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
