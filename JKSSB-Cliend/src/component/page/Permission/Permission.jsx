// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./Permission.css"; // Import the CSS file
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/center.css";

import GrantMember from "../Permission/Member/GrantMember";
import CenterGrant from "../Permission/Center/GrantCenter";
import LoanGrant from "../Permission/Loan/GrantLoan";
import UserGrant from "../Permission/User/GrantUser";

const Permission = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="bg-light container-fluid">
      <div>
        <div className="row mb-4">
          <div className="col">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#f0f4f8", // Soft background for the header
                borderRadius: "10px", // Rounded edges for a modern look
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
              }}
            >
              <h2
                className="text-center mb-0"
                style={{
                  fontWeight: "bold",
                  color: "#2D3748",
                  fontSize: "2rem", // Larger text for prominence
                }}
              >
                <i className="fas fa-gavel"></i> অনুমতি
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #2D3748", // Thicker line for emphasis
                marginTop: "10px",
              }}
            />
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <label
            htmlFor="branchSelect"
            className="form-label"
            style={{
              fontWeight: "bold",
              color: "#2D3748",
              fontSize: "0.95rem",
            }}
          >
            <i className="fas fa-gavel"></i> অনুমতি দেওয়ার জন্য বাছাই করুন
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-primary text-white"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-gavel"></i>
            </span>
            <select
              className="form-select border-primary"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">--------</option>
              <option value="grant">সদস্য অনুমতি</option>
              <option value="CenterGrant">কেন্দ্র অনুমতি</option>
              <option value="LoanGrant">ঋণ অনুমতি</option>
              <option value="UserGrant">User Grant</option>
            </select>
          </div>
        </div>

        {selectedOption === "grant" && (
          <div className="mt-5">
            <GrantMember />
          </div>
        )}

        {selectedOption === "CenterGrant" && (
          <div className="mt-5">
            <CenterGrant />
          </div>
        )}
        {selectedOption === "LoanGrant" && (
          <div className="mt-5">
            <LoanGrant />
          </div>
        )}
        {selectedOption === "UserGrant" && (
          <div className="mt-5">
            <UserGrant />
          </div>
        )}
      </div>
    </div>
  );
};

export default Permission;
