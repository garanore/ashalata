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
  const [hasAccess, setHasAccess] = useState(true);
  const [accountName, setAccountName] = useState(""); // Add accountName state
  const [, setUserBranches] = useState([]);
  const [username, setUsername] = useState(""); // Add username state

  useEffect(() => {
    // Fetch member data
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/member-callback"
        );
        setMemberData(response.data.members);
      } catch (error) {
        console.error("Error fetching member data:", error.message);
      }
    };

    fetchMemberData();

    // Step 2: Retrieve user branch data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);
      const userBranches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(userBranches);

      const usernames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = usernames[0] || "Unknown";
      setUsername(username);

      // Fetch accountName based on the username
      if (username !== "Unknown") {
        axios
          .get(`http://localhost:5000/get-user-username/${username}`)
          .then((response) => {
            if (response.data.length > 0) {
              setAccountName(response.data[0].accountName);
            } else {
              setAccountName("Unknown User");
            }
          })
          .catch(() => {
            setAccountName("Error fetching user");
          });
      }

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      // Check if the user has a restricted designation
      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      // Restrict access if the user has a restricted designation
      setHasAccess(!userHasRestrictedDesignation);
    }
  }, []);

  // Fetch center details based on selected member's center ID
  const fetchCenterDetails = async (centerID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/center-callback-id/${centerID}`
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
        "http://localhost:5000/openloan/save-dates/count"
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
      const response = await axios.get("http://localhost:5000/member-callback");

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

  // Calculate macroloan

  const calculateMacroloan = (amount) => {
    return amount <= 50000 ? amount * 0.005 : amount * 0.01;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (installmentStart && OLamount) {
      const formattedDate = moment(installmentStart).format("DD-MM-YY");
      const macroloan = calculateMacroloan(OLamount);
      const fromFee = 15; // Define the FromFee value here

      const nextDates = [];
      let currentDate = moment(installmentStart);

      // Step 2: Retrieve user branch data and username from localStorage
      const storedUserData = localStorage.getItem("userBranchData");
      let submittedBy = "Unknown"; // Default to 'Unknown' if not found

      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);

          // Extract the username from localStorage
          const userNames = Object.keys(parsedData)
            .filter((key) => key.startsWith("username"))
            .map((key) => parsedData[key]);

          // Use the first username if available
          if (userNames.length > 0) {
            submittedBy = userNames[0];
          }
        } catch (error) {
          console.error(
            "Error parsing userBranchData from localStorage:",
            error.message
          );
        }
      }

      // If the submittedBy is still 'Unknown', stop submission
      if (submittedBy === "Unknown") {
        setSubmitMessage("Error: Submitted by field is missing or invalid.");
        return;
      }

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
          "http://localhost:5000/openloan/save-dates",
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
              macroloan, // Include macroloan value in the data sent to the backend
              fromFee, // Include FromFee value in the data sent to the backend
              approvalStatus: "Approved",
              ActiveStatus: "True",
              submittedBy: submittedBy, // Use the retrieved username from localStorage
              GrantedBy: "Null",
              DeletedStatus: "Null",
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

          setSubmitMessage(
            "সঠিক ভাবে ঋণের আবেদন করা হয়েছে। শাখা ব্যবস্থাপকের অনুমতির জন্য অপেক্ষা করুণ।"
          );
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

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-4">
          <div className="border-bottom mb-4">
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#2D3748" }}
            >
              <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>
              ঋণ বিতরণ
            </h2>
          </div>

          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#f8d7da",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              className="text-center mb-0"
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#721c24",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "1.5rem", marginRight: "10px" }}
              ></i>
              প্রিয়{" "}
              <span className="highlighted-username">
                {accountName || username}
              </span>
              , এই পেইজে আপনার অনুমতি নেই।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light container-fluid ">
      <div className="p-2">
        <form onSubmit={handleSubmit}>
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
                    <i className="fas fa-money-bill-wave"></i> ঋণ বিতরণ
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
                    type="text"
                    id="memberID"
                    className="form-control border-primary"
                    value={memberID}
                    onChange={handleMemberIDChange} // Handle Member ID change
                    placeholder="সদস্য ID লিখুন"
                  ></input>
                </div>
                <small className="text-muted">উদাহরণ: B01M0001</small>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="loanID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> ঋণ সংখ্যা
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
                    value={loanID}
                    disabled
                  />
                </div>
              </div>

              {selectedMember && (
                <div className="mt-3 row">
                  <div className="col-md-3">
                    <label
                      htmlFor="OLname"
                      className="form-label"
                      style={{ fontWeight: "bold", color: "#4A5568" }}
                    >
                      <i className="fas fa-use"></i> সদস্য নাম
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
                        id="OLname"
                        className="form-control border-primary"
                        value={selectedMember.memberName}
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
                        value={selectedMember.MfhName}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-code-branch"></i>
                      </span>
                      <input
                        type="text"
                        id="OLbranch"
                        className="form-select border-primary"
                        value={selectedMember.BranchMember}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <input
                        type="text"
                        id="OLcenter"
                        className="form-select border-primary"
                        value={selectedMember.CenterIDMember}
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
                          background:
                            "linear-gradient(45deg, #007bff, #00d4ff)",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-mobile-alt"></i>
                      </span>
                      <input
                        type="number"
                        id="OLmobile"
                        className="form-control border-primary"
                        value={selectedMember.MemberMobile}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
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
                    onChange={handleLoanTypeChange}
                    value={loanType}
                  >
                    <option value="">--------</option>
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
                    placeholder="ঋণের পরিমাণ লিখুন"
                    value={OLamount}
                    onChange={handleAmountChange}
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
                    value={OLtotal}
                    readOnly
                  />
                </div>
                <small className="text-muted">Interest সহ মোট টাকা</small>
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
                <small className="text-muted">প্রতি কিস্তির পরিমাণ</small>
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
                      value={centerDay}
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
                        id="installmentStart"
                        className="form-control border-primary"
                        selected={installmentStart}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>
                  <small className="text-muted">
                    কেন্দ্র বার অনুযায়ী প্রথম কিস্তির তারিখ
                  </small>
                </div>
              </div>

              {/* <button className="btn btn-primary">Submit</button> */}

              <div className="d-flex justify-content-center mb-3 mt-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg shadow"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-paper-plane"></i> Submit
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

export default OpenLoan;
