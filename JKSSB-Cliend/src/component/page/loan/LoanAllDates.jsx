// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/LoanDetails";

const LoanAllDates = () => {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();
  const [AllLoan, setAllLoan] = useState({});
  const [LoanDetails, setLoanDetails] = useState([]);
  const [installmentDateCount, setInstallmentDateCount] = useState(0);

  useEffect(() => {
    if (loanID) {
      // Fetch loan data
      fetch(`https://ashalota.gandhipoka.com/get-loan-loanid/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          const loanData =
            Array.isArray(data) && data.length > 0 ? data[0] : {};
          setAllLoan(loanData);
        })
        .catch((error) => console.error("Error fetching loan data:", error));

      // Fetch loan collection details
      fetch(`https://ashalota.gandhipoka.com/loan-collection-date/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          setLoanDetails(data.LoanDetails || {});
        })
        .catch((error) =>
          console.error("Error fetching loan collection details:", error)
        );

      // Fetch installment dates count
      fetch(`https://ashalota.gandhipoka.com/installment-dates-count/${loanID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setInstallmentDateCount(data[0].installmentDateCount);
          }
        })
        .catch((error) =>
          console.error("Error fetching installment dates count:", error)
        );
    }
  }, [loanID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  // Calculate TotalInstallmentTake
  const totalInstallmentTake =
    installmentDateCount * (AllLoan.installment || 0);

  // Conditional rendering to handle loading state
  if (!AllLoan || Object.keys(AllLoan).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form>
        <div className="">
          <div className="border-bottom mb-3">
            <h2 className="text-center mb-4 pt-3">
              কিস্তির বিস্তারিত তারিখ সমূহ
            </h2>
          </div>
        </div>

        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <label htmlFor="loanID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="loanID"
              className="form-control"
              defaultValue={AllLoan.loanID}
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
              defaultValue={AllLoan.memberID}
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
              defaultValue={AllLoan.OLname}
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
              value={AllLoan.OLmobile}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="loanType" className="form-label">
              ঋণের ধরণ
            </label>
            <input
              className="form-control"
              type="text"
              name="loanType"
              defaultValue={AllLoan.loanType}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="installment" className="form-label">
              কিস্তি (টাকা)
            </label>
            <input
              className="form-control"
              type="text"
              name="installment"
              defaultValue={AllLoan.installment}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="OLtotal" className="form-label">
              মোট ঋণের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="OLtotal"
              defaultValue={AllLoan.OLtotal}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="TotalInstallmentTake" className="form-label">
              কিস্তি জমা (টাকা)
            </label>
            <input
              className="form-control"
              type="text"
              name="TotalInstallmentTake"
              value={totalInstallmentTake}
              readOnly
            />
          </div>

          <div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {LoanDetails.installmentDate &&
                  LoanDetails.installmentDate.map((date, index) => (
                    <tr key={index}>
                      <td>{date}</td>
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

export default LoanAllDates;
