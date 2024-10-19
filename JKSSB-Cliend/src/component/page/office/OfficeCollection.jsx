// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

function OfficeCollection() {
  const [memberID, setMemberID] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // const [memberData, setMemberData] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // Add messageType state
  const [savingCollecting, setSavingCollecting] = useState("");
  const [installmentCollecting, setInstallmentCollecting] = useState("");
  const [, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [loanData, setLoanData] = useState({
    loanID: "",
    OLname: "",
    fathername: "",
    OLbranch: "",
    OLcenter: "",
    OLmobile: "",
    loanType: "",
    installment: "",
  });
  const [savingData, setsavingData] = useState({
    SavingID: "",
    SavingName: "",

    SavingType: "",
    SavingTime: "",
    SavingAmount: "",
    onlyInterest: "",
  });
  const [memberData, setmemberData] = useState({
    MfhName: "",
    memberName: "",
    BranchMember: "",
    CenterNameMember: "",
    MemberMobile: "",
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve user data from localStorage
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

  useEffect(() => {
    const fetchData = async () => {
      if (memberID) {
        try {
          const loanResponse = await axios.get(
            `http://localhost:5000/get-loan-MemberID/${memberID}`
          );
          const savingResponse = await axios.get(
            `http://localhost:5000/saving-callback-memberid/${memberID}`
          );
          const MemberResponse = await axios.get(
            `http://localhost:5000/member-callback-by-memberID/${memberID}`
          );
          // Check if either loanResponse or savingResponse has data
          if (loanResponse.data.length > 0 || savingResponse.data.length > 0) {
            if (loanResponse.data.length > 0) {
              const loanData = loanResponse.data[0];
              setLoanData({
                loanID: loanData.loanID,
                OLname: loanData.OLname,
                fathername: loanData.fathername,
                OLbranch: loanData.OLbranch,
                OLcenter: loanData.OLcenter,
                OLmobile: loanData.OLmobile,
                loanType: loanData.loanType,
                onlyInterest: loanData.onlyInterest,
                installment: loanData.installment,
                SavingID: loanData.SavingID, // You may remove this if it's not relevant
                SavingType: loanData.SavingType,
                SavingTime: loanData.SavingTime,
                SavingAmount: loanData.SavingAmount,
              });
            }

            if (savingResponse.data.length > 0) {
              const savingData = savingResponse.data[0];
              setsavingData({
                SavingID: savingData.SavingID,
                SavingName: savingData.SavingName,
                SavingType: savingData.SavingType,
                SavingTime: savingData.SavingTime,
                SavingAmount: savingData.SavingAmount,
              });
            }
            if (MemberResponse.data.length > 0) {
              const memberData = MemberResponse.data[0];
              setmemberData({
                memberName: memberData.memberName,
                MfhName: memberData.MfhName,
                BranchMember: memberData.BranchMember,
                CenterNameMember: memberData.CenterNameMember,
                MemberMobile: memberData.MemberMobile,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      }
    };

    fetchData();
  }, [memberID]);

  const handleMemberIDChange = (e) => {
    setMemberID(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSavingCollectingChange = (e) => {
    setSavingCollecting(e.target.value);
  };

  const handleInstallmentCollectingChange = (e) => {
    setInstallmentCollecting(e.target.value);
  };

  const handleInstallmentCollectingBlur = () => {
    const installmentValue = parseFloat(loanData.installment); // Assuming installment is part of loanData
    const inputValue = parseFloat(installmentCollecting); // Get the user input value

    if (!isNaN(inputValue) && !isNaN(installmentValue)) {
      if (inputValue % installmentValue !== 0) {
        setSubmitMessage(
          `${loanData.OLname} এর জন্য অবশ্যই ${installmentValue} বা ${installmentValue} এর গুণিতক টাকা যোগ করুণ`
        );
        setMessageType("danger");

        // Clear the input value if invalid
        setInstallmentCollecting("");
      } else {
        setSubmitMessage("");
        setMessageType("");
      }
    } else {
      setSubmitMessage("সংখ্যা ছাড়া  অন্য কিছু দেওয়া যাবে না");
      setMessageType("danger");

      // Clear the input value if not a valid number
      setInstallmentCollecting("");
    }
  };

  const handleSavingCollectingBlur = () => {
    const SavingValue = parseFloat(savingData.SavingAmount); // Assuming installment is part of loanData
    const inputValue = parseFloat(savingCollecting); // Get the user input value

    // Allow any value for "General" SavingType (translated as "সাধারণ")
    if (savingData.SavingType === SavingTypeTranslations.General) {
      setSubmitMessage(""); // Clear any previous error message
      setMessageType(""); // Clear message type
      return; // Skip further validation
    }

    // Apply validation for non-General SavingTypes
    if (!isNaN(inputValue) && !isNaN(SavingValue)) {
      if (inputValue % SavingValue !== 0) {
        // Set danger message and message type
        setSubmitMessage(
          `${savingData.SavingName} এর জন্য অবশ্যই ${SavingValue} বা ${SavingValue} এর গুণিতক টাকা যোগ করুণ`
        );
        setMessageType("danger"); // Set the message type to 'danger'

        // Clear the input value if invalid
        setSavingCollecting("");
      } else {
        setSubmitMessage(""); // Clear error message if input is valid
        setMessageType(""); // Clear message type
      }
    } else {
      setSubmitMessage("নাম্বার ছাড়া  অন্য কিছু দেওয়া যাবে না");
      setMessageType("danger"); // Set the message type to 'danger'

      // Clear the input value if not a valid number
      setSavingCollecting("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Always check selectedDate first
    if (!selectedDate) {
      setSubmitMessage("দয়া করে তারিখ নির্বাচন করুণ");
      setMessageType("warning");
      setMessageType("danger");
      return; // Stop further execution if date is not selected
    }

    // Check if either installmentCollecting or savingCollecting is empty
    if (!installmentCollecting && !savingCollecting) {
      setSubmitMessage("আপনি কিস্তি বা সঞ্চয় কিছুই জমা করেন নাই ");
      setMessageType("danger");
      return;
    }

    // If installmentCollecting is empty, show a warning for loan fields
    if (!installmentCollecting) {
      const confirmProceed = window.confirm(
        "কিস্তি জমা করেন নাই। কিস্তি জমা না করেই সঞ্চয় জমা করতে চান?"
      );
      if (!confirmProceed) {
        return; // Stop further execution if user cancels
      }
    }

    // If savingCollecting is empty, show a warning for saving fields
    if (!savingCollecting) {
      const confirmProceed = window.confirm(
        "সঞ্চয় জমা করেন নাই। সঞ্চয় জমা না করেই কিস্তি জমা করতে চান?"
      );
      if (!confirmProceed) {
        return; // Stop further execution if user cancels
      }
    }

    // Calculate installmentCount dynamically
    const installmentCount = installmentCollecting
      ? Math.floor(installmentCollecting / loanData.installment)
      : 0;

    // Calculate onlyInterest dynamically
    const onlyInterest = installmentCount * loanData.onlyInterest;

    // Logic for calculating SavingCount based on SavingType
    let SavingCount;
    if (savingData.SavingType === "মেয়াদি") {
      // For Meyadi, calculate dynamically
      SavingCount = savingCollecting
        ? Math.floor(savingCollecting / savingData.SavingAmount)
        : 0;
    } else {
      // For General and NonMeyadi, always set SavingCount to 1
      SavingCount = 1;
    }

    const formattedDate = `${selectedDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.getFullYear().toString().slice(2)}`;

    try {
      if (installmentCollecting) {
        await axios.patch(
          `http://localhost:5000/update-installments-collection/${loanData.loanID}`,
          {
            installmentDate: [formattedDate],
            installment: [installmentCollecting], // Use installmentCollecting value
            submittedBy: [username], // Send submittedBy as an array
            installmentCount: [installmentCount], // Automatically calculated
            onlyInterest: [onlyInterest], // Automatically calculated onlyInterest
          }
        );
      }

      if (savingCollecting) {
        await axios.patch(
          `http://localhost:5000/update-savings-collection/${savingData.SavingID}`,
          {
            savingCollectionDate: [formattedDate],
            savingCollecting: [savingCollecting],
            submittedBy: [username], // Send submittedBy as an array
            SavingCount: [SavingCount], // Send SavingCount according to the logic
          }
        );
      }

      setSubmitMessage("সঠিক ভাবে গ্রহণ করা হয়েছে");
      setMessageType("success");
    } catch (error) {
      setSubmitMessage(`Error updating data: ${error.message}`);
      console.error("Error updating data:", error.message);
      setMessageType("danger");
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
              অফিস জমা
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
    <div className="bg-light container-fluid">
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
              <i className="fas fa-money-bill-wave"></i> অফিস জমা
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

      <div>
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3">
              <label
                htmlFor="memberID"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-id-card"></i> সদস্য ID
                <span style={{ color: "red" }}> *</span>
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
                  placeholder="Enter Member ID"
                  value={memberID}
                  onChange={handleMemberIDChange}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="installmentStart"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-calendar-alt"></i>
                তারিখ নির্বাচন করুন
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
                    id="InstallmentDate"
                    className="form-control border-primary"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5">
            {submitMessage && messageType === "danger" && (
              <div
                className="alert alert-danger mt-3 d-flex align-items-center"
                role="alert"
                style={{
                  borderRadius: "0.5rem", // Rounded corners
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                }}
              >
                <i
                  className="fas fa-exclamation-circle"
                  style={{
                    fontSize: "1.5rem",
                    marginRight: "10px", // Space between icon and text
                    color: "#721c24", // Red color for danger
                  }}
                ></i>
                <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
              </div>
            )}
          </div>

          <div className="mt-3 row mb-5">
            <div className="col-md-3">
              <label
                htmlFor="memberName"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-user"></i> নাম
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
                  id="memberName"
                  className="form-control border-primary"
                  value={memberData.memberName}
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
                <i className="fas fa-user-friends"></i> পিতা/স্বামীর
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
                  id="MfhName"
                  className="form-control border-primary"
                  value={memberData.MfhName}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="BranchMember"
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
                  id="BranchMember"
                  className="form-select border-primary"
                  value={memberData.BranchMember}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="CenterNameMember"
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
                  id="CenterNameMember"
                  className="form-select border-primary"
                  value={memberData.CenterNameMember}
                  readOnly
                />
              </div>
            </div>

            <div className="col-3 mt-3">
              <label
                htmlFor="MemberMobile"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-mobile-alt"></i>
                মোবাইল
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
                  type="text"
                  id="MemberMobile"
                  className="form-control border-primary"
                  value={memberData.MemberMobile}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-5 row">
              <div className="col-md-3">
                <label
                  htmlFor="loanID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> Loan ID:
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
                    id="loanID"
                    className="form-control border-primary"
                    value={loanData.loanID}
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
                    type="text"
                    id="loanType"
                    className="form-control border-primary"
                    value={loanData.loanType}
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
                    value={loanData.installment}
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
                  <i className="fas fa-calendar-day"></i> কিস্তি জমা
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
                    id="installmentCollecting"
                    className="form-select border-primary"
                    value={installmentCollecting}
                    onChange={handleInstallmentCollectingChange}
                    onBlur={() =>
                      handleInstallmentCollectingBlur(loanData.loanID)
                    } // Add onBlur to trigger validation
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 row">
              <div className="col-md-3">
                <label
                  htmlFor="SavingID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> Saving ID
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
                    value={savingData.SavingID}
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
                  <i className="fas fa-money-check-alt"></i>
                  সঞ্চয়ের ধরণ
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
                    type="text"
                    id="SavingType"
                    className="form-control border-primary"
                    value={savingData.SavingType}
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
                  <i className="fas fa-money-bill-wave"></i> সঞ্চয়ের সময়
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
                    id="SavingTime"
                    className="form-control border-primary"
                    value={savingData.SavingTime}
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
                    type="text"
                    id="SavingAmount"
                    className="form-control border-primary"
                    value={savingData.SavingAmount}
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
                  <i className="fas fa-money-bill-wave"></i> সঞ্চয় জমা
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
                    id="savingCollecting"
                    className="form-control border-primary"
                    value={savingCollecting}
                    onChange={handleSavingCollectingChange}
                    onBlur={() =>
                      handleSavingCollectingBlur(savingData.SavingID)
                    } // Add onBlur to trigger validation
                  />
                </div>
              </div>
            </div>
          </div>
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
          {submitMessage && messageType === "success" && (
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
                  color: "#155724", // Green color for success
                }}
              ></i>
              <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default OfficeCollection;
