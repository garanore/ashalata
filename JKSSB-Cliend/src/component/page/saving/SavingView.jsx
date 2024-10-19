// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/SavingsDetails";

const SavingView = () => {
  const location = useLocation();
  const SavingID = location.state ? location.state.SavingID : null;
  const navigate = useNavigate();
  const [AllSaving, setAllSaving] = useState({});
  const [totalSavingAmount, setTotalSavingAmount] = useState(0);

  useEffect(() => {
    if (SavingID) {
      // Fetch saving data
      fetch(`http://localhost:5000/get-saving-savingid/${SavingID}`)
        .then((res) => res.json())
        .then((data) => {
          // If data is an array, access the first item
          const savingData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllSaving(savingData);
        })
        .catch((error) => console.error("Error fetching saving data:", error));

      // Fetch total saving amount
      fetch(`http://localhost:5000/saving-collection-total/${SavingID}`)
        .then((res) => res.json())
        .then((data) => {
          const totalAmount = data.total || 0; // Fallback to 0 if no total is found
          setTotalSavingAmount(totalAmount);
        })
        .catch((error) => {
          console.error("Error fetching total saving data:", error);
          setTotalSavingAmount(0); // Set to 0 in case of error
        });
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
                <i className="fas fa-money-bill-wave"></i> সঞ্চয় বিস্তারিত
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
              htmlFor="installmentStart"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-calendar-alt"></i> সঞ্চয় শুরু
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
                value={AllSaving.installmentStart || ""} // Check if AllSaving.installmentStart exists, if not, use an empty string
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
              <i className="fas fa-use"></i> সদস্য নাম
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

          <div className="col-md-3">
            <label
              htmlFor="fathername"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-friends"></i> পিতা/স্বামী
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
                defaultValue={AllSaving.fathername}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="SavingBranch"
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
                id="SavingBranch"
                className="form-select border-primary"
                value={AllSaving.SavingBranch}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="SavingCenter"
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
                id="SavingCenter"
                className="form-select border-primary"
                value={AllSaving.SavingCenter}
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
                className="form-select border-primary"
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
              <i className="fas fa-money-bill-wave"></i> সময়
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
                name="SavingTime"
                defaultValue={AllSaving.SavingTime}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="SavingAmount"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> সঞ্চয়ের পরিমাণ
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
                name="SavingAmount"
                value={AllSaving.SavingAmount}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="totalSavingAmount"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> মোট সঞ্চয়ের পরিমাণ
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
                name="TotalSavingAmount"
                value={totalSavingAmount}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="CenterDay"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> কেন্দ্র বার
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
                defaultValue={AllSaving.CenterDay}
                readOnly
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mb-3 mt-5">
            <button
              type="button"
              className="btn btn-primary btn-lg shadow"
              onClick={handleCancel}
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-paper-plane"></i> Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SavingView;
