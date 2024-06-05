// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const SavingsWithdraw = () => {
  const [savingID, setSavingID] = useState("");
  const [savingDetails, setSavingDetails] = useState(null);
  const [totalSavingAmount, setTotalSavingAmount] = useState(null);
  const [withDrawAmount, setWithDrawAmount] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [savingCurrentBlance, setSavingCurrentBlance] = useState(null);
  const [calculatedInterest, setCalculatedInterest] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(""); // New state for the withdraw date
  const [lastOldWithdraw, setLastOldWithdraw] = useState(0); // State for last old withdraw amount

  useEffect(() => {
    if (totalSavingAmount !== null && withDrawAmount !== "") {
      setSavingCurrentBlance(totalSavingAmount - parseFloat(withDrawAmount));
    } else {
      setSavingCurrentBlance(totalSavingAmount);
    }
  }, [totalSavingAmount, withDrawAmount]);

  const fetchSavingDetails = async (id) => {
    try {
      const response = await fetch(
        `https://ashalota.gandhipoka.com/get-saving-savingid/${id}`
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
        `https://ashalota.gandhipoka.com/saving-collection-total/${id}`
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
        `https://ashalota.gandhipoka.com/get-withDrawAmount-savingid/${id}`
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

  const handleWithdrawAmountChange = (event) => {
    let amount = parseFloat(event.target.value);
    const maxWithdrawAmount = totalSavingAmount - 20;

    if (amount > maxWithdrawAmount) {
      amount = maxWithdrawAmount;
    }

    setWithDrawAmount(amount);

    let calculatedAmount = 0;
    if (savingDetails) {
      const { SavingType, SavingTime } = savingDetails;
      if (SavingType === "সাধারণ") {
        if (totalSavingAmount >= 200) {
          calculatedAmount = Math.round(amount * 0.06);
        }
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
          savingCurrentBlance !== null ? [savingCurrentBlance] : null,
        totalSavingAmount:
          totalSavingAmount !== null ? [totalSavingAmount] : null,
        withDrawAmount: withDrawAmount !== "" ? [withDrawAmount] : null,
        calculatedInterest:
          calculatedInterest !== "" ? [calculatedInterest] : null,
        withdrawDate: withdrawDate !== "" ? [withdrawDate] : null,
      };

      try {
        const response = await fetch(
          "https://ashalota.gandhipoka.com/saving-withdraw",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

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
    <div className="bg-light mt-2">
      <div className="mt-2 p-2">
        <form>
          <div>
            <div className="">
              <div className="border-bottom mb-3">
                <h2 className="text-center mb-4 pt-3">সঞ্চয় উত্তোলন</h2>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-3">
                <label htmlFor="SavingID" className="form-label">
                  সঞ্চয় ID:
                </label>
                <input
                  type="text"
                  id="SavingID"
                  className="form-control"
                  placeholder="Enter SavingID"
                  value={savingID}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {savingDetails && (
              <div className="mt-3 row">
                <div className="col-2">
                  <label htmlFor="memberID" className="form-label">
                    সদস্য ID
                  </label>
                  <input
                    type="text"
                    id="memberID"
                    className="form-control"
                    value={savingDetails.memberID || ""}
                    readOnly
                  />
                </div>

                <div className="col-2">
                  <label htmlFor="SavingName" className="form-label">
                    নাম
                  </label>
                  <input
                    type="text"
                    id="SavingName"
                    className="form-control"
                    value={savingDetails.SavingName || ""}
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
                    value={savingDetails.fathername || ""}
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
                    value={savingDetails.SavingBranch || ""}
                    readOnly
                  />
                </div>

                <div className="col-3">
                  <label htmlFor="SavingCenter" className="form-label">
                    কেন্দ্র
                  </label>
                  <input
                    id="SavingCenter"
                    type="text"
                    className="form-control"
                    value={savingDetails.SavingCenter || ""}
                    readOnly
                  />
                </div>

                <div className="col-3 mt-3">
                  <label htmlFor="SavingMobile" className="form-label">
                    মোবাইল:
                  </label>
                  <input
                    type="number"
                    id="SavingMobile"
                    className="form-control"
                    value={savingDetails.SavingMobile || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-4  mt-3">
                  <label htmlFor="SavingType" className="form-label">
                    সঞ্চয়ের ধরণ
                  </label>
                  <input
                    id="SavingType"
                    className="form-control"
                    type="text"
                    name="SavingType"
                    value={savingDetails.SavingType || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-4  mt-3">
                  <label htmlFor="SavingTime" className="form-label">
                    সঞ্চয়ের সময়কাল
                  </label>
                  <input
                    id="SavingTime"
                    className="form-control"
                    type="text"
                    name="SavingTime"
                    value={savingDetails.SavingTime || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-4  mt-3">
                  <label htmlFor="totalSavings" className="form-label">
                    মোট সঞ্চয়ের পরিমাণ
                  </label>
                  <input
                    id="totalSavings"
                    className="form-control"
                    type="text"
                    name="totalSavings"
                    value={totalSavingAmount || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-4  mt-3 d-none">
                  <label htmlFor="LastOldWithdraw" className="form-label">
                    আগের সঞ্চয় উত্তোলন
                  </label>
                  <input
                    id="LastOldWithdraw"
                    className="form-control"
                    type="text"
                    name="totalSavings"
                    value={lastOldWithdraw}
                    readOnly
                  />
                </div>

                <div className="col-md-4  mt-3">
                  <label htmlFor="WithDrawAmount" className="form-label">
                    উত্তোলনের পরিমাণ
                  </label>
                  <input
                    id="WithDrawAmount"
                    className="form-control"
                    type="number"
                    name="WithDrawAmount"
                    value={withDrawAmount}
                    onChange={handleWithdrawAmountChange}
                    max={totalSavingAmount - 20 || 0}
                  />
                </div>

                <div className="col-md-4  mt-3">
                  <label htmlFor="SavingInterest" className="form-label">
                    মোট উত্তোলনের পরিমাণ
                  </label>
                  <input
                    id="SavingInterest"
                    className="form-control"
                    type="number"
                    name="SavingInterest"
                    value={
                      parseFloat(withDrawAmount) +
                        parseFloat(calculatedInterest) || ""
                    }
                    readOnly
                  />
                </div>

                <div className="col-md-4 mt-3">
                  <label htmlFor="SavingCurrentBlance" className="form-label">
                    অবশিষ্ট সঞ্চয়ের পরিমাণ
                  </label>
                  <input
                    id="SavingCurrentBlance"
                    className="form-control"
                    type="text"
                    name="SavingCurrentBlance"
                    value={savingCurrentBlance || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-4 mt-3">
                  <label htmlFor="WithdrawDate" className="form-label">
                    উত্তোলনের তারিখ
                  </label>
                  <input
                    id="WithdrawDate"
                    className="form-control"
                    type="date"
                    value={withdrawDate}
                    onChange={handleWithdrawDateChange}
                  />
                </div>
              </div>
            )}
            {savingDetails && (
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </button>
              </div>
            )}
            {submitMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {submitMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsWithdraw;
