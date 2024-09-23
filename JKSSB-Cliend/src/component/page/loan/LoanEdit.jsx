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
            <div>
              <div className="border-bottom mb-3">
                <h2 className="text-center mb-4 pt-3">ঋণ সম্পাদনা</h2>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-3">
                <label htmlFor="memberID" className="form-label">
                  Member ID
                </label>
                <input
                  type="text"
                  id="memberID"
                  className="form-control"
                  value={LoanEdits.memberID}
                ></input>
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="loanID" className="form-label">
                  Loan ID
                </label>
                <input
                  id="loanID"
                  className="form-control"
                  type="text"
                  value={LoanEdits.loanID}
                />
              </div>

              <div className="mt-3 row">
                <div className="col-2">
                  <label htmlFor="OLname" className="form-label">
                    নাম
                  </label>
                  <input
                    type="text"
                    id="OLname"
                    className="form-control"
                    value={LoanEdits.OLname}
                    readOnly
                  />
                </div>

                <div className="col-2">
                  <label htmlFor="fathername" className="form-label">
                    পিতা/স্বামী
                  </label>
                  <input
                    type="text"
                    id="fathername"
                    className="form-control"
                    value={LoanEdits.fathername}
                    readOnly
                  />
                </div>

                <div className="col-2">
                  <label htmlFor="OLbranch" className="form-label">
                    শাঁখা
                  </label>
                  <input
                    type="text"
                    id="OLbranch"
                    className="form-control"
                    value={LoanEdits.OLbranch}
                    readOnly
                  />
                </div>

                <div className="col-3">
                  <label htmlFor="OLcenter" className="form-label">
                    কেন্দ্র
                  </label>
                  <input
                    type="text"
                    id="OLcenter"
                    className="form-control"
                    value={LoanEdits.OLcenter}
                    readOnly
                  />
                </div>

                <div className="col-3">
                  <label htmlFor="OLmobile" className="form-label">
                    মোবাইল:
                  </label>
                  <input
                    type="number"
                    id="OLmobile"
                    className="form-control"
                    value={LoanEdits.OLmobile}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="mb-3 col-3">
                <label htmlFor="loanType" className="form-label">
                  ঋণের ধরণ
                </label>
                <select
                  id="loanType"
                  className="form-select"
                  value={loanType || ""} // Controlled component with loanType state value
                  onChange={handleLoanTypeChange} // Updates loan type on change
                >
                  {/* Placeholder when no loan type is selected */}
                  <option value="" disabled>
                    বাছাই করুণ
                  </option>
                  {Object.entries(loanTypeTranslations).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 col-3">
                <label htmlFor="OLamount" className="form-label">
                  ঋণের পরিমাণ
                </label>
                <input
                  type="number"
                  id="OLamount"
                  className="form-control"
                  value={OLAmount}
                  onChange={handleAmountChange}
                  placeholder="Enter Amount"
                />
              </div>

              <div className="mb-3 col-3">
                <label htmlFor="OLtotal" className="form-label">
                  মোট টাকা
                </label>
                <input
                  type="text"
                  id="OLtotal"
                  className="form-control"
                  value={OLTotal}
                  readOnly
                />
              </div>

              <div className="mb-3 col-3">
                <label htmlFor="installment" className="form-label">
                  কিস্তির পরিমাণ
                </label>
                <input
                  type="text"
                  id="installment"
                  className="form-control"
                  value={installment}
                  readOnly
                />
              </div>

              <div className="row mt-5">
                <div className="col-3">
                  <label htmlFor="CenterDay" className="form-label">
                    কেন্দ্র বার
                  </label>
                  <input
                    type="text"
                    id="CenterDay"
                    className="form-control"
                    value={LoanEdits.CenterDay}
                    readOnly
                  />
                </div>

                <div className="mb-3 col-3">
                  <label htmlFor="date" className="form-label">
                    কিস্তি শুরু
                  </label>
                  <div>
                    <DatePicker
                      id="date"
                      className="form-control"
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

              <div className="d-flex justify-content-between mt-5">
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
              </div>
              {submitMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {submitMessage}
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
