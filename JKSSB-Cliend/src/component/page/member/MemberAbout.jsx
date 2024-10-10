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
    fetch(`http://localhost:5000/member-callback/${memberID}`)
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
        <div className="row mb-4">
          <div className="col">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: "#f0f4f8", // Soft background for the header
                borderRadius: "10px", // Rounded edges for a modern look
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
              }}
            >
              <h2
                className="text-center mb-0"
                style={{
                  fontWeight: "bold",
                  color: "#2D3748",
                  fontSize: "2rem", // Larger text for prominence
                }}
              >
                <i className="fas fa-user"></i> সদস্য বিবরণ
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #2D3748", // Thicker line for emphasis
                marginTop: "10px",
              }}
            />
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-3">
            <label
              htmlFor="memberID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> সদস্য ID
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                type="text"
                name="ID"
                className="form-control border-primary"
                defaultValue={allBrands.memberID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="AdmissionDate"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-calendar-alt"></i> ভর্তি তারিখ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-calendar-alt"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="AdmissionDate"
                readOnly
                defaultValue={allBrands.AdmissionDate}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="BranchMember"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-code-branch"></i> শাখা নির্বাচন করুণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-code-branch"></i>
              </span>
              <input
                className="form-select border-primary"
                type="text"
                name="BranchMember"
                readOnly
                defaultValue={allBrands.BranchMember}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="CenterIDMember"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-map-marker-alt"></i> কেন্দ্র নির্বাচন করুণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <input
                className="form-select border-primary"
                type="text"
                name="CenterMember"
                readOnly
                defaultValue={allBrands.CenterIDMember}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberName"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user"></i> নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberName"
                defaultValue={allBrands.memberName}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="MfhName"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-friends"></i> পিতা/স্বামীর নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-friends"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="MfhName"
                defaultValue={allBrands.MfhName}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberJob"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-briefcase"></i> পেশা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-briefcase"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberJob"
                defaultValue={allBrands.memberJob}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberVillage"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-home"></i> গ্রাম/পাড়া
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-home"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberVillage"
                defaultValue={allBrands.memberVillage}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberUnion"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-map-signs"></i> ইউনিয়ন
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-map-signs"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberUnion"
                defaultValue={allBrands.memberUnion}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberPost"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-mail-bulk"></i> ডাকঘর
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-mail-bulk"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberPost"
                defaultValue={allBrands.memberPost}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberSubDic"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-map-marker-alt"></i> থানা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberSubDic"
                defaultValue={allBrands.memberSubDic}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberDic"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-map"></i> জেলা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-map"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberDic"
                defaultValue={allBrands.memberDic}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberMarital"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-heart"></i> বৈবাহিক অবস্থা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-heart"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberMarital"
                defaultValue={allBrands.memberMarital}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberStudy"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-heart"></i> শিক্ষাগত যোগ্যতা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-heart"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberStudy"
                defaultValue={allBrands.memberStudy}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="memberFhead"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-tie"></i> পরিবারের প্রধানের নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-tie"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="memberFhead"
                defaultValue={allBrands.memberFhead}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="EarningMember"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-users"></i> পরিবারের উপার্জনকারী সদস্য সংখ্যা
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-users"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="EarningMember"
                defaultValue={allBrands.EarningMember}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="YearlyIncome"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-money-bill-wave"></i> পরিবারের মোট বার্ষিক আয়
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-money-bill-wave"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="YearlyIncome"
                defaultValue={allBrands.YearlyIncome}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="LandProperty"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-tree"></i> মোট জমির পরিমাণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-tree"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="LandProperty"
                defaultValue={allBrands.LandProperty}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="TotalMoney"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-coins"></i> মোট সম্পদের পরিমাণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-coins"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="TotalMoney"
                defaultValue={allBrands.TotalMoney}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="MemberNIDnumber"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> NID নাম্বার
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="MemberNIDnumber"
                defaultValue={allBrands.MemberNIDnumber}
                readOnly
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="MemberMobile"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-mobile-alt"></i> মোবাইল নাম্বার
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-mobile-alt"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="MemberMobile"
                defaultValue={allBrands.MemberMobile}
                readOnly
              />
            </div>
          </div>

          <div className="mb-5 mt-5 text-center">
            <h2
              className="mb-4"
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#343a40", // Change this color as needed
              }}
            >
              নমনী তথ্য
            </h2>
            <div
              className="underline mx-auto"
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#007bff",
                borderRadius: "5px",
              }}
            ></div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="NominiName"
              className="form-label"
              style={{
                fontWeight: "bold",
                color: "#1A202C",
                fontSize: "0.9rem",
              }}
            >
              <i className="fas fa-user-tag"></i> নমনীর নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="NominiName"
                defaultValue={allBrands.NominiName}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="NominiNID"
              className="form-label"
              style={{
                fontWeight: "bold",
                color: "#1A202C",
                fontSize: "0.9rem",
              }}
            >
              <i className="fas fa-user-tag"></i> নমনীর NID
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-id-card"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="NominiNID"
                defaultValue={allBrands.NominiNID}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="NominiFather"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-tie"></i> পিতা/স্বামীর নাম
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-tie"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="NominiFather"
                defaultValue={allBrands.NominiFather}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="MemberNominiRelation"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-friends"></i> সম্পর্ক
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control border-primary"
                type="text"
                name="MemberNominiRelation"
                defaultValue={allBrands.MemberNominiRelation}
                readOnly
              />
            </div>
          </div>

          <div className="mb-5 mt-5 text-center">
            <h2
              className="mb-4"
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#343a40", // Change this color as needed
              }}
            >
              সদস্যের ঋণ তালিকা
            </h2>
            <div
              className="underline mx-auto"
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#007bff",
                borderRadius: "5px",
              }}
            ></div>
          </div>

          <div className="mb-5 mt-5 text-center">
            <h2
              className="mb-4"
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#343a40", // Change this color as needed
              }}
            >
              সদস্যের সঞ্চয় তালিকা
            </h2>
            <div
              className="underline mx-auto"
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#007bff",
                borderRadius: "5px",
              }}
            ></div>
          </div>
          {/* <button
            type="button"
            onClick={handleCancel}
            className=" btn btn-primary btn-md"
          >
            Cancel
          </button> */}

          <div className="d-flex justify-content-center mb-3 mt-5">
            <button
              type="button"
              className="btn btn-primary btn-lg shadow"
              onClick={handleCancel}
              style={{
                background: "linear-gradient(45deg, #007bff, #00d4ff)",
                color: "#fff",
              }}
            >
              <i className="fas fa-paper-plane"></i> Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberAbout;
