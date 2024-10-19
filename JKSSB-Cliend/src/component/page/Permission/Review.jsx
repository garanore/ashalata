// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./Permission.css"; // Import the CSS file
import MemberReview from "./Member/MemberReview";
import CenterReview from "./Center/ReviewCenter";
import LoanReview from "./Loan/ReviewLoan";
import SavingReview from "./Saving/ReviewSaving";
import WorkerReview from "./Worker/ReviewWorker";

const Review = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
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
                <i className="fas fa-search"></i> পুনঃনিরীক্ষণ
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
            <i className="fas fa-search"></i> পুনঃনিরীক্ষণের জন্য বাছাই করুণ
          </label>
          <div className="input-group shadow-sm">
            <span
              className="input-group-text bg-primary text-white"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-search"></i>
            </span>
            <select
              className="form-select border-primary"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">--------</option>
              <option value="review">সদস্য পুনঃনিরীক্ষণ</option>
              <option value="CenterReview">কেন্দ্র পুনঃনিরীক্ষণ</option>
              <option value="LoanReview">ঋণ পুনঃনিরীক্ষণ</option>
              <option value="SavingReview">সঞ্চয় পুনঃনিরীক্ষণ</option>
              <option value="WorkerReview">কর্মী পুনঃনিরীক্ষণ</option>
            </select>
          </div>
        </div>

        {selectedOption === "review" && (
          <div className="mt-5">
            <MemberReview />
          </div>
        )}

        {selectedOption === "CenterReview" && (
          <div className="mt-5">
            <CenterReview />
          </div>
        )}
        {selectedOption === "LoanReview" && (
          <div className="mt-5">
            <LoanReview />
          </div>
        )}
        {selectedOption === "SavingReview" && (
          <div className="mt-5">
            <SavingReview />
          </div>
        )}
        {selectedOption === "WorkerReview" && (
          <div className="mt-5">
            <WorkerReview />
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
