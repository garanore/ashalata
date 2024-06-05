//Every Loan View

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/LoanDetails";

const LoanView = () => {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();
  const [allLoans, setAllLoans] = useState({});

  useEffect(() => {
    if (loanID) {
      fetch(`https://ashalota.gandhipoka.com/get-loan-loanid/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          // If data is an array, access the first item
          const loanData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllLoans(loanData);
        })
        .catch((error) => console.error("Error fetching loan data:", error));
    }
  }, [loanID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  // // // Conditional rendering to handle loading state
  // if (!allLoans || Object.keys(allLoans).length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">ঋণ বিস্তারিত </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="loanID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="loanID"
              className="form-control"
              defaultValue={allLoans.loanID}
              readOnly
            />
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="installmentStart" className="form-label">
              কিস্তি শুরু
            </label>
            <input
              type="text"
              name="installmentStart"
              className="form-control"
              value={allLoans.installmentStart || ""} // Check if allLoans.installmentStart exists, if not, use an empty string
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
              defaultValue={allLoans.memberID}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="OLname" className="form-label">
              সদস্য নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="OLname"
              defaultValue={allLoans.OLname}
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
              defaultValue={allLoans.fathername}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="OLbranch" className="form-label">
              শাঁখা
            </label>
            <input
              type="text"
              id="OLbranch"
              className="form-control"
              value={allLoans.OLbranch}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="OLcenter" className="form-label">
              কেন্দ্র
            </label>
            <input
              type="text"
              id="OLcenter"
              className="form-control"
              value={allLoans.OLcenter}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="OLmobile" className="form-label">
              মোবাইল:
            </label>
            <input
              type="number"
              id="OLmobile"
              className="form-control"
              value={allLoans.OLmobile}
              readOnly
            ></input>
          </div>
          <div className="col-md-4">
            <label htmlFor="loanType" className="form-label">
              ঋণের ধরণ
            </label>
            <input
              className="form-control"
              type="text"
              name="loanType"
              defaultValue={allLoans.loanType}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="OLamount" className="form-label">
              ঋণের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="OLamount"
              defaultValue={allLoans.OLamount}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="OLtotal" className="form-label">
              মোট টাকা
            </label>
            <input
              className="form-control"
              type="text"
              name="OLtotal"
              defaultValue={allLoans.OLtotal}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="installment" className="form-label">
              কিস্তির পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="installment"
              defaultValue={allLoans.installment}
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
              defaultValue={allLoans.CenterDay}
              readOnly
            />
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className=" btn btn-primary btn-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanView;
