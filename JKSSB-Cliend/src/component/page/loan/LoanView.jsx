//Every Loan View

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/LoanDetails";

const LoanView = () => {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();
  const [allLoans, setAllLoans] = useState({});

  useEffect(() => {
    if (loanID) {
      fetch(`http://localhost:5000/get-loan-loanid/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          // If data is an array, access the first item
          const loanData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllLoans(loanData);
        })
        .catch((error) => console.error("Error fetching loan data:", error));
    }
  }, [loanID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  // // // Conditional rendering to handle loading state
  // if (!allLoans || Object.keys(allLoans).length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form>
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
                <i className="fas fa-money-bill-wave"></i> ঋণ বিস্তারিত
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

        <div className="row  g-4  mt-5">
          <div className="col-md-3">
            <label
              htmlFor="loanID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> Loan ID
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                type="text"
                name="loanID"
                className="form-control border-primary"
                defaultValue={allLoans.loanID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="installmentStart"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-calendar-alt"></i> কিস্তি শুরু
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-calendar-alt"></i>
              </span>
              <input
                type="text"
                name="installmentStart"
                className="form-control border-primary"
                value={allLoans.installmentStart || ""} // Check if allLoans.installmentStart exists, if not, use an empty string
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> সদস্য ID
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberID"
                defaultValue={allLoans.memberID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="OLname"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user"></i> সদস্য নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="OLname"
                defaultValue={allLoans.OLname}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="fathername"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-friends"></i> পিতা/স্বামীর নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-friends"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="fathername"
                defaultValue={allLoans.fathername}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="OLbranch"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-code-branch"></i> শাখা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-code-branch"></i>
              </span>
              <input
                type="text"
                id="OLbranch"
                className="form-select border-primary"
                value={allLoans.OLbranch}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="OLcenter"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-map-marker-alt"></i> কেন্দ্র
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <input
                type="text"
                id="OLcenter"
                className="form-select border-primary"
                value={allLoans.OLcenter}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="OLmobile"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-mobile-alt"></i> মোবাইল
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-mobile-alt"></i>
              </span>
              <input
                type="number"
                id="OLmobile"
                className="form-control border-primary"
                value={allLoans.OLmobile}
                readOnly
              ></input>
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="loanType"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-check-alt"></i> ঋণের ধরণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-money-check-alt"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="loanType"
                defaultValue={allLoans.loanType}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="OLamount"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> ঋণের পরিমাণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-money-bill-wave"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="OLamount"
                defaultValue={allLoans.OLamount}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="OLtotal"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> মোট টাকা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-money-bill-wave"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="OLtotal"
                defaultValue={allLoans.OLtotal}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="installment"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> কিস্তির পরিমাণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-money-bill-wave"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="installment"
                defaultValue={allLoans.installment}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="CenterDay"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-calendar-day"></i> কেন্দ্র বার
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-calendar-day"></i>
              </span>
              <input
                className="form-select border-primary"
                type="text"
                name="installment"
                defaultValue={allLoans.CenterDay}
                readOnly
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-5">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-primary btn-md position-relative"
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3"; // Darker shade on hover
                e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge button on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff"; // Back to original color
                e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
              }}
            >
              <i className="fas fa-times" style={{ marginRight: "5px" }}></i>{" "}
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanView;
