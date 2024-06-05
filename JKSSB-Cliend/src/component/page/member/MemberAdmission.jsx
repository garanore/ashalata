/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePickers from "../../datepicker/DatePicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import axios from "axios";
const API_URL = "https://ashalota.gandhipoka.com/memberdmission";

const MemberAdmission = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [memberID, setMemberID] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState({});

  const [memberData, setmemberData] = useState({
    BranchMember: "",
    CenterIDMember: "",
    CenterNameMember: "",
    memberID: "",
    AdmissionDate: null,
    memberName: "",
    MfhName: "",
    MdateOfBirth: "",
    memberJob: "",
    memberVillage: "",
    memberUnion: "",
    memberPost: "",
    memberSubDic: "",
    memberDic: "",
    memberMarital: "",
    memberStudy: "",
    memberFhead: "",
    memberfMM: "",
    memberfMF: "",
    memberfMTotal: "",
    EarningMember: "",
    FamilyMemberENO: "",
    loanamount: "",
    nonorganizaiotnloan: "",
    YearlyIncome: "",
    LandProperty: "",
    TotalMoney: "",
    MemberNIDnumber: "",
    MemberMobile: "",
    NominiName: "",
    NominiFather: "",
    MemberNominiRelation: "",
    AdmissionFee: "20",
    FormFee: "30",
    agreementChecked: false,
  });

  // For Date Of Birth Change----------------------------------------------------------------
  const handleDateChange = (date) => {
    setmemberData({
      ...memberData,
      MdateOfBirth: date,
    });
  };

  // For Admission Date Change--------------------------------------------
  const handleAdmissionDateChange = (date) => {
    // Extract the date part from the selected date
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    // Update the AdmissionDate field with the formatted date
    setmemberData({
      ...memberData,
      AdmissionDate: formattedDate,
    });
  };

  // For Generate ID -----------------------------------------------

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMemberCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setMemberCount(count);
      setMemberID(generateMemberID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  useEffect(() => {
    fetchMemberCount();
  }, [fetchMemberCount]);

  const generateMemberID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `M${paddedCount}`;
  };

  // for Cenetr change--------------------------------------

  const handleCenterChange = (e) => {
    const selectedCenterID = e.target.value;

    axios
      .get(
        `https://ashalota.gandhipoka.com/center-callback-id/${selectedCenterID}`
      )
      .then((response) => {
        const center = response.data;

        setSelectedCenter(center[0]); // Update to use center[0]
        setmemberData((prevData) => ({
          ...prevData,
          CenterIDMember: selectedCenterID, // Set CenterIDMember as ID
          CenterNameMember: center[0].CenterName,
        }));
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  };

  //For Branch Callbacks----------------------------------------------------------------
  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    const { name, value } = e.target;

    setSelectedBranch(branch);

    if (branch) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/center-callback?selectedBranch=${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          setCenters(response.data);
        })
        .catch((error) => {
          console.error("Error fetching worker data:", error);
        });
    }
    if (name === "BranchMember") {
      setSelectedBranch(value);
      setmemberData((prevData) => ({
        ...prevData,
        BranchMember: value,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericValue = name === "WorkerNID" ? parseInt(value, 10) : value;

    // Handle the specific fields for loanamount and nonorganizaiotnloan
    if (name === "loanamount" || name === "nonorganizaiotnloan") {
      setmemberData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      // For other fields
      setmemberData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : numericValue,
      }));
    }

    // Handle date field separately
    if (name === "MdateOfBirth") {
      const formattedDate = value ? value.toISOString() : null;
      setmemberData((prevData) => ({
        ...prevData,
        MdateOfBirth: formattedDate,
      }));
    }

    // Handle FamilyMemberENO and showInputs logic
    if (name === "FamilyMemberENO") {
      setShowInputs(value === "yes");
    }

    // Handle memberfMM and memberfMF separately
    if (name === "memberfMM" || name === "memberfMF") {
      setmemberData((prevData) => ({
        ...prevData,
        [name]: numericValue,
        memberfMTotal:
          parseInt(prevData.memberfMM || 0) + parseInt(prevData.memberfMF || 0),
      }));
    }
  };

  // For Submit method --------------------------------------------------------
  const handleSubmit = async () => {
    try {
      const response = await axios.post(API_URL, {
        memberID: memberData.memberID,
        loanamount: memberData.loanamount,
        nonorganizaiotnloan: memberData.nonorganizaiotnloan,
        ...memberData,
      });

      setSubmitMessage("Successfully submitted!");

      setMemberCount(memberCount + 1);
      setMemberID(generateMemberID());
      setmemberData(() => ({
        BranchMember: "",
        CenterIDMember: "", // Reset CenterIDMember
        CenterNameMember: "", // Reset CenterNameMember
        memberID: "",
        AdmissionDate: "",
        memberName: "",
        MfhName: "",
        memberJob: "",
        memberVillage: "",
        memberUnion: "",
        memberPost: "",
        MdateOfBirth: "",
        memberSubDic: "",
        memberDic: "",
        memberMarital: "",
        memberStudy: "",
        memberFhead: "",
        memberfMM: "",
        memberfMF: "",
        memberfMTotal: "",
        EarningMember: "",
        FamilyMemberENO: "",
        loanamount: "",
        nonorganizaiotnloan: "",
        YearlyIncome: "",
        LandProperty: "",
        TotalMoney: "",
        MemberNIDnumber: "",
        BranchMobile: "",
        NominiName: "",
        NominiFather: "",
        MemberNominiRelation: "",
        AdmissionFee: "20",
        FormFee: "30",
      }));

      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className=" bg-light mt-2 ">
      <div className="mb-5 ">
        <h2 className="text-center  border-bottom mb-4 pt-3">
          সদস্য ভর্তি ফর্ম{" "}
        </h2>
      </div>

      <form className="container-fluid p-2">
        <div className="row  g-4 bg-light">
          <div className="row mt-5 p-4">
            <div className="col-3">
              <div className="col-md-6">
                <label htmlFor="BranchMember" className="form-label">
                  শাঁখা নির্বাচন করুণ
                </label>
                <select
                  id="BranchMember"
                  className="form-select"
                  value={selectedBranch.BranchMember}
                  onChange={handleBranchChange}
                  name="BranchMember"
                >
                  <option value="">Choose...</option>
                  {Array.isArray(branches) &&
                    branches.length > 0 &&
                    branches.map((branch) => (
                      <option key={branch._id} value={branch.BranchName}>
                        {branch.BranchName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-3">
              <div className="col-md-6">
                <label htmlFor="CenterIDMember" className="form-label">
                  কেন্দ্র নির্বাচন করুণ
                </label>
                <select
                  id="CenterIDMember"
                  name="CenterIDMember"
                  className="form-select"
                  value={memberData.CenterMember}
                  onChange={handleCenterChange} // Update to use handleCenterChange
                >
                  <option value="">Choose...</option>
                  {centers.map((center) => (
                    <option key={center.centerID} value={center.centerID}>
                      {center.centerID}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-3 mb-3">
              <label htmlFor="CenterNameMember" className="form-label">
                কেন্দ্র নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="CenterNameMember"
                value={selectedCenter.CenterName || ""}
                readOnly
              />
            </div>

            <div className="col-3">
              <div className="row g-3 align-items-center ">
                <div>
                  <div className="mb-3">
                    <label htmlFor="memberID" className="form-label">
                      সদস্য ID:
                    </label>
                    <input
                      type="text"
                      id="memberID"
                      className="form-control"
                      value={memberID}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* সদস্য তথ্য শুরু  */}

          <div className="row mb-3 ">
            <div className="col-3">
              <label htmlFor="AdmissionDate" className="form-label">
                ভর্তি তারিখ
              </label>

              <div>
                <DatePicker
                  id="AdmissionDate"
                  className="form-control"
                  selected={
                    memberData.AdmissionDate
                      ? new Date(memberData.AdmissionDate)
                      : null
                  }
                  onChange={handleAdmissionDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col-md-3">
              <label htmlFor="memberName" className="form-label">
                নাম
              </label>
              <input
                id="memberName"
                className="form-control"
                type="text"
                value={memberData.memberName}
                onChange={handleChange}
                name="memberName"
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="MfhName" className="form-label">
                পিতা/স্বামীর নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="MfhName"
                onChange={handleChange}
                name="MfhName"
                value={memberData.MfhName}
                required
              ></input>
            </div>
            <div className="col-3">
              <DatePickers
                selectedDate={memberData.MdateOfBirth}
                onDateChange={handleDateChange}
              />
            </div>
          </div>

          <div className="row mb-3 ">
            <div className="col-md-2">
              <label htmlFor="memberJob" className="form-label">
                পেশা
              </label>
              <input
                type="text"
                className="form-control"
                id="memberJob"
                onChange={handleChange}
                name="memberJob"
                value={memberData.memberJob}
                required
              ></input>
            </div>

            <div className="col-md-6">
              <label htmlFor="memberVillage" className="form-label">
                গ্রাম/পাড়া
              </label>
              <input
                type="text"
                className="form-control"
                id="memberVillage"
                onChange={handleChange}
                name="memberVillage"
                value={memberData.memberVillage}
                required
              ></input>
            </div>

            <div className="col-md-4">
              <label htmlFor="memberUnion" className="form-label">
                ইউনিয়ন
              </label>
              <input
                type="text"
                className="form-control"
                id="memberUnion"
                onChange={handleChange}
                name="memberUnion"
                value={memberData.memberUnion}
                required
              ></input>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3">
              <label htmlFor="memberPost" className="form-label">
                ডাকঘর
              </label>
              <input
                type="text"
                className="form-control"
                id="memberPost"
                onChange={handleChange}
                name="memberPost"
                value={memberData.memberPost}
                required
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="memberSubDic" className="form-label">
                থানা
              </label>
              <input
                type="text"
                className="form-control"
                id="memberSubDic"
                onChange={handleChange}
                name="memberSubDic"
                value={memberData.memberSubDic}
                required
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="memberDic" className="form-label">
                জেলা
              </label>
              <input
                type="text"
                className="form-control"
                id="memberDic"
                onChange={handleChange}
                name="memberDic"
                value={memberData.memberDic}
                required
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="memberMarital" className="form-label">
                বৈবাহিক অবস্থা
              </label>
              <select
                id="memberMarital"
                className="form-select"
                name="memberMarital"
                value={memberData.memberMarital}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option>অবিবাহিত</option>
                <option>বিবাহিত</option>
                <option>তালাকপ্রাপ্ত</option>
                <option>বিধবা</option>
                <option>অন্যান্য</option>
              </select>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-3">
              <label htmlFor="memberStudy" className="form-label">
                শিক্ষাগত যোগ্যতা
              </label>
              <select
                id="memberStudy"
                className="form-select"
                name="memberStudy"
                value={memberData.memberStudy}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option>স্বাক্ষর জ্ঞান সম্পন্ন</option>
                <option>প্রাথমিক</option>
                <option>মাধ্যমিক</option>
                <option>উচ্চমাধ্যমিক</option>
                <option>স্নাতক</option>
                <option>স্নাতকোত্তর</option>
              </select>
            </div>

            <div className="col-md-3 ">
              <label htmlFor="memberFhead" className="form-label">
                পরিবারের প্রধানের নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="memberFhead"
                onChange={handleChange}
                name="memberFhead"
                value={memberData.memberFhead}
                required
              ></input>
            </div>

            <div className="col-2">
              <label htmlFor="memberfMM" className="col-form-label">
                পরিবারের সদস্য সংখ্যা (পুরুষ)
              </label>
              <input
                type="number"
                className="form-control"
                id="memberfMM"
                onChange={handleChange}
                name="memberfMM"
                value={memberData.memberfMM}
                required
              />
            </div>

            <div className="col-2">
              <label htmlFor="memberfMF" className="col-form-label">
                মহিলা
              </label>
              <input
                type="number"
                className="form-control"
                id="memberfMF"
                onChange={handleChange}
                name="memberfMF"
                value={memberData.memberfMF}
                required
              />
            </div>

            <div className="col-2">
              <label htmlFor="memberfMTotal" className="col-form-label">
                পরিবারের মোট সদস্য সংখ্যা
              </label>

              <input
                type="number"
                className="form-control"
                id="memberfMTotal"
                onChange={handleChange}
                name="memberfMTotal"
                value={memberData.memberfMTotal}
                readOnly
              />
            </div>
          </div>

          <div className="row mt-3 mb-3">
            <div className="mt-3 col-4">
              <label className="form-label">
                পরিবারের কেউ এন জি ও এর সদস্য কিনা
              </label>

              <div className="form-check">
                {["yes", "no"].map((option) => (
                  <div key={option}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="FamilyMemberENO"
                      id={`FamilyMemberENO${option}`}
                      value={option}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor={`FamilyMemberENO${option}`}
                      className="form-check-label"
                    >
                      {option === "yes" ? "হ্যাঁ" : "না"}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-8">
              {showInputs && (
                <div className="row">
                  <div className="mb-3 col-4">
                    <label htmlFor="loanamount" className="form-label mt-2">
                      সংস্থা থেকে গ্রহণকৃত ঋণের পরিমান
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2 mt-2"
                      id="loanamount"
                      placeholder="টাকার পরিমাণ"
                      onChange={handleChange}
                      name="loanamount"
                      value={memberData.loanamount}
                    />
                  </div>

                  <div className="col-4">
                    <label
                      htmlFor="nonorganizaiotnloan"
                      className="form-label mt-2"
                    >
                      অপ্রাতিষ্ঠানিক ঋণের পরিমাণ
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2 mt-2"
                      id="nonorganizaiotnloan"
                      placeholder="টাকার পরিমাণ"
                      onChange={handleChange}
                      name="nonorganizaiotnloan"
                      value={memberData.nonorganizaiotnloan}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-3">
              <label htmlFor="EarningMember" className="col-form-label">
                পরিবারের উপার্জনকারী সদস্য সংখ্যা
              </label>
              <input
                type="number"
                className="form-control"
                id="EarningMember"
                onChange={handleChange}
                name="EarningMember"
                value={memberData.EarningMember}
                required
              ></input>
            </div>

            <div className="col-3">
              <label htmlFor="YearlyIncome" className="col-form-label">
                পরিবারের মোট বার্ষিক আয়
              </label>
              <input
                type="number"
                className="form-control"
                id="YearlyIncome"
                required
                onChange={handleChange}
                name="YearlyIncome"
                value={memberData.YearlyIncome}
              ></input>
            </div>

            <div className="col-3">
              <label htmlFor="LandProperty" className="col-form-label">
                মোট জমির পরিমাণ
              </label>
              <input
                type="text"
                className="form-control"
                id="LandProperty"
                required
                onChange={handleChange}
                name="LandProperty"
                value={memberData.LandProperty}
              ></input>
            </div>
            <div className="col-3">
              <label htmlFor="TotalMoney" className="col-form-label">
                মোট সম্পদের পরিমাণ
              </label>
              <input
                type="text"
                className="form-control"
                id="TotalMoney"
                required
                onChange={handleChange}
                name="TotalMoney"
                value={memberData.TotalMoney}
              ></input>
            </div>
          </div>

          <div className="row mt-3 ">
            <div className="col-6">
              <label htmlFor="MemberNIDnumber" className="col-form-label">
                NID নাম্বার
              </label>

              <input
                type="number"
                className="form-control"
                id="MemberNIDnumber"
                required
                onChange={handleChange}
                name="MemberNIDnumber"
                value={memberData.MemberNIDnumber}
              ></input>
            </div>

            <div className="col-6 ">
              <label htmlFor="MemberMobile" className="col-form-label">
                মোবাইল নাম্বার
              </label>
              <input
                type="number"
                className="form-control"
                id="MemberMobile"
                onChange={handleChange}
                name="MemberMobile"
                value={memberData.MemberMobile}
                required
              ></input>
            </div>
          </div>

          <div className="mb-5 mt-5">
            <h2 className="text-center mb-4 ">নমনী তথ্য </h2>
          </div>
          <div className="col-md-4">
            <label htmlFor="NominiName" className="form-label">
              নমনীর নাম
            </label>
            <input
              type="text"
              className="form-control"
              id="NominiName"
              onChange={handleChange}
              name="NominiName"
              value={memberData.NominiName}
            ></input>
          </div>

          <div className="col-md-4">
            <label htmlFor="NominiFather" className="form-label">
              পিতা/স্বামীর নাম
            </label>
            <input
              type="text"
              className="form-control"
              id="NominiFather"
              onChange={handleChange}
              name="NominiFather"
              value={memberData.NominiFather}
              required
            ></input>
          </div>

          <div className="col-md-4">
            <label htmlFor="MemberNominiRelation" className="form-label">
              সম্পর্ক
            </label>
            <input
              type="text"
              className="form-control"
              id="MemberNominiRelation"
              onChange={handleChange}
              name="MemberNominiRelation"
              value={memberData.MemberNominiRelation}
              required
            ></input>
          </div>

          {/* নমনী পর্ব শেষ */}

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreementChecked"
                name="agreementChecked"
                checked={memberData.agreementChecked}
                onChange={(e) =>
                  setmemberData((prevData) => ({
                    ...prevData,
                    agreementChecked: e.target.checked,
                  }))
                }
              />
              <label htmlFor="agreementChecked" className="form-check-label">
                Check me out
              </label>
            </div>
          </div>

          <div className="col-12 mb-5 ">
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
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

export default MemberAdmission;
