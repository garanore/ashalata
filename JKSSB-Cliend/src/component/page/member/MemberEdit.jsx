// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePickers from "../../datepicker/DatePicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = "http://localhost:5000/memberdmission";

const MemberEdit = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const [, setMemberIDs] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [MemberEdits, setMemberEdits] = useState({});
  const location = useLocation();
  const memberID = location.state ? location.state.memberID : null;
  const navigate = useNavigate();
  const [memberData, setmemberData] = useState({
    memberfMM: "",
    memberfMF: "",
    memberfMTotal: "",
    FamilyMemberENO: "no",
  });

  useEffect(() => {
    // Fetch member data
    fetch(`http://localhost:5000/member-callback/${memberID}`)
      .then((res) => res.json())
      .then((data) => setMemberEdits(data))
      .catch((error) => console.error("Error fetching member data:", error));

    // Fetch centers
    axios
      .get("http://localhost:5000/center-callback")
      .then((response) => {
        // Filter out centers with ActiveStatus "False"
        const activeCenters = response.data.filter(
          (center) => center.ActiveStatus !== "False"
        );
        setCenters(activeCenters);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  }, [memberID]);

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

      setMemberIDs(generateMemberID(count));
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
    const selectedCenter = e.target.value;
    setMemberEdits({ ...MemberEdits, CenterIDMember: selectedCenter });
  };
  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setMemberEdits({ ...MemberEdits, BranchMember: selectedBranch });
  };

  //For Branch Callbacks----------------------------------------------------------------
  useEffect(() => {
    // Step 1: Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Step 2: Retrieve user branch data and designation from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      // Store the username in the formData to use it later in handleSubmit
      setmemberData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
      }));
    }
  }, []);

  useEffect(() => {
    // Assuming MemberEdits has the fetched data
    setmemberData((prevData) => ({
      ...prevData,
      memberfMM: MemberEdits.memberfMM || 0, // Use the fetched value or default to 0
      memberfMF: MemberEdits.memberfMF || 0, // Use the fetched value or default to 0
      memberfMTotal:
        parseInt(MemberEdits.memberfMM || 0) +
        parseInt(MemberEdits.memberfMF || 0),
    }));
  }, [MemberEdits]); // Run this effect when MemberEdits changes

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

    // Handle memberfMM and memberfMF separately to update memberfMTotal
    if (name === "memberfMM" || name === "memberfMF") {
      setmemberData((prevData) => {
        const updatedMemberfMM =
          name === "memberfMM" ? numericValue : prevData.memberfMM;
        const updatedMemberfMF =
          name === "memberfMF" ? numericValue : prevData.memberfMF;

        return {
          ...prevData,
          [name]: numericValue,
          memberfMTotal:
            parseInt(updatedMemberfMM || 0) + parseInt(updatedMemberfMF || 0),
        };
      });
    }
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData);
    setSubmitMessage("Successfully Updated!");

    // Add updated AdmissionDate and CenterMember
    updatedData.AdmissionDate = MemberEdits.AdmissionDate;
    updatedData.CenterIDMember = MemberEdits.CenterIDMember; // Ensure this is included
    updatedData.BranchMember = MemberEdits.BranchMember; // Ensure this is included

    fetch(`http://localhost:5000/member-callback/${memberID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMemberEdits(data.updatedMember);
          console.log("Member Updated Successfully");
        } else {
          console.error("Member Update Failed");
        }
      })
      .catch((error) => {
        console.error("Error updating member:", error);
      });
  };

  const handleCancel = () => {
    const previousPage = location.state?.from || "AllMemberList";

    const memberID = location.state?.memberID || "";

    if (previousPage === "AllMemberList") {
      navigate("/home/AllMemberList", { state: { memberID }, replace: true });
    } else if (previousPage === "MemberListBranch") {
      navigate("/home/BranchMemberList", {
        state: { memberID },
        replace: true,
      });
    } else if (previousPage === "MemberListCenter") {
      navigate("/home/MemberListCenter", {
        state: { memberID },
        replace: true,
      });
    } else {
      navigate("/home/AllMemberList", { state: { memberID }, replace: true });
    }
  };

  return (
    <div className=" bg-light container-fluid">
      <div className="mb-5 ">
        <h2 className="text-center  border-bottom mb-4 pt-3">
          সদস্য ভর্তি ফর্ম{" "}
        </h2>
      </div>

      <form className="container-fluid p-2" onSubmit={handleUpdateMember}>
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
                  value={MemberEdits.BranchMember}
                  onChange={handleBranchChange}
                  name="BranchMember"
                  required
                >
                  <option value="">Choose...</option>
                  {/* Step 3: Filter branches based on userBranches */}
                  {userBranches.includes("AllBranch") ||
                  userBranches.includes("AllCenter")
                    ? branches.map((branch) => (
                        <option key={branch._id} value={branch.BranchName}>
                          {branch.BranchName}
                        </option>
                      ))
                    : branches
                        .filter((branch) =>
                          userBranches.includes(branch.BranchName)
                        )
                        .map((branch) => (
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
                  value={MemberEdits.CenterIDMember || ""}
                  required
                  onChange={handleCenterChange} // Update to use handleCenterChange
                >
                  <option value="">Choose...</option>
                  {centers.map((center) => (
                    <option key={center._id} value={center.centerID}>
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
                defaultValue={MemberEdits.CenterNameMember || ""}
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
                      value={MemberEdits.memberID}
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
                    MemberEdits.AdmissionDate
                      ? new Date(MemberEdits.AdmissionDate)
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
                defaultValue={MemberEdits.memberName}
                onChange={handleChange}
                name="memberName"
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
                defaultValue={MemberEdits.MfhName}
                required
              ></input>
            </div>
            <div className="col-3">
              <DatePickers
                selectedDate={MemberEdits.MdateOfBirth || ""}
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
                defaultValue={MemberEdits.memberJob}
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
                defaultValue={MemberEdits.memberVillage}
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
                defaultValue={MemberEdits.memberUnion}
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
                defaultValue={MemberEdits.memberPost}
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
                defaultValue={MemberEdits.memberSubDic}
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
                defaultValue={MemberEdits.memberDic}
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
                value={MemberEdits.memberMarital}
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
                value={MemberEdits.memberStudy}
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
                defaultValue={MemberEdits.memberFhead}
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
                defaultValue={MemberEdits.memberfMM || ""}
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
                defaultValue={MemberEdits.memberfMF || ""}
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
                defaultValue={memberData.memberfMTotal || ""}
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
                      checked={memberData.FamilyMemberENO === option} // Check based on state
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
                      defaultValue={MemberEdits.loanamount}
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
                      defaultValue={MemberEdits.nonorganizaiotnloan}
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
                defaultValue={MemberEdits.EarningMember}
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
                defaultValue={MemberEdits.YearlyIncome}
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
                defaultValue={MemberEdits.LandProperty}
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
                defaultValue={MemberEdits.TotalMoney}
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
                defaultValue={MemberEdits.MemberNIDnumber}
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
                defaultValue={MemberEdits.MemberMobile}
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
              defaultValue={MemberEdits.NominiName}
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
              defaultValue={MemberEdits.NominiFather}
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
              defaultValue={MemberEdits.MemberNominiRelation}
              required
            ></input>
          </div>

          {/* নমনী পর্ব শেষ */}

          <div className="col-12 mb-5 ">
            <div className="d-flex justify-content-between mt-5">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-primary btn-md"
              >
                Cancel
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

export default MemberEdit;
