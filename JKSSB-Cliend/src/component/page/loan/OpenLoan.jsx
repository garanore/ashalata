// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

// Define loan type translations
const loanTypeTranslations = {
  normal: "সাধারণ ঋণ",
  tubewell: "নলকূপ ঋণ",
  farmer: "কৃষি ঋণ",
  sme: "এস এম ই ঋণ",
  emergency: "জরুরী ঋণ",
  disaster: "দুর্যোগ ঋণ",
  daily: "দৈনিক ঋণ",
};

function OpenLoan() {
  // State variables
  const [installmentStart, setInstallmentStart] = useState(null);
  const [OLamount, setOLAmount] = useState("");
  const [OLtotal, setOLTotal] = useState("");
  const [loanType, setLoanType] = useState("");
  const [installment, setInstallment] = useState("");
  const [withoutInterst, setWithoutInterest] = useState("");
  const [onlyInterest, setOnlyInterest] = useState("");
  const [loanCount, setLoanCount] = useState(0);
  const [loanID, setLoanID] = useState("");
  const [memberID, setMemberID] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [centerDay, setCenterDay] = useState("");
  const [installmentCount, setInstallmentCount] = useState(46); // Default installment count
  const [totalInstallment, setTotalInstallment] = useState(46);

  useEffect(() => {
    // Fetch member data
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          "https://ashalota.gandhipoka.com/member-callback"
        );
        setMemberData(response.data.members);
      } catch (error) {
        console.error("Error fetching member data:", error.message);
      }
    };

    fetchMemberData();
  }, []);

  // Fetch center details based on selected member's center ID
  const fetchCenterDetails = async (centerID) => {
    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/center-callback-id/${centerID}`
      );
      if (response.data && response.data.length > 0) {
        setCenterDay(response.data[0].CenterDay); // Assuming CenterDay is available in the first item of the response array
      } else {
        setCenterDay(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
      }
    } catch (error) {
      console.error("Error fetching center details:", error.message);
    }
  };

  // Generate Loan ID-----------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchLoanCount = async () => {
    try {
      const response = await axios.get(
        "https://ashalota.gandhipoka.com/openloan/save-dates/count"
      );
      const count = response.data.count;
      setLoanCount(count);
      setLoanID(generateLoanID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  useEffect(() => {
    fetchLoanCount();
  }, [fetchLoanCount]);

  const generateLoanID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `L${paddedCount}`;
  };

  // Find Member With Member ID------------------------------------------------
  useEffect(() => {
    // Check if memberData is available and not empty
    if (!memberData || memberData.length === 0) {
      return;
    }

    // Now, memberData should be available
    const fetchedMember = memberData.find(
      (member) => member.memberID === memberID
    );

    // Check if the member is found
    if (fetchedMember) {
      setSelectedMember(fetchedMember);
      setLoanType(fetchedMember.loanType || "");
      setOLAmount(fetchedMember.amount || "0");
      setOLTotal(fetchedMember.total || "0");
    } else {
      setSelectedMember(null);
      setLoanType("");
      setOLAmount("0");
      setOLTotal("0");
    }
  }, [memberData, memberID]);

  // Handle Member ID change
  const handleMemberIDChange = async (e) => {
    const enteredMemberID = e.target.value;
    setMemberID(enteredMemberID);

    try {
      // Fetch member data
      const response = await axios.get(
        "https://ashalota.gandhipoka.com/member-callback"
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const fetchedMember = response.data.find(
          (member) => member.memberID === enteredMemberID
        );

        if (fetchedMember) {
          setSelectedMember(fetchedMember);
          setLoanType(fetchedMember.loanType || "");
          setOLAmount(fetchedMember.amount || "0");
          setOLTotal(fetchedMember.total || "0");
          // Fetch center details based on selected member's center ID
          fetchCenterDetails(fetchedMember.CenterIDMember);
        } else {
          setSelectedMember(null);
          setLoanType("");
          setOLAmount("0");
          setOLTotal("0");
          setCenterDay(""); // Reset CenterDay if member not found
        }
      } else {
        setSelectedMember(null);
        setLoanType("");
        setOLAmount("0");
        setOLTotal("0");
        setCenterDay(""); // Reset CenterDay if member data is empty
      }
    } catch (error) {
      console.error("Error fetching member data:", error.message);
    }
  };

  //----------------------------------------------------------------
  // Handle date change
  const handleDateChange = (date) => {
    setInstallmentStart(date);
  };

  // Handle loan type change
  const handleLoanTypeChange = (e) => {
    const selectedLoanType = e.target.value;
    setLoanType(selectedLoanType);
    setOLAmount("");
    setOLTotal("");
    const count = getInstallmentCount(selectedLoanType); // Update installment count based on loan type
    setInstallmentCount(count);
    setTotalInstallment(count); // Set totalInstallment
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

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (installmentStart && OLamount) {
      const formattedDate = moment(installmentStart).format("DD-MM-YY");

      const nextDates = [];
      let currentDate = moment(installmentStart);

      // Check if the loan type is 'daily'
      if (loanType === "daily") {
        for (let i = 0; i < installmentCount; i++) {
          const nextDate = currentDate.format("DD-MM-YY");
          nextDates.push(nextDate);
          // Increment the current date by 1 day
          currentDate = currentDate.add(1, "day");
        }
      }

      // For SME -----------------
      else if (loanType === "sme") {
        // Ensure installmentStart is a moment object
        const installmentStartDate = moment(installmentStart, "DD-MM-YY");

        // Get the day of the week for the selected installment start date (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const startDayOfWeek = installmentStartDate.day();

        // Generate next 12 dates based on the first week's selected day of each month
        for (let i = 0; i < 12; i++) {
          const nextMonth = installmentStartDate.clone().add(i, "months");
          const firstDayOfMonth = nextMonth.startOf("month");
          const firstWeekDayOfMonth = firstDayOfMonth
            .clone()
            .day(startDayOfWeek);

          if (firstWeekDayOfMonth.month() !== nextMonth.month()) {
            firstWeekDayOfMonth.add(1, "weeks");
          }

          nextDates.push(firstWeekDayOfMonth.format("DD-MM-YY"));
        }
      }

      // For Emergency -----------------
      else if (loanType === "emergency") {
        // Ensure installmentStart is a moment object
        const installmentStartDate = moment(installmentStart, "DD-MM-YY");

        // Add the next date exactly after six months
        const nextDateAfterSixMonths = installmentStartDate
          .clone()
          .add(6, "months")
          .format("DD-MM-YY");

        nextDates.push(nextDateAfterSixMonths);
      }

      // For Default------------------
      else {
        // For other loan types, save dates with a weekly frequency
        for (let i = 0; i < installmentCount; i++) {
          const nextDate = currentDate
            .add(i === 0 ? 0 : 1, "weeks")
            .format("DD-MM-YY");
          nextDates.push(nextDate);
        }
      }

      try {
        // Send request to backend API to save the next dates
        const response = await fetch(
          "https://ashalota.gandhipoka.com/openloan/save-dates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loanID: loanID,
              memberID: memberID,
              OLname: selectedMember.memberName,
              fathername: selectedMember.MfhName,
              OLbranch: selectedMember.BranchMember,
              OLcenter: selectedMember.CenterIDMember,
              OLmobile: selectedMember.MemberMobile,
              installmentStart: formattedDate,
              nextDates: nextDates,
              OLamount: OLamount,
              OLtotal: OLtotal,
              installment: installment,
              withoutInterst: withoutInterst,
              onlyInterest: onlyInterest,
              loanType: loanTypeTranslations[loanType],
              CenterDay: centerDay,
              totalInstallment: totalInstallment, // Include totalInstallment in the request body
            }),
          }
        );

        setLoanCount(loanCount + 1);

        if (response.ok) {
          setSelectedMember("");
          setInstallmentStart(null);
          setOLAmount("");
          setOLTotal("");
          setLoanType("");
          setInstallment("");
          setWithoutInterest("");
          setOnlyInterest("");
          setMemberID("");
          setSubmitMessage(""); // Clear submit message

          setSubmitMessage("Successfully submitted!");
        } else {
          // Handle unexpected response status
          console.error("Unexpected response status:", response.status);
          setSubmitMessage(
            `Error: Unexpected response status ${response.status}`
          );
          console.error("Failed to save next dates:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting form:", error.message);
        // Log the detailed error response from the server
        if (error.response) {
          console.error("Server response data:", error.response.data);
        }
        setSubmitMessage(`Error: ${error.message}`);
        console.error("Error saving dates:", error.message);
      }
    } else {
      console.log("Please select a date and enter loan amount first");
    }
  };

  return (
    <div className="bg-light mt-2">
      <div className="mt-2 p-2">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="">
              <div className="border-bottom mb-3">
                <h2 className="text-center mb-4 pt-3">ঋণ বিতরণ</h2>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-3">
                <label htmlFor="memberID" className="form-label">
                  Member ID:
                </label>
                <input
                  type="text"
                  id="memberID"
                  className="form-control"
                  value={memberID}
                  onChange={handleMemberIDChange} // Handle Member ID change
                  placeholder="Enter Member ID"
                ></input>
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="loanID" className="form-label">
                  ঋণ সংখ্যা
                </label>
                <input
                  id="loanID"
                  className="form-control"
                  type="text"
                  value={loanID}
                  disabled
                />
              </div>

              {selectedMember && (
                <div className="mt-3 row">
                  <div className="col-2">
                    <label htmlFor="OLname" className="form-label">
                      নাম
                    </label>
                    <input
                      type="text"
                      id="OLname"
                      className="form-control"
                      value={selectedMember.memberName}
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
                      value={selectedMember.MfhName}
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
                      value={selectedMember.BranchMember}
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
                      value={selectedMember.CenterIDMember}
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
                      value={selectedMember.MemberMobile}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="row mt-5">
              <div className="mb-3 col-3">
                <label htmlFor="loanType" className="form-label">
                  ঋণের ধরণ
                </label>
                <select
                  id="loanType"
                  className="form-select"
                  onChange={handleLoanTypeChange}
                  value={loanType}
                >
                  <option value="">বাছাই করুণ</option>
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
                  value={OLamount}
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
                  value={OLtotal}
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
                    value={centerDay}
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
                      selected={installmentStart}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              </div>

              <button className="btn btn-primary">Submit</button>
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

export default OpenLoan;
