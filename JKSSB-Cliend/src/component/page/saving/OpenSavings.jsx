// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

// Define loan type translations
const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

const SavingTimeTranslations = {
  ThreeYear: "৩ বছর",
  FiveYear: "৫ বছর",
  TenYear: "১০ বছর",
};

function OpenSavings() {
  // State variables
  const [installmentStart, setInstallmentStart] = useState(null);
  const [SavingAmount, setSavingAmount] = useState("");

  const [SavingType, setSavingType] = useState("");
  const [SavingTime, setSavingTime] = useState("");
  const [installment, setInstallment] = useState("");

  const [SavingCount, setSavingCount] = useState(0);
  const [SavingID, setSavingID] = useState("");
  const [memberID, setMemberID] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [centerDay, setCenterDay] = useState("");
  const [installmentCount, setInstallmentCount] = useState(46); // Default installment count

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

  // Generate Saving ID-----------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSavingCount = async () => {
    try {
      const response = await axios.get(
        "https://ashalota.gandhipoka.com/opensaving/count"
      );
      const count = response.data.count;
      setSavingCount(count);
      setSavingID(generateSavingID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  useEffect(() => {
    fetchSavingCount();
  }, [fetchSavingCount]);

  const generateSavingID = (count) => {
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
      setSavingType(fetchedMember.SavingType || "");
      setSavingTime(fetchedMember.SavingTime || "");
      setSavingAmount(fetchedMember.amount || "0");
    } else {
      setSelectedMember(null);
      setSavingType("");
      setSavingTime("");
      setSavingAmount("0");
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
          setSavingType(fetchedMember.SavingType || "");
          setSavingAmount(fetchedMember.amount || "0");

          // Fetch center details based on selected member's center ID
          fetchCenterDetails(fetchedMember.CenterIDMember);
        } else {
          setSelectedMember(null);
          setSavingType("");
          setSavingAmount("0");

          setCenterDay(""); // Reset CenterDay if member not found
        }
      } else {
        setSelectedMember(null);
        setSavingType("");
        setSavingAmount("0");

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

  // Handle saving type change
  const handleSavingTypeChange = (e) => {
    setSavingType(e.target.value);
  };

  const handleTimeTypeChange = (y) => {
    setSavingTime(y.target.value);
    setInstallmentCount(getInstallmentCount(y.target.value)); // Update installment count based on saving time
  };

  // Get installment count based on saving Time
  const getInstallmentCount = (time) => {
    switch (time) {
      case "ThreeYear":
        return 36;
      case "FiveYear":
        return 60;
      case "TenYear":
        return 120;
      default:
        return 46; // Default installment count
    }
  };

  // Function to generate dates for Meyadi
  const generateMeyadiDates = (startDate, count) => {
    const dates = [];
    let currentMoment = moment(startDate, "DD-MM-YY");
    const targetDay = currentMoment.day(); // The day of the week to look for (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

    for (let i = 0; i < count; i++) {
      // Move to the first day of the current month
      currentMoment.date(1);
      // Find the first occurrence of the target day in the current month
      while (currentMoment.day() !== targetDay) {
        currentMoment.add(1, "day");
      }
      // Add the date to the list
      dates.push(currentMoment.format("DD-MM-YY"));
      // Move to the next month
      currentMoment.add(1, "month");
    }

    return dates;
  };

  // Function to generate dates for NonMeyadi
  const generateNonMeyadiDate = (startDate, intervalYears) => {
    const currentMoment = moment(startDate, "DD-MM-YY");
    currentMoment.add(intervalYears, "years");
    return currentMoment.format("DD-MM-YY");
  };

  // Function to generate the next dates based on SavingType
  const generateNextDates = (startDate) => {
    if (SavingType === "NonMeyadi") {
      let intervalYears;
      switch (SavingTime) {
        case "ThreeYear":
          intervalYears = 3;
          break;
        case "FiveYear":
          intervalYears = 5;
          break;
        case "TenYear":
          intervalYears = 10;
          break;
        default:
          intervalYears = 1; // Default interval if needed
          break;
      }
      return [generateNonMeyadiDate(startDate, intervalYears)];
    } else if (SavingType === "Meyadi") {
      return generateMeyadiDates(startDate, installmentCount);
    } else {
      return []; // For General SavingType, no next dates are generated
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (installmentStart && SavingAmount) {
      const formattedDate = moment(installmentStart).format("DD-MM-YY");

      const nextDates = generateNextDates(installmentStart);

      try {
        // Send request to backend API to save the next dates
        const response = await fetch(
          "https://ashalota.gandhipoka.com/opensaving",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              SavingID: SavingID,
              memberID: memberID,
              SavingName: selectedMember.memberName,
              fathername: selectedMember.MfhName,
              SavingBranch: selectedMember.BranchMember,
              SavingCenter: selectedMember.CenterIDMember,
              SavingMobile: selectedMember.MemberMobile,
              installmentStart: formattedDate,
              nextDates: nextDates,
              SavingAmount: SavingAmount,
              installment: installment,
              SavingType: SavingTypeTranslations[SavingType],
              SavingTime: SavingTimeTranslations[SavingTime],
              CenterDay: centerDay,
            }),
          }
        );

        setSavingCount(SavingCount + 1);

        if (response.ok) {
          setSelectedMember("");
          setInstallmentStart(null);
          setSavingAmount("");
          setSavingType("");
          setSavingTime("");
          setInstallment("");
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
      console.log("Please select a date and enter Saving amount first");
    }
  };

  return (
    <div className="bg-light mt-2">
      <div className="mt-2 p-2">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="">
              <div className="border-bottom mb-3">
                <h2 className="text-center mb-4 pt-3">সঞ্চয় খুলুন</h2>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-3">
                <label htmlFor="memberID" className="form-label">
                  সদস্য ID:
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
                <label htmlFor="SavingID" className="form-label">
                  সঞ্চয় সংখ্যা
                </label>
                <input
                  id="SavingID"
                  className="form-control"
                  type="text"
                  value={SavingID}
                  disabled
                />
              </div>

              {selectedMember && (
                <div className="mt-3 row">
                  <div className="col-2">
                    <label htmlFor="SavingName" className="form-label">
                      নাম
                    </label>
                    <input
                      type="text"
                      id="SavingName"
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
                    <label htmlFor="SavingBranch" className="form-label">
                      শাঁখা
                    </label>
                    <input
                      type="text"
                      id="SavingBranch"
                      className="form-control"
                      value={selectedMember.BranchMember}
                      readOnly
                    />
                  </div>

                  <div className="col-3">
                    <label htmlFor="SavingCenter" className="form-label">
                      কেন্দ্র
                    </label>
                    <input
                      type="text"
                      id="SavingCenter"
                      className="form-control"
                      value={selectedMember.CenterIDMember}
                      readOnly
                    />
                  </div>

                  <div className="col-3">
                    <label htmlFor="SavingMobile" className="form-label">
                      মোবাইল:
                    </label>
                    <input
                      type="number"
                      id="SavingMobile"
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
                <label htmlFor="SavingType" className="form-label">
                  সঞ্চয়ের ধরণ
                </label>
                <select
                  id="SavingType"
                  className="form-select"
                  onChange={handleSavingTypeChange}
                  value={SavingType}
                >
                  <option value="">বাছাই করুণ</option>
                  {Object.entries(SavingTypeTranslations).map(
                    ([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>

              {(SavingType === "Meyadi" || SavingType === "NonMeyadi") && (
                <div className="mb-3 col-3">
                  <label htmlFor="SavingTime" className="form-label">
                    সময়
                  </label>
                  <select
                    id="SavingTime"
                    className="form-select"
                    onChange={handleTimeTypeChange}
                    value={SavingTime}
                  >
                    <option value="">বাছাই করুণ</option>
                    {Object.entries(SavingTimeTranslations).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <div className="mb-3 col-3">
                <label htmlFor="SavingAmount" className="form-label">
                  সঞ্চয়ের পরিমাণ
                </label>
                <input
                  type="number"
                  id="SavingAmount"
                  className="form-control"
                  placeholder="Enter Amount"
                  value={SavingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
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
                  <label htmlFor="installmentStart" className="form-label">
                    সঞ্চয় শুরু
                  </label>
                  <div>
                    <DatePicker
                      id="installmentStart"
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

export default OpenSavings;
