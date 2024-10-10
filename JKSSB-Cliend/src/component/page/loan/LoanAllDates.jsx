// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Import axios here

const MEMBER_LIST_CENTER_ROUTE = "/home/LoanDetails";

const LoanAllDates = () => {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();
  const [AllLoan, setAllLoan] = useState({});
  const [LoanDetails, setLoanDetails] = useState([]);
  const [installmentDateCount, setInstallmentDateCount] = useState(0);

  const [designations, setDesignations] = useState({});

  useEffect(() => {
    if (loanID) {
      // Fetch loan data
      fetch(`http://localhost:5000/get-loan-loanid/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          const loanData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllLoan(loanData);
        })
        .catch((error) => console.error("Error fetching loan data:", error));

      // Fetch loan collection details
      fetch(`http://localhost:5000/loan-collection-date/${loanID}`)
        .then((res) => res.json())
        .then(async (data) => {
          setLoanDetails(data.LoanDetails || {});

          // Fetch account names for each submittedBy user
          const loanDetails = data.LoanDetails || {};
          if (loanDetails.submittedBy) {
            const updatedDesignations = {};
            await Promise.all(
              loanDetails.submittedBy.map(async (submittedBy) => {
                try {
                  const userResponse = await axios.get(
                    `http://localhost:5000/get-user-username/${submittedBy}`
                  );
                  if (userResponse.data.length > 0) {
                    const { accountName, designation } = userResponse.data[0];
                    updatedDesignations[submittedBy] = {
                      accountName,
                      designation,
                    };
                  }
                } catch (error) {
                  console.error(
                    "Error fetching user designation:",
                    error.message
                  );
                }
              })
            );
            setDesignations((prevDesignations) => ({
              ...prevDesignations,
              ...updatedDesignations,
            }));
          }
        })
        .catch((error) =>
          console.error("Error fetching loan collection details:", error)
        );

      // Fetch installment dates count
      fetch(`http://localhost:5000/installment-dates-count/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setInstallmentDateCount(data[0].installmentDateCount);
          }
        })
        .catch((error) =>
          console.error("Error fetching installment dates count:", error)
        );
    }
  }, [loanID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  // Calculate TotalInstallmentTake
  const totalInstallmentTake =
    installmentDateCount * (AllLoan.installment || 0);

  // Conditional rendering to handle loading state
  if (!AllLoan || Object.keys(AllLoan).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form>
        <div className="row mb-5">
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
                <i className="fas fa-calendar-check"></i> কিস্তির বিস্তারিত
                তারিখ সমূহ
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

        <div className="row g-4 mt-5">
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
                defaultValue={AllLoan.loanID}
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
                defaultValue={AllLoan.memberID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberName"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user"></i>
              সদস্য নাম
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
                defaultValue={AllLoan.OLname}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="MemberMobile"
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
                value={AllLoan.OLmobile}
                readOnly
              />
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
                defaultValue={AllLoan.loanType}
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
              <i className="fas fa-money-bill-wave"></i> কিস্তি (টাকা)
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
                defaultValue={new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                }).format(AllLoan.installment)}
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
              <i className="fas fa-money-bill-wave"></i> মোট ঋণের পরিমাণ
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
                defaultValue={new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                }).format(AllLoan.OLtotal)}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="TotalInstallmentTake"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> কিস্তি জমা (টাকা)
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
                name="TotalInstallmentTake"
                value={new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                }).format(totalInstallmentTake)}
                // value={totalInstallmentTake}
                readOnly
              />
            </div>
          </div>

          <div className="table-responsive mt-5">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>তারিখ</th>
                  <th>কিস্তি (টাকা)</th>
                  <th>কিস্তি (সংখ্যা)</th>
                  <th>উত্তোলনকারী</th>
                  <th>পদবী</th>
                </tr>
              </thead>
              <tbody>
                {LoanDetails.installmentDate &&
                  LoanDetails.installmentDate.map((date, index) => (
                    <tr key={index}>
                      <td>{date}</td>
                      <td>
                        {new Intl.NumberFormat("en-IN", {
                          maximumFractionDigits: 0,
                        }).format(LoanDetails.installment[index])}
                      </td>

                      <td>{LoanDetails.installmentCount[index]}</td>
                      <td>
                        {
                          designations[LoanDetails.submittedBy[index]]
                            ? designations[LoanDetails.submittedBy[index]]
                                .accountName
                            : LoanDetails.submittedBy[index] // Fallback to submittedBy if accountName isn't available yet
                        }
                      </td>
                      <td>
                        {
                          designations[LoanDetails.submittedBy[index]]
                            ? designations[LoanDetails.submittedBy[index]]
                                .designation
                            : LoanDetails.submittedBy[index] // Fallback to submittedBy if accountName isn't available yet
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

export default LoanAllDates;
