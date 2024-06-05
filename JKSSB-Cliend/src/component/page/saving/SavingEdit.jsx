// Saving Edit

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MEMBER_LIST_CENTER_ROUTE = "/home/SavingsDetails";

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

const SavingEdit = () => {
  const location = useLocation();
  const SavingID = location.state ? location.state.SavingID : null;
  const navigate = useNavigate();

  const [SavingType, setSavingType] = useState("");
  const [SavingTime, setSavingTime] = useState("");
  const [SavingEdit, setSavingEdit] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await fetch(
          `https://ashalota.gandhipoka.com/get-saving-savingid/${SavingID}`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const SavingData = data[0];
          setSavingEdit(SavingData);
          setSavingType(SavingData.SavingType);
          setSavingTime(SavingData.SavingTime);
        }
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    if (SavingID) {
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
  }, [SavingID]);
  // Inside the return statement, check the value prop of the select element

  const handleUpdateSaving = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData);
    setSubmitMessage("Successfully Updated!");

    // Add updated AdmissionDate

    updatedData.installmentStart = SavingEdit.installmentStart;
    // Add updated AdmissionDate
    updatedData.CenterIDMember = SavingEdit.SavingCenter;
    updatedData.SavingMobile = SavingEdit.SavingMobile;
    updatedData.SavingType = SavingEdit.SavingType;

    // Send updated data to server
    fetch(`https://ashalota.gandhipoka.com/saving-callback/${SavingID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // console.log("Member Updated Successfully");
          // Update allBrands state with the updated data from the server
          setSavingEdit(data.updatedMember);
        } else {
          console.error("Member Update Failed");
        }
      })
      .catch((error) => {
        console.error("Error updating member:", error);
      });
  };

  const handleSavingTypeChange = (e) => {
    const selectedSavingType = e.target.value;
    setSavingEdit({ ...SavingEdit, SavingType: selectedSavingType });
  };
  const handleSavingTimeChange = (e) => {
    const selectedSavingTime = e.target.value;
    setSavingEdit({ ...SavingEdit, SavingTime: selectedSavingTime });
  };

  const handleCenterChange = (e) => {
    const selectedCenter = e.target.value;
    setSavingEdit({ ...SavingEdit, SavingCenter: selectedCenter });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateSaving}>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">সঞ্চয় সম্পাদনা </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="SavingID" className="form-label">
              সঞ্চয় ID
            </label>
            <input
              type="text"
              name="SavingID"
              className="form-control"
              defaultValue={SavingEdit.SavingID}
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
              defaultValue={SavingEdit.memberID}
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
              defaultValue={SavingEdit.SavingName}
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
              defaultValue={SavingEdit.fathername}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="SavingCenter" className="form-label">
              কেন্দ্র নির্বাচন করুণ
            </label>
            <select
              className="form-select"
              id="SavingCenter"
              value={SavingEdit.SavingCenter} // Set the value to the state
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
            <label htmlFor="SavingMobile" className="form-label">
              মোবাইল
            </label>
            <input
              className="form-control"
              type="number"
              name="SavingMobile"
              defaultValue={SavingEdit.SavingMobile}
            />
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="SavingType" className="form-label">
              সঞ্চয়ের ধরণ
            </label>
            <select
              className="form-select"
              id="SavingType"
              value={SavingType}
              onChange={handleSavingTypeChange}
            >
              <option value="">Choose...</option>
              {Object.entries(SavingTypeTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 col-3">
            <label htmlFor="SavingTime" className="form-label">
              সঞ্চয়ের সময়
            </label>
            <select
              className="form-select"
              id="SavingTime"
              value={SavingTime}
              onChange={handleSavingTimeChange}
            >
              <option value="">Choose...</option>
              {Object.entries(SavingTimeTranslations).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="SavingAmount" className="form-label">
              সঞ্চয়ের পরিমাণ
            </label>
            <input
              className="form-control"
              type="text"
              name="SavingAmount"
              defaultValue={SavingEdit.SavingAmount}
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
              defaultValue={SavingEdit.CenterDay}
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

export default SavingEdit;
