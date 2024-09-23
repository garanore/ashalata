// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function OfficeCollection() {
  const [memberID, setMemberID] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [savingCollecting, setSavingCollecting] = useState("");
  const [installmentCount, setInstallmentCount] = useState("");
  const [SavingCount, setSavingCount] = useState("");
  const [installmentCollecting, setInstallmentCollecting] = useState("");
  const [loanData, setLoanData] = useState({
    loanID: "",
    OLname: "",
    fathername: "",
    OLbranch: "",
    OLcenter: "",
    OLmobile: "",
    loanType: "",
    installment: "",
    SavingID: "",
    SavingType: "",
    SavingTime: "",
    SavingAmount: "",
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);

      // Get username from localStorage data
      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const storedUsername = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(storedUsername); // Store the username in the state
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

          if (loanResponse.data.length > 0 && savingResponse.data.length > 0) {
            const loanData = loanResponse.data[0];
            const savingData = savingResponse.data[0];
            setLoanData({
              loanID: loanData.loanID,
              OLname: loanData.OLname,
              fathername: loanData.fathername,
              OLbranch: loanData.OLbranch,
              OLcenter: loanData.OLcenter,
              OLmobile: loanData.OLmobile,
              loanType: loanData.loanType,
              installment: loanData.installment,
              SavingID: savingData.SavingID,
              SavingType: savingData.SavingType,
              SavingTime: savingData.SavingTime,
              SavingAmount: savingData.SavingAmount,
            });
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
  const handleSavingCountChange = (e) => {
    setSavingCount(e.target.value);
  };

  const handleInstallmentCollectingChange = (e) => {
    setInstallmentCollecting(e.target.value);
  };
  const handleInstallmentCountChange = (e) => {
    setInstallmentCount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setSubmitMessage("Please select a date.");
      return;
    }

    if (!installmentCollecting && !savingCollecting) {
      const confirmProceed = window.confirm(
        "Some fields are empty. Do you want to proceed with the submission?"
      );
      if (!confirmProceed) {
        return;
      }
    }

    const formattedDate = `${selectedDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.getFullYear().toString().slice(2)}`;

    try {
      if (installmentCollecting) {
        // Send `installment` instead of `installmentCollecting`
        await axios.patch(
          `http://localhost:5000/update-installments-collection/${loanData.loanID}`,
          {
            installmentDate: [formattedDate],
            installment: [installmentCollecting], // Corrected field name
            submittedBy: [username], // Send submittedBy as an array
            installmentCount: [installmentCount], // Send submittedBy as an array
          }
        );
      }

      if (savingCollecting) {
        await axios.patch(
          `http://localhost:5000/update-savings-collection/${loanData.SavingID}`,
          {
            savingCollectionDate: [formattedDate],
            savingCollecting: [savingCollecting],
            submittedBy: [username], // Send submittedBy as an array
            SavingCount: [SavingCount], // Send submittedBy as an array
          }
        );
      }

      setSubmitMessage("Data updated successfully!");
    } catch (error) {
      setSubmitMessage(`Error updating data: ${error.message}`);
      console.error("Error updating data:", error.message);
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">অফিস জমা</h2>
        </div>
      </div>

      <div>
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-3 mb-5">
              <label htmlFor="memberID" className="form-label">
                সদস্য ID
              </label>
              <input
                type="text"
                id="memberID"
                className="form-control"
                placeholder="Enter Member ID"
                value={memberID}
                onChange={handleMemberIDChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="InstallmentDate" className="form-label">
                তারিখ নির্বাচন করুন
              </label>
              <div>
                <DatePicker
                  id="InstallmentDate"
                  className="form-control"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 row mb-5">
            <div className="col-2">
              <label htmlFor="OLname" className="form-label">
                নাম
              </label>
              <input
                type="text"
                id="OLname"
                className="form-control"
                value={loanData.OLname}
                readOnly
              />
            </div>

            <div className="col-3">
              <label htmlFor="fathername" className="form-label">
                পিতা/স্বামী
              </label>
              <input
                type="text"
                id="fathername"
                className="form-control"
                value={loanData.fathername}
                readOnly
              />
            </div>

            <div className="col-2">
              <label htmlFor="OLbranch" className="form-label">
                শাখা
              </label>
              <input
                type="text"
                id="OLbranch"
                className="form-control"
                value={loanData.OLbranch}
                readOnly
              />
            </div>

            <div className="col-2">
              <label htmlFor="CenterName" className="form-label">
                কেন্দ্র
              </label>
              <input
                type="text"
                id="CenterName"
                className="form-control"
                value={loanData.OLcenter}
                readOnly
              />
            </div>

            <div className="col-3">
              <label htmlFor="OLmobile" className="form-label">
                মোবাইল
              </label>
              <input
                type="text"
                id="OLmobile"
                className="form-control"
                value={loanData.OLmobile}
                readOnly
              />
            </div>

            <div className="mt-5 row">
              <div className="col-3">
                <label htmlFor="loanID" className="form-label">
                  Loan ID:
                </label>
                <input
                  type="text"
                  id="loanID"
                  className="form-control"
                  value={loanData.loanID}
                  readOnly
                />
              </div>
              <div className="col-3">
                <label htmlFor="loanType" className="form-label">
                  ঋণের ধরণ
                </label>
                <input
                  type="text"
                  id="loanType"
                  className="form-control"
                  value={loanData.loanType}
                  readOnly
                />
              </div>

              <div className="col-3">
                <label htmlFor="installment" className="form-label">
                  কিস্তির পরিমাণ
                </label>
                <input
                  type="text"
                  id="installment"
                  className="form-control"
                  value={loanData.installment}
                  readOnly
                />
              </div>

              <div className="col-3">
                <label htmlFor="installmentCollecting" className="form-label">
                  কিস্তি জমা
                </label>
                <input
                  type="text"
                  id="installmentCollecting"
                  className="form-control"
                  value={installmentCollecting}
                  onChange={handleInstallmentCollectingChange}
                />
              </div>
              <div className="col-3">
                <label htmlFor="installmentCount" className="form-label">
                  কিস্তি সংখ্যা
                </label>
                <input
                  type="text"
                  id="installmentCount"
                  className="form-control"
                  value={installmentCount}
                  onChange={handleInstallmentCountChange}
                />
              </div>
            </div>

            <div className="mt-5 row">
              <div className="col-2">
                <label htmlFor="SavingID" className="form-label">
                  Saving ID
                </label>
                <input
                  type="text"
                  id="SavingID"
                  className="form-control"
                  value={loanData.SavingID}
                  readOnly
                />
              </div>

              <div className="col-3">
                <label htmlFor="SavingType" className="form-label">
                  সঞ্চয়ের ধরণ
                </label>
                <input
                  type="text"
                  id="SavingType"
                  className="form-control"
                  value={loanData.SavingType}
                  readOnly
                />
              </div>

              <div className="col-2">
                <label htmlFor="SavingTime" className="form-label">
                  সঞ্চয়ের সময়
                </label>
                <input
                  type="text"
                  id="SavingTime"
                  className="form-control"
                  value={loanData.SavingTime}
                  readOnly
                />
              </div>

              <div className="col-2">
                <label htmlFor="SavingAmount" className="form-label">
                  সঞ্চয়ের পরিমাণ
                </label>
                <input
                  type="text"
                  id="SavingAmount"
                  className="form-control"
                  value={loanData.SavingAmount}
                  readOnly
                />
              </div>

              <div className="col-3">
                <label htmlFor="savingCollecting" className="form-label">
                  সঞ্চয় জমা
                </label>
                <input
                  type="text"
                  id="savingCollecting"
                  className="form-control"
                  value={savingCollecting}
                  onChange={handleSavingCollectingChange}
                />
              </div>
              <div className="col-3">
                <label htmlFor="SavingCount" className="form-label">
                  সঞ্চয় সংখ্যা
                </label>
                <input
                  type="text"
                  id="SavingCount"
                  className="form-control"
                  value={SavingCount}
                  onChange={handleSavingCountChange}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          {submitMessage && (
            <div
              className={`alert ${
                submitMessage.includes("Error")
                  ? "alert-danger"
                  : "alert-success"
              } mt-3`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default OfficeCollection;
