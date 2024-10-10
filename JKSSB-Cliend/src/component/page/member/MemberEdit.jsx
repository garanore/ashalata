// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
// import DatePickers from "../../datepicker/DatePicker";
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
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // Convert the selected date to "YYYY-MM-DD"
      setmemberData({
        ...memberData,
        AdmissionDate: formattedDate,
      });
    } else {
      setmemberData({
        ...memberData,
        AdmissionDate: null,
      });
    }
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
              <i className="fas fa-pen"></i> সদস্য সম্পাদনা
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

      <form className="container-fluid p-2" onSubmit={handleUpdateMember}>
        <div className="row g-4 bg-light ">
          {/* Row 1 */}
          <div className="row mt-5 p-4 ">
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
                <select
                  id="BranchMember"
                  className="form-select border-primary"
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
                <select
                  id="CenterIDMember"
                  name="CenterIDMember"
                  className="form-select border-primary"
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

            <div className="col-md-3 mb-3">
              <label
                htmlFor="CenterNameMember"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-store"></i> কেন্দ্র নাম
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-store"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="CenterNameMember"
                  defaultValue={MemberEdits.CenterNameMember || ""}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="memberID"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-id-card"></i> সদস্য ID:
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
                  id="memberID"
                  className="form-control border-primary"
                  value={MemberEdits.memberID}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* সদস্য তথ্য শুরু  */}

          <div className="row mb-3 ">
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
                <DatePicker
                  id="AdmissionDate"
                  className="form-control border-primary"
                  selected={
                    MemberEdits.AdmissionDate
                      ? new Date(MemberEdits.AdmissionDate + "T00:00:00") // Convert the fetched string to a valid Date object
                      : null
                  }
                  onChange={handleAdmissionDateChange}
                  dateFormat="dd/MM/yyyy"
                  required
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
                  id="memberName"
                  className="form-control border-primary"
                  type="text"
                  defaultValue={MemberEdits.memberName}
                  onChange={handleChange}
                  name="memberName"
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
                  type="text"
                  className="form-control border-primary"
                  id="MfhName"
                  onChange={handleChange}
                  name="MfhName"
                  defaultValue={MemberEdits.MfhName}
                  required
                ></input>
              </div>
            </div>

            <div className="col-md-3">
              <label
                htmlFor="MdateOfBirth"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-birthday-cake"></i> জন্ম তারিখ
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-birthday-cake"></i>
                </span>
                <DatePicker
                  id="MdateOfBirth"
                  className="form-control border-primary"
                  selected={
                    MemberEdits.MdateOfBirth
                      ? new Date(MemberEdits.MdateOfBirth) // Properly parsed date
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              <small className="text-muted">নূন্যতম ১৮ বছর</small>
            </div>

            {/* <div className="col-3">
              <DatePickers
                selectedDate={MemberEdits.MdateOfBirth || ""}
                onDateChange={handleDateChange}
              />
            </div> */}
          </div>

          <div className="row mb-3 ">
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
                  type="text"
                  className="form-control border-primary"
                  id="memberJob"
                  onChange={handleChange}
                  name="memberJob"
                  defaultValue={MemberEdits.memberJob}
                  required
                ></input>
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
                  type="text"
                  className="form-control border-primary"
                  id="memberVillage"
                  onChange={handleChange}
                  name="memberVillage"
                  defaultValue={MemberEdits.memberVillage}
                  required
                ></input>
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
                  type="text"
                  className="form-control border-primary"
                  id="memberUnion"
                  onChange={handleChange}
                  name="memberUnion"
                  defaultValue={MemberEdits.memberUnion}
                  required
                ></input>
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
                  type="text"
                  className="form-control border-primary"
                  id="memberPost"
                  onChange={handleChange}
                  name="memberPost"
                  defaultValue={MemberEdits.memberPost}
                  required
                ></input>
              </div>
            </div>
          </div>

          <div className="row mt-3">
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
                  type="text"
                  className="form-control border-primary"
                  id="memberSubDic"
                  onChange={handleChange}
                  name="memberSubDic"
                  defaultValue={MemberEdits.memberSubDic}
                  required
                ></input>
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
                  type="text"
                  className="form-control border-primary"
                  id="memberDic"
                  onChange={handleChange}
                  name="memberDic"
                  defaultValue={MemberEdits.memberDic}
                  required
                ></input>
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
                <select
                  id="memberMarital"
                  className="form-select shadow-sm border-primary"
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

            <div className="col-md-3">
              <label
                htmlFor="memberStudy"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-graduation-cap"></i> শিক্ষাগত যোগ্যতা
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-graduation-cap"></i>
                </span>
                <select
                  id="memberStudy"
                  className="form-select shadow-sm border-primary"
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
            </div>
          </div>

          <div className="row mt-5">
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
                  type="text"
                  className="form-control border-primary"
                  id="memberFhead"
                  onChange={handleChange}
                  name="memberFhead"
                  defaultValue={MemberEdits.memberFhead}
                  required
                ></input>
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="memberfMM"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-male"></i> পরিবারের সদস্য সংখ্যা (পুরুষ)
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-male"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-primary"
                  id="memberfMM"
                  onChange={handleChange}
                  name="memberfMM"
                  defaultValue={MemberEdits.memberfMM || ""}
                  required
                />
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="memberfMF"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-female"></i> মহিলা
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-female"></i>
                </span>
                <input
                  type="number"
                  className="form-control border-primary"
                  id="memberfMF"
                  onChange={handleChange}
                  name="memberfMF"
                  defaultValue={MemberEdits.memberfMF || ""}
                  required
                />
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="memberfMTotal"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-users"></i> পরিবারের মোট সদস্য সংখ্যা
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
                  type="number"
                  className="form-control border-primary"
                  id="memberfMTotal"
                  onChange={handleChange}
                  name="memberfMTotal"
                  defaultValue={memberData.memberfMTotal || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="row mt-3 mb-3">
            <div className="mt-3 col-4">
              <label
                className="form-label"
                style={{ fontWeight: "bold", color: "#343a40" }}
              >
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
                      style={{ fontSize: "1.1rem", color: "#495057" }}
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
                    <label
                      htmlFor="loanamount"
                      className="form-label mt-2"
                      style={{ fontWeight: "bold" }}
                    >
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
                      style={{ borderRadius: "5px" }}
                    />
                  </div>

                  <div className="col-4">
                    <label
                      htmlFor="nonorganizaiotnloan"
                      className="form-label mt-2"
                      style={{ fontWeight: "bold" }}
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
                      style={{ borderRadius: "5px" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-3">
              <label
                htmlFor="EarningMember"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-users"></i> পরিবারের উপার্জনকারী সদস্য
                সংখ্যা
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
                  type="number"
                  className="form-control border-primary"
                  id="EarningMember"
                  onChange={handleChange}
                  name="EarningMember"
                  defaultValue={MemberEdits.EarningMember}
                  required
                ></input>
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="YearlyIncome"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-money-bill-wave"></i> পরিবারের মোট বার্ষিক
                আয়
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
                  type="number"
                  className="form-control border-primary"
                  id="YearlyIncome"
                  required
                  onChange={handleChange}
                  name="YearlyIncome"
                  defaultValue={MemberEdits.YearlyIncome}
                ></input>
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="LandProperty"
                className="col-form-label"
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
                  type="text"
                  className="form-control border-primary"
                  id="LandProperty"
                  required
                  onChange={handleChange}
                  name="LandProperty"
                  defaultValue={MemberEdits.LandProperty}
                ></input>
              </div>
            </div>

            <div className="col-3">
              <label
                htmlFor="TotalMoney"
                className="col-form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-coins"></i> মোট সম্পদের পরিমাণ
              </label>
              <div className="input-group shadow-sm">
                <span
                  className="input-group-text bg-primary text-white "
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00d4ff)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-coins"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="TotalMoney"
                  required
                  onChange={handleChange}
                  name="TotalMoney"
                  defaultValue={MemberEdits.TotalMoney}
                ></input>
              </div>
            </div>
          </div>

          <div className="row mt-3 ">
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
                  type="number"
                  className="form-control border-primary"
                  id="MemberNIDnumber"
                  required
                  onChange={handleChange}
                  name="MemberNIDnumber"
                  defaultValue={MemberEdits.MemberNIDnumber}
                ></input>
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
                  type="number"
                  className="form-control border-primary"
                  id="MemberMobile"
                  onChange={handleChange}
                  name="MemberMobile"
                  defaultValue={MemberEdits.MemberMobile}
                  required
                ></input>
              </div>
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
                type="text"
                className="form-control border-primary"
                id="NominiName"
                onChange={handleChange}
                name="NominiName"
                defaultValue={MemberEdits.NominiName}
              ></input>
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
              <i className="fas fa-id-card"></i> নমনীর NID
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
                type="number"
                className="form-control border-primary"
                id="NominiNID"
                placeholder="নমিনির NID লিখুন"
                onChange={handleChange}
                name="NominiNID"
                defaultValue={MemberEdits.NominiNID}
                style={{ borderRadius: "5px" }}
              />
            </div>
            <small className="text-muted">উদাহরণ: 1234567890</small>
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
                type="text"
                className="form-control border-primary"
                id="NominiFather"
                onChange={handleChange}
                name="NominiFather"
                defaultValue={MemberEdits.NominiFather}
                required
              ></input>
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
                type="text"
                className="form-control border-primary"
                id="MemberNominiRelation"
                onChange={handleChange}
                name="MemberNominiRelation"
                defaultValue={MemberEdits.MemberNominiRelation}
                required
              ></input>
            </div>
          </div>

          {/* নমনী পর্ব শেষ */}

          <div className="col-12 mb-5 ">
            <div className="d-flex justify-content-between mt-5">
              {/* Update Button (Danger) with Right Icon */}
              <button
                type="submit"
                className="btn btn-danger btn-md position-relative"
                style={{
                  background: "linear-gradient(45deg, #dc3545, #ff6347)", // Red gradient for danger
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c82333"; // Darker red on hover
                  e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc3545"; // Reset to original color
                  e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
                }}
              >
                <i className="fas fa-check" style={{ marginLeft: "5px" }}></i>{" "}
                Update
                {/* Right icon */}
              </button>

              {/* Cancel Button (Fully Green) */}
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-success btn-md position-relative"
                style={{
                  backgroundColor: "#28a745", // Solid green
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#218838"; // Darker green on hover
                  e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#28a745"; // Reset to original green color
                  e.currentTarget.style.transform = "scale(1)"; // Reset size on mouse leave
                }}
              >
                <i className="fas fa-times" style={{ marginRight: "5px" }}></i>
                Cancel
              </button>
            </div>

            {submitMessage && (
              <div
                className="alert alert-success mt-3 d-flex align-items-center"
                role="alert"
                style={{
                  borderRadius: "0.5rem", // Rounded corners
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: "1.5rem",
                    marginRight: "10px", // Space between icon and text
                    color: "#155724", // Dark green for the icon
                  }}
                ></i>
                <span style={{ fontWeight: "bold" }}>{submitMessage}</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberEdit;
