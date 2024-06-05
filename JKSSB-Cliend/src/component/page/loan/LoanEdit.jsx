// MemberEdit.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MEMBER_LIST_CENTER_ROUTE = "/home/LoanDetails";

const loanTypeTranslations = {
  normal: "সাধারণ ঋণ",
  tubewell: "নলকূপ ঋণ",
  farmer: "কৃষি ঋণ",
  sme: "এস এম ই ঋণ",
  emergency: "জরুরী ঋণ",
  disaster: "দুর্যোগ ঋণ",
  daily: "দৈনিক ঋণ",
};

const LoanEdit = () => {
  const location = useLocation();
  const loanID = location.state ? location.state.loanID : null;
  const navigate = useNavigate();

  const [loanType, setLoanType] = useState("");
  const [LoanEdits, setLoanEdits] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch(
          `https://ashalota.gandhipoka.com/get-loan-loanid/${loanID}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const loanData = data[0];
          setLoanEdits(loanData);
          setLoanType(loanData.loanType); // Set loanType state
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (loanID) {
      fetchLoanData();
    }

    axios
      .get("https://ashalota.gandhipoka.com/center-callback")
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  }, [loanID]);
  // Inside the return statement, check the value prop of the select element

  const handleUpdateLoan = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData);
    setSubmitMessage("Successfully Updated!");

    // Add updated AdmissionDate

    updatedData.installmentStart = LoanEdits.installmentStart;
    // Add updated AdmissionDate
    updatedData.CenterIDMember = LoanEdits.OLcenter;
    updatedData.OLmobile = LoanEdits.OLmobile;
    updatedData.loanType = LoanEdits.loanType;

    // Send updated data to server
    fetch(`https://ashalota.gandhipoka.com/loan-callback/${loanID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update allBrands state with the updated data from the server
          setLoanEdits(data.updatedMember);
        } else {
          console.error("Member Update Failed");
        }
      })
      .catch((error) => {
        console.error("Error updating member:", error);
      });
  };

  const handleLoanTypeChange = (e) => {
    const selectedLoanType = e.target.value;
    setLoanEdits({ ...LoanEdits, loanType: selectedLoanType });
  };

  const handleCenterChange = (e) => {
    const selectedCenter = e.target.value;
    setLoanEdits({ ...LoanEdits, OLcenter: selectedCenter });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateLoan}>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">ঋণ সম্পাদনা </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="loanID" className="form-label">
              ঋণ ID
            </label>
            <input
              type="text"
              name="loanID"
              className="form-control"
              defaultValue={LoanEdits.loanID}
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
              name="ID"
              defaultValue={LoanEdits.memberID}
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
              defaultValue={LoanEdits.OLname}
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
              defaultValue={LoanEdits.fathername}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="OLcenter" className="form-label">
              কেন্দ্র নির্বাচন করুণ
            </label>
            <select
              className="form-select"
              id="OLcenter"
              value={LoanEdits.OLcenter} // Set the value to the state
              onChange={handleCenterChange}
            >
              <option value="">Choose...</option>
              {centers.map((center) => (
                <option key={center._id} value={center.centerID}>
                  {center.centerID}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="OLmobile" className="form-label">
              মোবাইল
            </label>
            <input
              className="form-control"
              type="number"
              name="OLmobile"
              defaultValue={LoanEdits.OLmobile}
            />
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="loanType" className="form-label">
              ঋণের ধরণ
            </label>
            <select
              className="form-select"
              id="loanType"
              value={loanType}
              onChange={handleLoanTypeChange}
            >
              <option value="">Choose...</option>
              {Object.entries(loanTypeTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="OLamount" className="form-label">
              ঋণের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="OLamount"
              defaultValue={LoanEdits.OLamount}
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
              defaultValue={LoanEdits.OLtotal}
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
              defaultValue={LoanEdits.installment}
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
              defaultValue={LoanEdits.CenterDay}
              readOnly
            />
          </div>

          <div className="d-flex justify-content-between mt-5">
            <button type="submit" className=" btn btn-primary">
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className=" btn btn-primary btn-md"
            >
              Cancel
            </button>
          </div>
          <div>
            {submitMessage && (
              <div className="alert alert-success" role="alert">
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanEdit;
