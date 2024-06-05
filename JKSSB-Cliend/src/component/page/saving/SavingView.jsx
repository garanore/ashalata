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
      fetch(`https://ashalota.gandhipoka.com/get-saving-savingid/${SavingID}`)
        .then((res) => res.json())
        .then((data) => {
          // If data is an array, access the first item
          const savingData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllSaving(savingData);
        })
        .catch((error) => console.error("Error fetching saving data:", error));

      // Fetch total saving amount
      fetch(
        `https://ashalota.gandhipoka.com/saving-collection-total/${SavingID}`
      )
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
        <div className=" ">
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">সঞ্চয় বিস্তারিত</h2>
          </div>
        </div>

        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <label htmlFor="SavingID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="SavingID"
              className="form-control"
              defaultValue={AllSaving.SavingID}
              readOnly
            />
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="installmentStart" className="form-label">
              সঞ্চয় শুরু
            </label>
            <input
              type="text"
              name="installmentStart"
              className="form-control"
              value={AllSaving.installmentStart || ""} // Check if AllSaving.installmentStart exists, if not, use an empty string
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="memberID" className="form-label">
              সদস্য ID
            </label>
            <input
              className="form-control"
              type="text"
              name="memberID"
              defaultValue={AllSaving.memberID}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="SavingName" className="form-label">
              সদস্য নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="SavingName"
              defaultValue={AllSaving.SavingName}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="fathername" className="form-label">
              পিতা/স্বামীর নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="fathername"
              defaultValue={AllSaving.fathername}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingBranch" className="form-label">
              শাঁখা
            </label>
            <input
              type="text"
              id="SavingBranch"
              className="form-control"
              value={AllSaving.SavingBranch}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingCenter" className="form-label">
              কেন্দ্র
            </label>
            <input
              type="text"
              id="SavingCenter"
              className="form-control"
              value={AllSaving.SavingCenter}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingMobile" className="form-label">
              মোবাইল:
            </label>
            <input
              type="number"
              id="SavingMobile"
              className="form-control"
              value={AllSaving.SavingMobile}
              readOnly
            ></input>
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingType" className="form-label">
              সঞ্চয়ের ধরণ
            </label>
            <input
              className="form-control"
              type="text"
              name="SavingType"
              defaultValue={AllSaving.SavingType}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingTime" className="form-label">
              সঞ্চয়ের সময়
            </label>
            <input
              className="form-control"
              type="text"
              name="SavingTime"
              defaultValue={AllSaving.SavingTime}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="SavingAmount" className="form-label">
              সঞ্চয়ের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="SavingAmount"
              defaultValue={AllSaving.SavingAmount}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="TotalSavingAmount" className="form-label">
              মোট সঞ্চয়ের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="TotalSavingAmount"
              value={totalSavingAmount}
              readOnly
            />
          </div>

          <div className="col-3">
            <label htmlFor="CenterDay" className="form-label">
              কেন্দ্র বার
            </label>
            <input
              className="form-control"
              type="text"
              name="installment"
              defaultValue={AllSaving.CenterDay}
              readOnly
            />
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-primary btn-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SavingView;
