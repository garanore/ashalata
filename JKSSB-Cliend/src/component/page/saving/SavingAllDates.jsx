// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Import axios here

const MEMBER_LIST_CENTER_ROUTE = "/home/SavingsDetails";

const SavingAllDates = () => {
  const location = useLocation();
  const SavingID = location.state ? location.state.SavingID : null;
  const navigate = useNavigate();
  const [AllSaving, setAllSaving] = useState({});
  const [totalSavingAmount, setTotalSavingAmount] = useState(0);
  const [savingDetails, setSavingDetails] = useState([]);
  const [designations, setDesignations] = useState({});

  useEffect(() => {
    if (SavingID) {
      // Fetch saving data
      fetch(`http://localhost:5000/get-saving-savingid/${SavingID}`)
        .then((res) => res.json())
        .then(async (data) => {
          const savingData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllSaving(savingData);
        })
        .catch((error) => console.error("Error fetching saving data:", error));

      // Fetch total saving amount
      fetch(`http://localhost:5000/saving-collection-total/${SavingID}`)
        .then((res) => res.json())
        .then((data) => {
          const totalAmount = data.total || 0;
          setTotalSavingAmount(totalAmount);
        })
        .catch((error) => {
          console.error("Error fetching total saving data:", error);
          setTotalSavingAmount(0);
        });

      // Fetch saving collection details
      fetch(`http://localhost:5000/saving-collection-date-amount/${SavingID}`)
        .then((res) => res.json())
        .then(async (data) => {
          setSavingDetails(data.savingDetails || {});

          // Fetch account names for each submittedBy user
          const savingDetails = data.savingDetails || {};
          if (savingDetails.submittedBy) {
            const updatedDesignations = {};
            await Promise.all(
              savingDetails.submittedBy.map(async (submittedBy) => {
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
          console.error("Error fetching saving collection details:", error)
        );
    }
  }, [SavingID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  // Conditional rendering to handle loading state
  if (!AllSaving || Object.keys(AllSaving).length === 0) {
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
                <i className="fas fa-calendar-check"></i> সঞ্চয়ের বিস্তারিত
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
              htmlFor="SavingID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> সঞ্চয় ID
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
                name="SavingID"
                className="form-control border-primary"
                defaultValue={AllSaving.SavingID}
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
                defaultValue={AllSaving.memberID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="SavingName"
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
                name="SavingName"
                defaultValue={AllSaving.SavingName}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="SavingMobile"
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
                id="SavingMobile"
                className="form-control border-primary"
                value={AllSaving.SavingMobile}
                readOnly
              ></input>
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="SavingType"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-check-alt"></i> সঞ্চয়ের ধরণ
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
                name="SavingType"
                defaultValue={AllSaving.SavingType}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="SavingTime"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-check-alt"></i> সঞ্চয়ের সময়
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
                name="SavingTime"
                defaultValue={AllSaving.SavingTime}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="TotalSavingAmount"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-check-alt"></i> মোট সঞ্চয়ের পরিমাণ
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
                name="TotalSavingAmount"
                value={new Intl.NumberFormat("en-IN", {
                  maximumFractionDigits: 0,
                }).format(totalSavingAmount)}
                // value={totalSavingAmount}
                readOnly
              />
            </div>
          </div>

          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>সঞ্চয়ের পরিমাণ</th>
                  <th>সঞ্চয়ের সংখ্যা</th>
                  <th>উত্তোলনকারী</th>
                  <th>পদবী</th>
                </tr>
              </thead>
              <tbody>
                {savingDetails.savingCollecting &&
                  savingDetails.savingCollectionDate &&
                  savingDetails.savingCollecting.map((collecting, index) => (
                    <tr key={index}>
                      <td>{savingDetails.savingCollectionDate[index]}</td>
                      <td>
                        {new Intl.NumberFormat("en-IN", {
                          maximumFractionDigits: 0,
                        }).format(savingDetails.savingCollecting[index])}
                      </td>
                      <td>{savingDetails.SavingCount[index]}</td>
                      <td>
                        {designations[savingDetails.submittedBy[index]]
                          ? designations[savingDetails.submittedBy[index]]
                              .accountName
                          : savingDetails.submittedBy[index]}
                      </td>
                      <td>
                        {designations[savingDetails.submittedBy[index]]
                          ? designations[savingDetails.submittedBy[index]]
                              .designation
                          : savingDetails.submittedBy[index]}
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

export default SavingAllDates;
