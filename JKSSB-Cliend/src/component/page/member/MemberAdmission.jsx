// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
// import DatePickers from "../../datepicker/DatePicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
const API_URL = "http://localhost:5000/memberdmission";

const MemberAdmission = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [memberID, setMemberID] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState({});
  const [userBranches, setUserBranches] = useState([]);

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
    NominiNID: "",
    NominiFather: "",
    MemberNominiRelation: "",
    AdmissionFee: "20",
    FormFee: "30",
    agreementChecked: false,
    submittedBy: "", // Make sure this is part of the form state
    GrantedBy: "Null", // Ensure it's set correctly
    DeletedStatus: "Null", // Ensure it's set correctly
  });

  // For Date Of Birth Change----------------------------------------------------------------
  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    setmemberData({
      ...memberData,
      MdateOfBirth: formattedDate,
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
      .get(`http://localhost:5000/center-callback-id/${selectedCenterID}`)
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

  const handleBranchChange = (e) => {
    const branchName = e.target.value; // Selected branch name
    const { name } = e.target;

    // Update selected branch name
    setSelectedBranch(branchName);

    if (branchName) {
      // Fetch centers based on the selected branch
      axios
        .get(
          `http://localhost:5000/center-callback?selectedBranch=${encodeURIComponent(
            branchName
          )}`
        )
        .then((response) => {
          // Filter out centers with ActiveStatus "False"
          const activeCenters = response.data.filter(
            (center) => center.ActiveStatus !== "False"
          );
          setCenters(activeCenters);
        })
        .catch((error) => {
          console.error("Error fetching worker data:", error);
        });
    }

    if (name === "BranchMember") {
      // Find the corresponding BranchID from the branches array
      const selectedBranch = branches.find(
        (branch) => branch.BranchName === branchName
      );
      const selectedBranchID = selectedBranch ? selectedBranch.BranchID : "";

      // Update member data with the selected branch name and ID
      setmemberData((prevData) => ({
        ...prevData,
        BranchMember: branchName,
        BranchID: selectedBranchID, // Store the BranchID
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field is loanamount or nonorganizaiotnloan, treat as string
    const isLoanField = name === "loanamount" || name === "nonorganizaiotnloan";
    const formattedValue = isLoanField ? String(value) : value;

    // Handle numeric input specifically for WorkerNID
    const numericValue =
      name === "WorkerNID" ? parseInt(value, 10) : formattedValue;

    // Update the state with formatted values
    setmemberData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : isLoanField
          ? formattedValue
          : numericValue,
    }));

    // Handle date field separately
    if (name === "MdateOfBirth") {
      const formattedDate = value ? new Date(value).toISOString() : null;
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
      // Generate the member ID using the BranchID
      const memberID = await generateMemberID(memberData.BranchID); // Ensure BranchID is available

      // Prepare the data for submission
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, {
        memberID, // Only include one memberID
        loanamount: memberData.loanamount,
        nonorganizaiotnloan: memberData.nonorganizaiotnloan,
        ...memberData,
      });

      setSubmitMessage("Successfully submitted!");

      setMemberCount(memberCount + 1);

      // Reset memberData
      setmemberData((prevData) => ({
        ...prevData,
        BranchMember: "",
        CenterIDMember: "",
        CenterNameMember: "",
        memberID: "", // Resetting memberID, but it can be generated fresh
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
        approvalStatus: "Approved",
        ActiveStatus: "True", // Ensure it's set correctly
        submittedBy: prevData.submittedBy,
        GrantedBy: "Null", // Ensure it's set correctly
        DeletedStatus: "Null", // Ensure it's set correctly
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
              <i className="fas fa-user-plus"></i> সদস্য ভর্তি
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

      <form className="container-fluid p-2 ">
        <div className="row g-4 bg-light ">
          {/* Row 1 */}
          <div className="row mt-5 p-4 ">
            <div className="col-md-3">
              <label
                htmlFor="BranchMember"
                className="form-label"
                style={{ fontWeight: "bold", color: "#4A5568" }}
              >
                <i className="fas fa-code-branch"></i> শাঁখা নির্বাচন করুণ
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
                  value={selectedBranch.BranchMember}
                  onChange={handleBranchChange}
                  name="BranchMember"
                  required
                >
                  <option value="">--------</option>
                  {/* Logic to render branches */}
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
                  value={memberData.CenterMember}
                  required
                  onChange={handleCenterChange}
                >
                  <option value="">--------</option>
                  {centers.map((center) => (
                    <option key={center.centerID} value={center.centerID}>
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
                  value={selectedCenter.CenterName || ""}
                  required
                  readOnly
                  placeholder="কেন্দ্রের নাম"
                  style={{ backgroundColor: "#e9ecef" }}
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
                  value={memberID}
                  disabled
                  required
                  placeholder="সদস্য ID"
                  style={{ backgroundColor: "#e9ecef" }}
                />
              </div>
            </div>
          </div>

          {/* সদস্য তথ্য শুরু  */}

          {/* Row 2 */}
          <div className="row mb-3">
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
                    memberData.AdmissionDate
                      ? new Date(memberData.AdmissionDate)
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
                  value={memberData.memberName}
                  onChange={handleChange}
                  name="memberName"
                  required
                  placeholder="নাম লিখুন"
                  style={{ borderRadius: "5px" }}
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
                  value={memberData.MfhName}
                  required
                  placeholder="পিতা/স্বামীর নাম লিখুন"
                  style={{ borderRadius: "5px" }}
                />
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
                    memberData.MdateOfBirth
                      ? new Date(memberData.MdateOfBirth)
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              <small className="text-muted">নূন্যতম ১৮ বছর</small>
            </div>
          </div>

          <div className="row mb-3">
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
                  value={memberData.memberJob}
                  required
                  placeholder="পেশা লিখুন"
                  style={{ borderRadius: "5px" }}
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
                  type="text"
                  className="form-control border-primary"
                  id="memberVillage"
                  onChange={handleChange}
                  name="memberVillage"
                  value={memberData.memberVillage}
                  required
                  placeholder="গ্রাম/পাড়া লিখুন"
                  style={{ borderRadius: "5px" }}
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
                  type="text"
                  className="form-control border-primary"
                  id="memberUnion"
                  onChange={handleChange}
                  name="memberUnion"
                  value={memberData.memberUnion}
                  required
                  placeholder="ইউনিয়ন লিখুন"
                  style={{ borderRadius: "5px" }}
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
                  type="text"
                  className="form-control border-primary"
                  id="memberPost"
                  onChange={handleChange}
                  name="memberPost"
                  value={memberData.memberPost}
                  required
                  placeholder="ডাকঘর লিখুন"
                  style={{ borderRadius: "5px" }}
                />
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
                  value={memberData.memberSubDic}
                  required
                  placeholder="থানা লিখুন"
                  style={{ borderRadius: "5px" }}
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
                  type="text"
                  className="form-control border-primary"
                  id="memberDic"
                  onChange={handleChange}
                  name="memberDic"
                  value={memberData.memberDic}
                  required
                  placeholder="জেলা লিখুন"
                  style={{ borderRadius: "5px" }}
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
                <select
                  id="memberMarital"
                  className="form-select shadow-sm border-primary"
                  name="memberMarital"
                  value={memberData.memberMarital}
                  onChange={handleChange}
                  style={{ borderRadius: "5px" }}
                >
                  <option value="">--------</option>
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
                  value={memberData.memberStudy}
                  onChange={handleChange}
                  style={{ borderRadius: "5px" }}
                >
                  <option value="">--------</option>
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
                  value={memberData.memberFhead}
                  required
                  placeholder="নাম লিখুন"
                  style={{ borderRadius: "5px" }}
                />
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
                  value={memberData.memberfMM}
                  required
                  placeholder="পুরুষ সংখ্যা"
                  style={{ borderRadius: "5px" }}
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
                  value={memberData.memberfMF}
                  required
                  placeholder="মহিলা সংখ্যা"
                  style={{ borderRadius: "5px" }}
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
                  value={memberData.memberfMTotal}
                  placeholder="মোট সদস্য সংখ্যা"
                  readOnly
                  style={{ borderRadius: "5px" }}
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
                  <div key={option} className="form-check mb-2">
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
                      style={{ fontSize: "1.1rem", color: "#495057" }} // Customize label styles
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
                  <div className="mb-3 col-6">
                    <label
                      htmlFor="loanamount"
                      className="form-label mt-2"
                      style={{ fontWeight: "bold" }}
                    >
                      সংস্থা থেকে গ্রহণকৃত ঋণের পরিমান
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="loanamount"
                      placeholder="টাকার পরিমাণ"
                      onChange={handleChange}
                      name="loanamount"
                      value={memberData.loanamount}
                      style={{ borderRadius: "5px" }} // Rounded corners for inputs
                    />
                  </div>

                  <div className="mb-3 col-6">
                    <label
                      htmlFor="nonorganizaiotnloan"
                      className="form-label mt-2"
                      style={{ fontWeight: "bold" }}
                    >
                      অপ্রাতিষ্ঠানিক ঋণের পরিমাণ
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="nonorganizaiotnloan"
                      placeholder="টাকার পরিমাণ"
                      onChange={handleChange}
                      name="nonorganizaiotnloan"
                      value={memberData.nonorganizaiotnloan}
                      style={{ borderRadius: "5px" }} // Rounded corners for inputs
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
                  placeholder="উপার্জনকারী সদস্য সংখ্যা"
                  onChange={handleChange}
                  name="EarningMember"
                  value={memberData.EarningMember}
                  required
                  style={{ borderRadius: "5px" }}
                />
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
                  placeholder="মোট বার্ষিক আয় লিখুন"
                  required
                  onChange={handleChange}
                  name="YearlyIncome"
                  value={memberData.YearlyIncome}
                  style={{ borderRadius: "5px" }}
                />
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
                  placeholder="মোট জমির পরিমাণ লিখুন"
                  required
                  onChange={handleChange}
                  name="LandProperty"
                  value={memberData.LandProperty}
                  style={{ borderRadius: "5px" }}
                />
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
                  placeholder="মোট সম্পদের পরিমাণ লিখুন"
                  required
                  onChange={handleChange}
                  name="TotalMoney"
                  value={memberData.TotalMoney}
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3">
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
                  placeholder="NID নাম্বার লিখুন"
                  required
                  onChange={handleChange}
                  name="MemberNIDnumber"
                  value={memberData.MemberNIDnumber}
                  style={{ borderRadius: "5px" }}
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
                  type="number"
                  className="form-control border-primary"
                  id="MemberMobile"
                  placeholder="01xxxxxxxxx"
                  onChange={handleChange}
                  name="MemberMobile"
                  value={memberData.MemberMobile}
                  required
                  style={{ borderRadius: "5px" }}
                />
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
                placeholder="নমিনির নাম লিখুন"
                onChange={handleChange}
                name="NominiName"
                value={memberData.NominiName}
                style={{ borderRadius: "5px" }}
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
                value={memberData.NominiNID}
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
                placeholder="পিতা/স্বামীর নাম "
                onChange={handleChange}
                name="NominiFather"
                value={memberData.NominiFather}
                required
                style={{ borderRadius: "5px" }}
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
                type="text"
                className="form-control border-primary"
                id="MemberNominiRelation"
                placeholder="নমিনির সাথে সম্পর্ক"
                onChange={handleChange}
                name="MemberNominiRelation"
                value={memberData.MemberNominiRelation}
                required
                style={{ borderRadius: "5px" }}
              />
            </div>
            <small className="text-muted">উদাহরণ: বাবা, মা, ভাই</small>
          </div>

          {/* নমনী পর্ব শেষ */}

          <div className="col-12 mb-4">
            <div className="form-check d-flex align-items-center">
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
                style={{
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                }}
              />
              <label
                htmlFor="agreementChecked"
                className="form-check-label ms-2"
                style={{ fontSize: "16px", color: "#333" }}
              >
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <div className="col-12 mb-5">
            <div className="d-flex justify-content-center mb-3">
              <button
                type="button"
                className="btn btn-primary btn-lg shadow"
                onClick={handleSubmit}
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-paper-plane"></i> Submit
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

export default MemberAdmission;
