// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/SavingsDetails";

const SavingAllDates = () => {
  const location = useLocation();
  const SavingID = location.state ? location.state.SavingID : null;
  const navigate = useNavigate();
  const [AllSaving, setAllSaving] = useState({});
  const [totalSavingAmount, setTotalSavingAmount] = useState(0);
  const [savingDetails, setSavingDetails] = useState([]);

  useEffect(() => {
    if (SavingID) {
      // Fetch saving data
      fetch(`https://ashalota.gandhipoka.com/get-saving-savingid/${SavingID}`)
        .then((res) => res.json())
        .then((data) => {
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

      // Fetch saving collection details
      fetch(
        `https://ashalota.gandhipoka.com/saving-collection-date-amount/${SavingID}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSavingDetails(data.savingDetails || []);
        })
        .catch((error) =>
          console.error("Error fetching saving collection details:", error)
        );
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
            <h2 className="text-center mb-4 pt-3">
              সঞ্চয়ের বিস্তারিত তারিখ সমূহ
            </h2>
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

          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                {savingDetails.savingCollecting &&
                  savingDetails.savingCollectionDate &&
                  savingDetails.savingCollecting.map((collecting, index) => (
                    <tr key={index}>
                      <td>{savingDetails.savingCollectionDate[index]}</td>
                      <td>{collecting}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

export default SavingAllDates;
