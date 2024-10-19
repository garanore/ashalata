// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const SavingsWithdraw = () => {
  const [savingID, setSavingID] = useState("");
  const [savingDetails, setSavingDetails] = useState(null);
  const [totalSavingAmount, setTotalSavingAmount] = useState(null);
  const [withDrawAmount, setWithDrawAmount] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [SavingCurrentBlance, setSavingCurrentBlance] = useState(null);
  const [calculatedInterest, setCalculatedInterest] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(""); // New state for the withdraw date
  const [lastOldWithdraw, setLastOldWithdraw] = useState(0); // State for last old withdraw amount

  useEffect(() => {
    if (totalSavingAmount !== null && withDrawAmount !== "") {
      // Ensure we have valid amounts before proceeding
      const parsedWithdrawAmount = parseFloat(withDrawAmount) || 0;
      const calculatedRemainingBalance =
        totalSavingAmount - lastOldWithdraw - parsedWithdrawAmount;

      // Handle potential floating-point issues
      const remainingBalance = parseFloat(
        calculatedRemainingBalance.toFixed(2)
      );

      setSavingCurrentBlance(remainingBalance);
    } else {
      // Default to totalSavingAmount minus last old withdrawal if no withdraw amount is set
      setSavingCurrentBlance(totalSavingAmount - lastOldWithdraw);
    }
  }, [totalSavingAmount, withDrawAmount, lastOldWithdraw]);

  const fetchSavingDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-saving-savingid/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].SavingID === id) {
          setSavingDetails(data[0]);
          fetchTotalSavingAmount(id);
          fetchLastOldWithdraw(id); // Fetch last old withdraw amount
        } else {
          setSavingDetails(null);
          setTotalSavingAmount(null);
          setWithDrawAmount("");
          setSavingCurrentBlance(null);
          setLastOldWithdraw(0); // Reset last old withdraw amount
        }
      } else {
        console.error("Error fetching saving details");
        setSavingDetails(null);
        setTotalSavingAmount(null);
        setWithDrawAmount("");
        setSavingCurrentBlance(null);
        setLastOldWithdraw(0); // Reset last old withdraw amount
      }
    } catch (error) {
      console.error("Error fetching saving details:", error);
      setSavingDetails(null);
      setTotalSavingAmount(null);
      setWithDrawAmount("");
      setSavingCurrentBlance(null);
      setLastOldWithdraw(0); // Reset last old withdraw amount
    }
  };

  const fetchTotalSavingAmount = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/saving-collection-total/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.total !== undefined) {
          setTotalSavingAmount(data.total);
        } else {
          setTotalSavingAmount(null);
          setWithDrawAmount("");
        }
      } else {
        console.error("Error fetching total saving amount");
        setTotalSavingAmount(null);
        setWithDrawAmount("");
      }
    } catch (error) {
      console.error("Error fetching total saving amount:", error);
      setTotalSavingAmount(null);
      setWithDrawAmount("");
    }
  };

  const fetchLastOldWithdraw = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/get-withDrawAmount-savingid/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        const totalWithdrawAmount = data.withDrawAmount.reduce(
          (total, amount) => total + parseFloat(amount),
          0
        );
        setLastOldWithdraw(totalWithdrawAmount);
        // Update total saving amount by subtracting last old withdraw amount
        setTotalSavingAmount((prevTotal) => prevTotal - totalWithdrawAmount);
      } else {
        setLastOldWithdraw(0);
      }
    } catch (error) {
      setLastOldWithdraw(0);
    }
  };

  const handleInputChange = (event) => {
    const id = event.target.value;
    setSavingID(id);

    if (id) {
      fetchSavingDetails(id);
    } else {
      setSavingDetails(null);
      setTotalSavingAmount(null);
      setWithDrawAmount("");
      setSavingCurrentBlance(null);
      setLastOldWithdraw(0); // Reset last old withdraw amount
    }
  };

  // Updated handleWithdrawAmountChange to consider edge cases
  const handleWithdrawAmountChange = (event) => {
    let amount = parseFloat(event.target.value) || 0;
    const maxWithdrawAmount = totalSavingAmount - 20;

    // Ensure that the amount doesn't exceed the max
    if (amount > maxWithdrawAmount) {
      amount = maxWithdrawAmount;
    }

    setWithDrawAmount(amount);

    let calculatedAmount = 0;
    if (savingDetails) {
      const { SavingType, SavingTime } = savingDetails;

      // Ensure totalSavingAmount is valid before performing calculations
      if (SavingType === "সাধারণ" && totalSavingAmount >= 200) {
        calculatedAmount = Math.round(amount * 0.06);
      } else if (SavingType === "মেয়াদি") {
        if (SavingTime === "৩ বছর") {
          calculatedAmount = Math.round(amount * 0.07);
        } else if (SavingTime === "৫ বছর") {
          calculatedAmount = Math.round(amount * 0.08);
        } else if (SavingTime === "১০ বছর") {
          calculatedAmount = Math.round(amount * 0.1);
        }
      }
    }

    setCalculatedInterest(calculatedAmount);
  };

  const handleWithdrawDateChange = (event) => {
    setWithdrawDate(event.target.value);
  };

  const handleWithdraw = async () => {
    if (savingDetails && withDrawAmount !== null && withdrawDate !== "") {
      const data = {
        savingID,
        memberID: savingDetails.memberID,
        SavingName: savingDetails.SavingName,
        fathername: savingDetails.fathername,
        SavingBranch: savingDetails.SavingBranch,
        SavingCenter: savingDetails.SavingCenter,
        SavingMobile: savingDetails.SavingMobile,
        SavingType: savingDetails.SavingType,
        SavingTime: savingDetails.SavingTime || null, // Handle empty value
        SavingCurrentBlance:
          SavingCurrentBlance !== null ? [SavingCurrentBlance] : null,
        totalSavingAmount:
          totalSavingAmount !== null ? [totalSavingAmount] : null,
        withDrawAmount: withDrawAmount !== "" ? [withDrawAmount] : null,
        calculatedInterest:
          calculatedInterest !== "" ? [calculatedInterest] : null,
        withdrawDate: withdrawDate !== "" ? [withdrawDate] : null,
      };

      try {
        const response = await fetch("http://localhost:5000/saving-withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          setSubmitMessage("Withdrawal successful!");
        } else {
          console.error("Error:", result.message);
          setSubmitMessage("Error in withdrawal process");
        }
      } catch (error) {
        setSubmitMessage(`Error: ${error.message}`);
      }
    } else {
      setSubmitMessage("Please fill in all required fields.");
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <form>
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
                    <i className="fas fa-money-bill-wave"></i> সঞ্চয় উত্তোলন
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

            <div className="row  mt-5">
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
                    id="SavingID"
                    className="form-control border-primary"
                    placeholder="সঞ্চয় ID লিখুন"
                    value={savingID}
                    onChange={handleInputChange}
                  />
                </div>
                <small className="text-muted">উদাহরণ: B01M0001S01</small>
              </div>
            </div>

            {savingDetails && (
              <div>
                <div className="row mt-3">
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-id-card"></i>
                      </span>
                      <input
                        type="text"
                        id="memberID"
                        className="form-control border-primary"
                        value={savingDetails.memberID || ""}
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
                      <i className="fas fa-user"></i> সদস্য নাম
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        id="SavingName"
                        className="form-control border-primary"
                        value={savingDetails.SavingName || ""}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-user-friends"></i>
                      </span>
                      <input
                        type="text"
                        id="fathername"
                        className="form-control border-primary"
                        value={savingDetails.fathername || ""}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-code-branch"></i>
                      </span>
                      <input
                        type="text"
                        id="SavingBranch"
                        className="form-select border-primary"
                        value={savingDetails.SavingBranch || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <input
                        id="SavingCenter"
                        type="text"
                        className="form-select border-primary"
                        value={savingDetails.SavingCenter || ""}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-mobile-alt"></i>
                      </span>
                      <input
                        type="number"
                        id="SavingMobile"
                        className="form-select border-primary"
                        value={savingDetails.SavingMobile || ""}
                        readOnly
                      />
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-check-alt"></i>
                      </span>
                      <input
                        id="SavingType"
                        className="form-control border-primary"
                        type="text"
                        name="SavingType"
                        value={savingDetails.SavingType || ""}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="SavingTime"
                        className="form-control"
                        type="text"
                        name="SavingTime"
                        value={savingDetails.SavingTime || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-3">
                    <label
                      htmlFor="totalSavings"
                      className="col-form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-money-bill-wave"></i> মোট সঞ্চয়ের
                      পরিমাণ
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="totalSavings"
                        className="form-control border-primary"
                        type="text"
                        name="totalSavings"
                        value={totalSavingAmount || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label
                      htmlFor="LastOldWithdraw"
                      className="col-form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-money-bill-wave"></i> আগের সঞ্চয়
                      উত্তোলন
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="LastOldWithdraw"
                        className="form-control border-primary"
                        type="text"
                        name="LastOldWithdraw"
                        value={lastOldWithdraw}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label
                      htmlFor="SavingCurrentBlance"
                      className="col-form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-money-bill-wave"></i> অবশিষ্ট সঞ্চয়ের
                      পরিমাণ
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="SavingCurrentBlance"
                        className="form-control border-primary"
                        type="text"
                        name="SavingCurrentBlance"
                        value={SavingCurrentBlance || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <label
                      htmlFor="WithDrawAmount"
                      className="col-form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-money-bill-wave"></i> উত্তোলনের
                      পরিমাণ
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="WithDrawAmount"
                        className="form-control border-primary"
                        type="number"
                        name="WithDrawAmount"
                        value={withDrawAmount}
                        onChange={handleWithdrawAmountChange}
                        max={totalSavingAmount - 20 || 0}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-3">
                    <label
                      htmlFor="SavingInterest"
                      className="col-form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-money-bill-wave"></i> মোট উত্তোলনের
                      পরিমাণ
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="SavingInterest"
                        className="form-control border-primary"
                        type="number"
                        name="SavingInterest"
                        value={
                          parseFloat(withDrawAmount) +
                            parseFloat(calculatedInterest) || ""
                        }
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
                      <i className="fas fa-money-bill-wave"></i> উত্তোলনের তারিখ
                    </label>
                    <div className="input-group shadow-sm">
                      <span
                        className="input-group-text bg-primary text-white"
                        style={{
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-money-bill-wave"></i>
                      </span>
                      <input
                        id="WithdrawDate"
                        className="form-control border-primary"
                        type="date"
                        value={withdrawDate}
                        onChange={handleWithdrawDateChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {savingDetails && (
              <div className="d-flex justify-content-center mb-3 mt-5">
                <button
                  type="button"
                  className="btn btn-primary btn-lg shadow"
                  onClick={handleWithdraw}
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-paper-plane"></i> Withdraw
                </button>
              </div>
            )}

            {submitMessage && (
              <div
                className="alert alert-success mt-3 d-flex align-items-center"
                role="alert"
                style={{
                  borderRadius: "0.5rem", // Rounded corners
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: "1.5rem",
                    marginRight: "10px", // Space between icon and text
                    color: "#155724", // Dark green for the icon
                  }}
                ></i>
                <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsWithdraw;
