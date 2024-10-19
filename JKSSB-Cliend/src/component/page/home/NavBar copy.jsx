// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
// import "./NavBar.css";
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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // const handleSearchClick = () => {
  //   setIsSearchVisible(!isSearchVisible);
  // };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accountName");
    window.location.href = "/login";
  };

  return (
    <div>
      <div className="">
        <nav className="navbar navbar-expand-md bg-light navbar-light  px-3 py-2 border-bottom">
          <button
            className="btn sidebar-toggle"
            id="sidebar-toggle"
            onClick={handleToggleClick}
            type="button"
            style={{
              border: "none", // No border for a cleaner look
              backgroundColor: "transparent", // Transparent background
              padding: "0.5rem", // Add some padding for better UX
              cursor: "pointer", // Show pointer to indicate interactivity
              transition: "transform 0.3s ease", // Smooth transition on toggle
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")} // Slightly larger on hover
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")} // Reset on mouse out
          >
            {/* Custom icon animation */}
            <span
              className="navbar-toggler-icon"
              style={{
                width: "24px", // Custom width for the icon
                height: "3px", // Set height for the lines
                backgroundColor: "#2f3542", // Dark gray for modern look
                display: "block", // Display as a block element
                position: "relative",
                transition: "all 0.3s ease", // Smooth animation
              }}
            ></span>
            <span
              className="navbar-toggler-icon"
              style={{
                width: "24px",
                height: "3px",
                backgroundColor: "#2f3542",
                display: "block",
                position: "relative",
                marginTop: "5px", // Space between lines
                transition: "all 0.3s ease",
              }}
            ></span>
            <span
              className="navbar-toggler-icon"
              style={{
                width: "24px",
                height: "3px",
                backgroundColor: "#2f3542",
                display: "block",
                position: "relative",
                marginTop: "5px",
                transition: "all 0.3s ease",
              }}
            ></span>
          </button>

          <div className="navbar-collapse navbar">
            <h3 className="site-name mx-auto" aria-label="Site Name">
              আশা লতা সংস্থা
            </h3>

            <div className="d-flex align-items-center">
              <div
                className="search-icon me-3"
                style={{ cursor: "pointer" }}
                onClick={toggleSearch}
              >
                <i
                  className="fa fa-search fa-lg"
                  style={{ color: "#2f3542" }}
                ></i>
              </div>
              {isSearchVisible && (
                <form
                  className="d-flex align-items-center ms-3 me-3"
                  aria-label="Search Form"
                  style={{ maxWidth: "400px" }}
                >
                  <input
                    className="form-control me-2 rounded-pill shadow-sm"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    style={{
                      padding: "0.75rem 1.5rem",
                      border: "1px solid #ced6e0",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1e90ff")}
                    onBlur={(e) => (e.target.style.borderColor = "#ced6e0")}
                  />
                  <button
                    id="search"
                    className="btn btn-primary rounded-pill shadow-sm"
                    type="button"
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#1e90ff",
                      border: "none",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#63c2ff")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#1e90ff")
                    }
                  >
                    Search
                  </button>
                </form>
              )}

              {/* <button
                className="btn d-md-none"
                id="search-toggle"
                onClick={handleSearchClick}
                type="button"
                aria-label="Search"
              >
                <i className="fa fa-search"></i>
              </button> */}

              <div className="d-flex align-items-center">
                {/* Notification Bell Icon */}
                <div className="dropdown mx-2 notification-bell me-3">
                  <i
                    className="fa fa-bell fa-lg dropdown-toggle position-relative"
                    style={{
                      cursor: "pointer",
                      color: "#2f3542", // Dark gray color for a modern look
                      transition: "color 0.3s ease", // Smooth color transition on hover
                    }}
                    id="notificationDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onMouseOver={(e) => {
                      e.target.style.color = "#ff6b81"; // Soft red on hover
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = "#2f3542"; // Original color
                    }}
                  >
                    {/* Notification count badge */}
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
                    >
                      3
                    </span>
                  </i>

                  <ul
                    className="dropdown-menu notification-dropdown shadow-lg"
                    aria-labelledby="notificationDropdown"
                    style={{
                      minWidth: "15rem", // Set a minimum width for better layout
                      backgroundColor: "#f1f2f6", // Light background color
                      border: "1px solid #ced6e0", // Light border for structure
                      borderRadius: "0.5rem", // Rounded corners for a modern look
                    }}
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{ color: "#2f3542" }}
                      >
                        Notification 1
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{ color: "#2f3542" }}
                      >
                        Notification 2
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        style={{ color: "#2f3542" }}
                      >
                        Notification 3
                      </a>
                    </li>
                  </ul>
                </div>

                <span
                  className="navbar-text mx-2 px-3 py-1 rounded-pill shadow-sm"
                  style={{
                    backgroundColor: "#f1f2f6", // Light gray background for subtle contrast
                    color: "#2f3542", // Dark gray text for a clean, modern look
                    fontWeight: "500", // Medium bold for better readability
                    fontSize: "1rem", // Adjust font size for clarity
                    border: "1px solid #ced6e0", // Light border to give the span some structure
                  }}
                >
                  {accountName}
                </span>

                <button
                  className="btn btn-danger px-4 py-2 rounded-pill shadow-sm"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ff4757", // Modern red color
                    border: "none", // No border for cleaner look
                    transition: "all 0.3s ease", // Smooth transition on hover
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#ff6b81"; // Lighter red on hover
                    e.target.style.transform = "scale(1.05)"; // Slightly larger on hover
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#ff4757"; // Original color
                    e.target.style.transform = "scale(1)"; // Reset size
                  }}
                >
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
