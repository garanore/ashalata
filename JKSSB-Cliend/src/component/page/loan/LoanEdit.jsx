// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import { useLocation, useNavigate } from "react-router-dom";

function LoanEdit() {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();
  const [LoanEdits, setLoanEdits] = useState({});

  // State variables
  const [installmentStart, setInstallmentStart] = useState(null);
  const [OLAmount, setOLAmount] = useState(LoanEdits.OLamount || "");
  const [OLTotal, setOLTotal] = useState(LoanEdits.OLtotal || "");
  const [installment, setInstallment] = useState(LoanEdits.installment || "");
  const [loanType, setLoanType] = useState("");
  const [withoutInterst, setWithoutInterest] = useState("");
  const [onlyInterest, setOnlyInterest] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [installmentCount, setInstallmentCount] = useState(46); // Default installment count
  const [totalInstallment, setTotalInstallment] = useState(46);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-loan-loanid/${loanID}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const loanData = data[0];
          setLoanEdits(loanData);
          setLoanType(loanData.loanType); // Set loanType state

          // Set the amounts and other values
          setOLAmount(loanData.OLamount);
          setOLTotal(loanData.OLtotal);
          setInstallment(loanData.installment);
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (loanID) {
      fetchLoanData();
    }
  }, [loanID]);

  //----------------------------------------------------------------
  // Handle date change
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`20${year}`, month - 1, day); // Adjust for the year format and month (0-based index)
  };

  const handleDateChange = (date) => {
    setInstallmentStart(date); // Update the state with the selected date
    setLoanEdits((prevState) => ({
      ...prevState,
      installmentStart: moment(date).format("DD-MM-YY"), // Format the date and update the LoanEdits state
    }));
  };

  // Assuming LoanEdits contains the initial loanType value from the backend
  useEffect(() => {
    if (LoanEdits.loanType) {
      setLoanType(LoanEdits.loanType); // Initialize loanType with value from LoanEdits
    }
  }, [LoanEdits.loanType]);

  const loanTypeTranslations = {
    normal: "সাধারণ ঋণ",
    tubewell: "নলকূপ ঋণ",
    farmer: "কৃষি ঋণ",
    sme: "এস এম ই ঋণ",
    emergency: "জরুরী ঋণ",
    disaster: "দুর্যোগ ঋণ",
    daily: "দৈনিক ঋণ",
  };

  // Handle loan type change
  const handleLoanTypeChange = (e) => {
    const selectedLoanType = e.target.value;
    setLoanType(selectedLoanType); // This updates the selected loan type
    setOLAmount(""); // Reset other related fields as needed
    setOLTotal("");
    const count = getInstallmentCount(selectedLoanType);
    setInstallmentCount(count);
    setTotalInstallment(count);
  };

  // Get installment count based on loan type
  const getInstallmentCount = (type) => {
    switch (type) {
      case "daily":
        return 110;
      case "sme":
        return 12;
      case "emergency":
        return 1;
      default:
        return 46; // Default installment count
    }
  };

  // Handle amount change
  const handleAmountChange = (e) => {
    const enteredAmount = +e.target.value;
    let interestRate = 0.15;
    let installmentCount = getInstallmentCount(loanType); // Get installment count based on loan type

    if (loanType === "daily") {
      interestRate = 0.1;
    }

    const calculatedTotal = enteredAmount * (1 + interestRate); // Calculate total including interest
    setOLAmount(enteredAmount);

    const calculatedInstallment = calculatedTotal / installmentCount; // Assuming 46 installments
    setInstallment(Math.round(calculatedInstallment)); // Assuming installment is calculated

    const calculatedWithoutInterest = enteredAmount / installmentCount; // Assuming 46 installments without interest
    setWithoutInterest(Math.round(calculatedWithoutInterest));

    const calculatedOnlyInterest =
      calculatedInstallment - calculatedWithoutInterest; // Assuming only interest
    setOnlyInterest(Math.round(calculatedOnlyInterest)); // Assuming only interest

    setOLTotal(calculatedTotal.toFixed(2)); // Assuming total is calculated with two decimal places
  };

  // Calculate macroloan

  const calculateMacroloan = (amount) => {
    return amount <= 50000 ? amount * 0.005 : amount * 0.01;
  };

  // Handle form submission
  const handleUpdateLoan = async (e) => {
    e.preventDefault();

    // Use the correct `_id` from LoanEdits or state
    const id = LoanEdits._id; // Use MongoDB ObjectId for the API endpoint

    // Validate _id length
    if (!id || id.length !== 24) {
      console.error("Invalid _id:", id);
      setSubmitMessage("Error: Invalid _id");
      return;
    }

    // Check for required fields
    if (!installmentStart || !OLAmount) {
      console.log("Please select a date and enter loan amount first");
      setSubmitMessage(
        "Error: Please select a date and enter loan amount first"
      );
      return;
    }

    // Format the date
    const formattedDate = moment(installmentStart).format("DD-MM-YY");
    const macroloan = calculateMacroloan(OLAmount); // Assuming this function calculates the macro loan
    const fromFee = 15; // Define the fromFee value here

    const nextDates = [];
    let currentDate = moment(installmentStart);

    // Calculate the next installment dates based on the loan type
    if (loanType === "daily") {
      for (let i = 0; i < installmentCount; i++) {
        const nextDate = currentDate.format("DD-MM-YY");
        nextDates.push(nextDate);
        currentDate = currentDate.add(1, "day");
      }
    } else if (loanType === "sme") {
      const installmentStartDate = moment(installmentStart, "DD-MM-YY");
      const startDayOfWeek = installmentStartDate.day();

      for (let i = 0; i < 12; i++) {
        const nextMonth = installmentStartDate.clone().add(i, "months");
        const firstDayOfMonth = nextMonth.startOf("month");
        const firstWeekDayOfMonth = firstDayOfMonth.clone().day(startDayOfWeek);

        if (firstWeekDayOfMonth.month() !== nextMonth.month()) {
          firstWeekDayOfMonth.add(1, "weeks");
        }

        nextDates.push(firstWeekDayOfMonth.format("DD-MM-YY"));
      }
    } else if (loanType === "emergency") {
      const installmentStartDate = moment(installmentStart, "DD-MM-YY");
      const nextDateAfterSixMonths = installmentStartDate
        .clone()
        .add(6, "months")
        .format("DD-MM-YY");

      nextDates.push(nextDateAfterSixMonths);
    } else {
      for (let i = 0; i < installmentCount; i++) {
        const nextDate = currentDate
          .add(i === 0 ? 0 : 1, "weeks")
          .format("DD-MM-YY");
        nextDates.push(nextDate);
      }
    }

    try {
      // Send request to backend API to update the loan using _id
      const response = await fetch(
        `http://localhost:5000/loan-callback/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanID: LoanEdits.loanID, // Use the correct loanID from LoanEdits
            memberID: LoanEdits.memberID,
            installmentStart: formattedDate,
            nextDates: nextDates,
            OLamount: OLAmount,
            OLtotal: OLTotal,
            installment: installment,
            withoutInterst: withoutInterst,
            onlyInterest: onlyInterest,
            loanType: loanTypeTranslations[loanType],
            CenterDay: LoanEdits.CenterDay,
            totalInstallment: totalInstallment,
            macroloan,
            fromFee,
            // Include any other necessary fields
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLoanEdits(result.updatedLoan); // Update the state with the updated loan
        setSubmitMessage("Loan successfully updated!");
      } else {
        console.error("Failed to update loan:", response.status);
        setSubmitMessage(
          `Error: Unexpected response status ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating loan:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    const previousPage = location.state?.from || "LoanDetails";

    const loanID = location.state?.loanID || "";

    if (previousPage === "LoanDetails") {
      navigate("/home/LoanDetails", { state: { loanID }, replace: true });
    } else if (previousPage === "LoanDetailsForBranch") {
      navigate("/home/LoanDetailsForBranch", {
        state: { loanID },
        replace: true,
      });
    } else {
      navigate("/home/LoanDetails", { state: { loanID }, replace: true });
    }
  };

  return (
    <div className="bg-light container-fluid ">
      <div className="p-2">
        <form onSubmit={handleUpdateLoan}>
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
                    <i className="fas fa-money-bill-wave"></i> ঋণ সম্পাদনা
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

            <div className="mb-3 row">
              <div className="col-md-3">
                <label
                  htmlFor="memberID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> সদস্য ID:
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
                    id="memberID"
                    className="form-control border-primary"
                    value={LoanEdits.memberID}
                    disabled
                  ></input>
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="loanID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> ঋণ ID
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
                    id="loanID"
                    className="form-control border-primary"
                    type="text"
                    value={LoanEdits.loanID}
                  />
                </div>
              </div>

              <div className="mt-3 row">
                <div className="col-md-3">
                  <label
                    htmlFor="OLname"
                    className="form-label"
                    style={{ fontWeight: "bold", color: "#4A5568" }}
                  >
                    <i className="fas fa-use"></i> নাম
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
                      type="text"
                      id="OLname"
                      className="form-control border-primary"
                      value={LoanEdits.OLname}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor="MfhName"
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
                      type="text"
                      id="fathername"
                      className="form-control border-primary"
                      value={LoanEdits.fathername}
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
                    <i className="fas fa-code-branch"></i> শাঁখা
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
                      value={LoanEdits.OLbranch}
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
                      value={LoanEdits.OLcenter}
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
                      value={LoanEdits.OLmobile}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">
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
                  <select
                    id="loanType"
                    className="form-control border-primary"
                    value={loanType || ""} // Controlled component with loanType state value
                    onChange={handleLoanTypeChange} // Updates loan type on change
                  >
                    {/* Placeholder when no loan type is selected */}
                    <option value="" disabled>
                      বাছাই করুণ
                    </option>
                    {Object.entries(loanTypeTranslations).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
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
                    type="number"
                    id="OLamount"
                    className="form-control border-primary"
                    value={OLAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter Amount"
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
                    type="text"
                    id="OLtotal"
                    className="form-control border-primary"
                    value={OLTotal}
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
                    type="text"
                    id="installment"
                    className="form-control border-primary"
                    value={installment}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mt-5">
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
                      type="text"
                      id="CenterDay"
                      className="form-select border-primary"
                      value={LoanEdits.CenterDay}
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
                    <div>
                      <DatePicker
                        id="date"
                        className="form-control border-primary"
                        selected={
                          installmentStart // Use the state value for selected date
                            ? installmentStart
                            : LoanEdits.installmentStart
                            ? parseDate(LoanEdits.installmentStart)
                            : null
                        }
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="d-flex justify-content-between mt-5">
                <button type="submit" className=" btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className=" btn btn-primary btn-md"
                >
                  Cancel
                </button>
              </div> */}

              <div className="d-flex justify-content-between mt-5">
                {/* Update Button (Danger) with Right Icon */}
                <button
                  type="submit"
                  className="btn btn-danger btn-md position-relative"
                  style={{
                    background: "linear-gradient(45deg, #dc3545, #ff6347)", // Red gradient for danger
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#c82333"; // Darker red on hover
                    e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc3545"; // Reset to original color
                    e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
                  }}
                >
                  <i className="fas fa-check" style={{ marginLeft: "5px" }}></i>{" "}
                  Update
                  {/* Right icon */}
                </button>

                {/* Cancel Button (Fully Green) */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-success btn-md position-relative"
                  style={{
                    backgroundColor: "#28a745", // Solid green
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#218838"; // Darker green on hover
                    e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#28a745"; // Reset to original green color
                    e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
                  }}
                >
                  <i
                    className="fas fa-times"
                    style={{ marginRight: "5px" }}
                  ></i>
                  Cancel
                </button>
              </div>

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
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoanEdit;
