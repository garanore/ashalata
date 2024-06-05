// MemberEdit.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

const MEMBER_LIST_CENTER_ROUTE = "/home/MemberListCenter";

const MemberAbout = () => {
  const location = useLocation();
  const memberID = location.state ? location.state.memberID : null;
  const navigate = useNavigate();
  const [allBrands, setAllBrands] = useState({});

  useEffect(() => {
    // Fetch member data
    fetch(`https://ashalota.gandhipoka.com/member-callback/${memberID}`)
      .then((res) => res.json())
      .then((data) => setAllBrands(data))
      .catch((error) => console.error("Error fetching member data:", error));
  }, [memberID]);

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">সদস্য বিবরণ </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="memberID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="ID"
              className="form-control"
              defaultValue={allBrands.memberID}
              readOnly
            />
          </div>

          <div className="mb-3 col-3">
            <label htmlFor="AdmissionDate" className="form-label">
              ভর্তি তারিখ
            </label>
            <input
              className="form-control"
              type="text"
              name="AdmissionDate"
              readOnly
              defaultValue={allBrands.AdmissionDate}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="CenterMember" className="form-label">
              কেন্দ্র নির্বাচন করুণ
            </label>
            <input
              className="form-control"
              type="text"
              name="CenterMember"
              readOnly
              defaultValue={allBrands.CenterIDMember}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="memberName" className="form-label">
              নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="memberName"
              defaultValue={allBrands.memberName}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="MfhName" className="form-label">
              পিতা/স্বামীর নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="MfhName"
              defaultValue={allBrands.MfhName}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberJob" className="form-label">
              পেশা
            </label>
            <input
              className="form-control"
              type="text"
              name="memberJob"
              defaultValue={allBrands.memberJob}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberVillage" className="form-label">
              গ্রাম/পাড়া
            </label>
            <input
              className="form-control"
              type="text"
              name="memberVillage"
              defaultValue={allBrands.memberVillage}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberUnion" className="form-label">
              ইউনিয়ন
            </label>
            <input
              className="form-control"
              type="text"
              name="memberUnion"
              defaultValue={allBrands.memberUnion}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberPost" className="form-label">
              ডাকঘর
            </label>
            <input
              className="form-control"
              type="text"
              name="memberPost"
              defaultValue={allBrands.memberPost}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberSubDic" className="form-label">
              থানা
            </label>
            <input
              className="form-control"
              type="text"
              name="memberSubDic"
              defaultValue={allBrands.memberSubDic}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberDic" className="form-label">
              জেলা
            </label>
            <input
              className="form-control"
              type="text"
              name="memberDic"
              defaultValue={allBrands.memberDic}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="memberFhead" className="form-label">
              পরিবারের প্রধানের নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="memberFhead"
              defaultValue={allBrands.memberFhead}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="MemberNIDnumber" className="form-label">
              NID নাম্বার
            </label>
            <input
              className="form-control"
              type="text"
              name="MemberNIDnumber"
              defaultValue={allBrands.MemberNIDnumber}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="MemberMobile" className="form-label">
              মোবাইল নাম্বার
            </label>
            <input
              className="form-control"
              type="text"
              name="MemberMobile"
              defaultValue={allBrands.MemberMobile}
              readOnly
            />
          </div>
          <div className="mb-5 mt-5">
            <h2 className="text-center mb-4 ">নমনী তথ্য </h2>
          </div>

          <div className="col-md-4">
            <label htmlFor="NominiName" className="form-label">
              নমনীর নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="NominiName"
              defaultValue={allBrands.NominiName}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="NominiFather" className="form-label">
              পিতা/স্বামীর নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="NominiFather"
              defaultValue={allBrands.NominiFather}
              readOnly
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="MemberNominiRelation" className="form-label">
              সম্পর্ক
            </label>
            <input
              className="form-control"
              type="text"
              name="MemberNominiRelation"
              defaultValue={allBrands.MemberNominiRelation}
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

export default MemberAbout;
