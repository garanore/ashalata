// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "./NewNavBar.css";
import axios from "axios";

const NavBar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [accountName, setAccountName] = useState("");
  const [, setEmail] = useState("");
  const [, setWorkerData] = useState(null);

  useEffect(() => {
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);

      // Get the email from localStorage
      const Emails = Object.keys(parsedData)
        .filter((key) => key.startsWith("email"))
        .map((key) => parsedData[key]);

      const email = Emails[0] || "Unknown";
      setEmail(email);

      // If email exists and is not 'Unknown', call the API to get the worker data
      if (email !== "Unknown") {
        axios
          .get(`http://localhost:5000/get-worker-by-mail/${email}`)
          .then((response) => {
            const workerData = response.data;

            // Check if the worker has an image and set it as the userImage
            if (workerData.image) {
              setUserImage(workerData.image);
            } else {
              // Fallback to default image if no worker image is found
              setUserImage(
                "https://media.istockphoto.com/id/1915378858/photo/smiling-caucasian-young-businesswoman-use-tablet-app-for-social-networks-presentation-business.jpg?s=2048x2048&w=is&k=20&c=z2zrWm9dUCUfKMAmEIxrek1LtSdJukkPoOqq0qJgBZE="
              );
            }

            // You can store the worker data in a state variable if needed
            setWorkerData(workerData); // Assuming you have a state like setWorkerData
          })
          .catch((error) => {
            console.error("Error fetching worker data:", error.message);
          });
      }
    }

    // Retrieve accountName from localStorage
    const storedAccountName = localStorage.getItem("accountName");

    // Retrieve user image from localStorage (if not set by the API call)
    const storedUserImage = localStorage.getItem("userImage"); // Assuming user image is stored

    // Set accountName if found
    if (storedAccountName) {
      setAccountName(storedAccountName);
    }

    // If no worker image, set fallback or stored user image
    if (!storedUserImage) {
      setUserImage(
        "https://media.istockphoto.com/id/1915378858/photo/smiling-caucasian-young-businesswoman-use-tablet-app-for-social-networks-presentation-business.jpg?s=2048x2048&w=is&k=20&c=z2zrWm9dUCUfKMAmEIxrek1LtSdJukkPoOqq0qJgBZE="
      );
    }
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mt-2 ">
      <div className="navbar-collapse navbar">
        <h3 className="site-name mx-auto" aria-label="Site Name">
          <a href="/home" style={{ textDecoration: "none", color: "inherit" }}>
            আশা লতা সংস্থা
          </a>
        </h3>

        <div className="d-flex align-items-center">
          <div
            className="search-icon me-3"
            style={{ cursor: "pointer" }}
            onClick={toggleSearch}
          >
            <i className="fa fa-search fa-lg" style={{ color: "#2f3542" }}></i>
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
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1e90ff")}
              >
                Search
              </button>
            </form>
          )}

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

            {/* dispaly logged user name */}

            <span className="navbar-text mx-2 px-3 py-1 rounded-pill shadow-sm AccountName">
              {accountName}
            </span>

            {/* User Image */}
            <div className="user-image-container">
              <img
                src={userImage}
                alt="User"
                className="user-image rounded-circle ms-2 shadow-sm me-4"
              />
              <img
                src={userImage}
                alt="User Pop-up"
                className="user-image-popup mt-5 me-5"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
