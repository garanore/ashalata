// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
// import DatePickers from "./../../datepicker/DatePicker";
const API_URL = "http://localhost:5000/workeradmission";
const DESIGNATION_CALLBACK_API = "http://localhost:5000/designation-callback";

const WorkerAdmission = () => {
  const [WorkerCount, setWorkerCount] = useState(0);
  const [designation, setdesignation] = useState("");
  const [, setDesignationName] = useState(""); // DesignationName
  const [showUserBranch, setShowUserBranch] = useState(false);
  const [showCenterIDMember, setShowCenterIDMember] = useState(false);
  const [, setSelectedCenter] = useState({});
  const [, setUserCenter] = useState("");
  const [memberData, setmemberData] = useState({});
  const [accountName, setAccountName] = useState("");
  const [username, setUsername] = useState("");
  const [workerID, setWorkerID] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [hasAccess, setHasAccess] = useState(true);
  const [userBranches, setUserBranches] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [WorkerData, setWorkerData] = useState({
    WorkerName: "",
    WorkerParent: "",
    WdateOfBirth: "",
    WorkerJob: "",
    WorkerHome: "",
    WorkerUnion: "",
    WorkerPost: "",
    WorkerSubDic: "",
    WorkerDic: "",
    WorkerMarital: "",
    WorkerStudy: "",
    WorkerNID: "",
    WorkerMobile: "",
    WorkerMail: "",
    WorkerCenterAdd: "",
    WorkerBranchAdd: "",
    designation: "",
    JoiningDate: "",
    submittedBy: "", // Make sure this is part of the form state
    GrantedBy: "Null", // Ensure it's set correctly
    DeletedStatus: "Null", // Ensure it's set correctly
    agreementChecked: false,
  });
  const formRef = useRef(null);
  const handleDateChange = (date) => {
    setWorkerData({
      ...WorkerData,
      WdateOfBirth: date,
    });
  };
  const [designations, setDesignations] = useState([]);

  //for Worker Count

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchWorkerCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setWorkerCount(count);
      setWorkerID(generateWorkerID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  };

  // For JoiningDate Date Change--------------------------------------------
  const handleJoiningDateChange = (date) => {
    // Extract the date part from the selected date
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    // Update the AdmissionDate field with the formatted date
    setWorkerData({
      ...WorkerData,
      JoiningDate: formattedDate,
    });
  };

  useEffect(() => {
    fetchWorkerCount();
  }, [fetchWorkerCount]);

  const generateWorkerID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `W${paddedCount}`;
  };

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

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      const usernames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = usernames[0] || "Unknown";
      setUsername(username);

      // Fetch accountName based on the username
      if (username !== "Unknown") {
        axios
          .get(`http://localhost:5000/get-user-username/${username}`)
          .then((response) => {
            if (response.data.length > 0) {
              setAccountName(response.data[0].accountName);
            } else {
              setAccountName("Unknown User");
            }
          })
          .catch(() => {
            setAccountName("Error fetching user");
          });
      }

      // Check if the user has a restricted designation
      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      // Restrict access if the user has a restricted designation
      setHasAccess(!userHasRestrictedDesignation);

      // Store the username in the formData to use it later in handleSubmit
      setWorkerData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
      }));
    }

    // Fetch designations data
    axios
      .get(DESIGNATION_CALLBACK_API)
      .then((response) => {
        setDesignations(response.data); // Set the list of designations
      })
      .catch((error) => {
        console.error("Error fetching designations:", error);
      });
  }, []);

  const handleBranchChange = (e) => {
    const branch = e.target.value;

    setSelectedBranch(branch);

    if (branch) {
      axios
        .get(
          `http://localhost:5000/center-callback?selectedBranch=${encodeURIComponent(
            branch
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
          console.error("Error fetching center data:", error);
        });

      // Always update WorkerData regardless of name
      setWorkerData((prevData) => ({
        ...prevData,
        WorkerBranchAdd: branch,
      }));
    }
  };

  const handleCenterChange = (e) => {
    const selectedCenterID = e.target.value;
    setUserCenter(selectedCenterID); // Update UserCenter with selected center ID

    axios
      .get(`http://localhost:5000/center-callback-id/${selectedCenterID}`)
      .then((response) => {
        const center = response.data;

        setSelectedCenter(center[0]); // Assuming the first result is the desired one
        setWorkerData((prevData) => ({
          ...prevData,
          WorkerCenterAdd: selectedCenterID, // Update WorkerCenterAdd in WorkerData
          CenterNameMember: center[0].CenterName, // This is optional if needed
        }));
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  };

  // Get logged-in user's designation from localStorage
  const loggedUserDesignation = localStorage.getItem("selectedDesignationName");

  const handleRankChange = (e) => {
    const selectedDesignationID = e.target.value;

    const selectedDesignationName = designations.find(
      (designation) => designation.DesignationName === selectedDesignationID
    )?.DesignationName;

    setdesignation(selectedDesignationID); // Set this to DesignationID for the select's value binding
    setDesignationName(selectedDesignationName);

    // Update WorkerData with the selected designation
    setWorkerData((prevData) => ({
      ...prevData,
      designation: selectedDesignationName, // Set the designation in WorkerData
    }));

    // Logic for showing or hiding additional fields based on the designation
    if (
      [
        "নির্বাহী পরিচালক",
        "সহকারী নির্বাহী পরিচালক",
        "অর্থ পরিচালক",
        "প্রোগ্রাম অফিসার",
        "অডিট অফিসার",
        "সহকারী অডিট অফিসার",
        "এরিয়া ম্যানাজার",
      ].includes(selectedDesignationName)
    ) {
      setShowUserBranch(false);
      setShowCenterIDMember(false);
    } else if (
      [
        "শাখা ব্যাবস্থাপক",
        "সহকারী শাখা ব্যাবস্থাপক",
        "শাখা হিসাব রক্ষক",
        "সহকারী শাখা হিসাবরক্ষক",
      ].includes(selectedDesignationName)
    ) {
      setShowUserBranch(true);
      setShowCenterIDMember(false);
    } else {
      setShowUserBranch(true);
      setShowCenterIDMember(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericValue = name === "WorkerNID" ? parseInt(value, 10) : value;
    setWorkerData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : numericValue,
      [name]: type === "checkbox" ? checked : formattedDate,
    }));

    const formattedDate =
      name === "WdateOfBirth" ? (value ? value.toISOString() : null) : value;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the uploaded file

    if (file) {
      const img = new Image(); // Create an Image object to load and check dimensions
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Check file size (in bytes)
        if (file.size > 200 * 1024) {
          // 200KB limit
          alert("আপনার ছবি 200 KB এর বেশি, দয়া করে কমিয়ে নিন ।");
          // Clear the input box by setting its value to empty string
          e.target.value = "";
          return;
        }

        // Check dimensions (in pixels)
        if (width > 600 || height > 600) {
          alert("আপনার ছবি 600/600 এর বড়, দয়া করে ছোট করুণ");
          // Clear the input box by setting its value to empty string
          e.target.value = "";
          return;
        }

        // If file is valid, update the WorkerData state with the image file
        setWorkerData({ ...WorkerData, WorkerImage: file });
      };

      img.onerror = () => {
        alert("Invalid image file. Please upload jpg", "png", "jpeg");
        // Clear the input box by setting its value to empty string
        e.target.value = "";
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append other form data

    formData.append("WorkerName", WorkerData.WorkerName); // Ensure WorkerName is set
    formData.append("WorkerParent", WorkerData.WorkerParent);
    formData.append("WdateOfBirth", WorkerData.WdateOfBirth);
    formData.append("WorkerJob", WorkerData.WorkerJob);
    formData.append("WorkerHome", WorkerData.WorkerHome);
    formData.append("WorkerUnion", WorkerData.WorkerUnion);
    formData.append("WorkerPost", WorkerData.WorkerPost);
    formData.append("WorkerSubDic", WorkerData.WorkerSubDic);
    formData.append("WorkerDic", WorkerData.WorkerDic);
    formData.append("WorkerMarital", WorkerData.WorkerMarital);
    formData.append("WorkerStudy", WorkerData.WorkerStudy);
    formData.append("WorkerNID", WorkerData.WorkerNID);
    formData.append("WorkerMobile", WorkerData.WorkerMobile); // Ensure WorkerMobile is set
    formData.append("WorkerMail", WorkerData.WorkerMail); // Ensure WorkerMail is set
    formData.append("WorkerCenterAdd", WorkerData.WorkerCenterAdd);
    formData.append("WorkerBranchAdd", WorkerData.WorkerBranchAdd);
    formData.append("designation", WorkerData.designation); // Ensure Designation is set
    formData.append("JoiningDate", WorkerData.JoiningDate);
    formData.append("approvalStatus", WorkerData.approvalStatus);
    formData.append("ActiveStatus", WorkerData.ActiveStatus);
    formData.append("submittedBy", WorkerData.submittedBy);
    formData.append("GrantedBy", WorkerData.GrantedBy);
    formData.append("DeletedStatus", WorkerData.DeletedStatus);
    formData.append("agreementChecked", WorkerData.agreementChecked);

    // Append the image file (make sure it's not null)
    if (WorkerData.WorkerImage) {
      formData.append("WorkerImage", WorkerData.WorkerImage);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      await response.json();

      // Handle success
      setSubmitMessage("Pending for Approval");
      setWorkerCount(WorkerCount + 1);
      setWorkerID(generateWorkerID());
      setWorkerData({
        workerID: "",
        Name: "",
        WorkerParent: "",
        WdateOfBirth: "",
        WorkerJob: "",
        WorkerHome: "",
        WorkerUnion: "",
        WorkerPost: "",
        WorkerSubDic: "",
        WorkerDic: "",
        WorkerMarital: "",
        WorkerStudy: "",
        WorkerNID: "",
        phoneNumber: "",
        email: "",
        Center: "",
        Branch: "",
        Designation: "",
        JoiningDate: "",
        approvalStatus: "Approved",
        ActiveStatus: "True",
        submittedBy: "",
        GrantedBy: "Null",
        DeletedStatus: "Null",
        WorkerImage: "Null",
        agreementChecked: false,
      });
      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
      formRef.current.reset();
    } catch (error) {
      console.error("Error submitting WorkerAdmission data:", error.message);
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-4">
          <div className="border-bottom mb-4">
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "bold", color: "#2D3748" }}
            >
              <i className="fas fa-lock" style={{ marginRight: "10px" }}></i>{" "}
              অফিস কর্মী ভর্তি ফর্ম
            </h2>
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#f8d7da",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              className="text-center mb-0"
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#721c24",
              }}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "1.5rem", marginRight: "10px" }}
              ></i>
              প্রিয়{" "}
              <span className="highlighted-username">
                {accountName || username}
              </span>
              , এই পেইজে আপনার অনুমতি নেই।
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <i className="fas fa-user-tie"></i> অফিস কর্মী ভর্তি ফর্ম
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

      <form className=" bg-light " onSubmit={handleSubmit} ref={formRef}>
        {/* <!-- Full Name --> */}

        <div className="row">
          <div className="col-md-3">
            <label
              htmlFor="workerID"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-id-card"></i> Worker ID
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
                id="workerID"
                className="form-control border-primary"
                type="text"
                value={workerID}
                disabled
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerName"
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
                type="text"
                className="form-control border-primary"
                placeholder="নাম লিখুন"
                id="WorkerName"
                required
                onChange={handleChange}
                name="WorkerName"
                value={WorkerData.WorkerName}
              ></input>
            </div>
          </div>

          {/* কর্মী তথ্য শুরু */}

          <div className="col-md-3">
            <label
              htmlFor="WorkerParent"
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
                id="WorkerParent"
                required
                onChange={handleChange}
                name="WorkerParent"
                placeholder="পিতা/স্বামীর নাম লিখুন"
                value={WorkerData.WorkerParent}
              ></input>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerHome"
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
                placeholder="গ্রাম/পাড়া লিখুন"
                id="WorkerHome"
                required
                onChange={handleChange}
                name="WorkerHome"
                value={WorkerData.WorkerHome}
              ></input>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-3">
            <label
              htmlFor="WorkerUnion"
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
                placeholder="ইউনিয়ন লিখুন"
                id="WorkerUnion"
                required
                onChange={handleChange}
                name="WorkerUnion"
                value={WorkerData.WorkerUnion}
              ></input>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerPost"
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
                placeholder="ডাকঘর লিখুন"
                id="WorkerPost"
                required
                onChange={handleChange}
                name="WorkerPost"
                value={WorkerData.WorkerPost}
              ></input>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerSubDic"
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
                placeholder="থানা লিখুন"
                id="WorkerSubDic"
                required
                onChange={handleChange}
                name="WorkerSubDic"
                value={WorkerData.WorkerSubDic}
              ></input>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerDic"
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
                placeholder="জেলা লিখুন"
                id="WorkerDic"
                required
                onChange={handleChange}
                name="WorkerDic"
                value={WorkerData.WorkerDic}
              ></input>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-3">
            <label
              htmlFor="WorkerMarital"
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
                id="WorkerMarital"
                name="WorkerMarital"
                className="form-select shadow-sm border-primary"
                value={WorkerData.WorkerMarital}
                onChange={handleChange}
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
              htmlFor="WorkerJob"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-graduation-cap"></i> পেশা
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
              <input
                type="text"
                className="form-select shadow-sm border-primary"
                placeholder="পেশা লিখুন"
                id="WorkerJob"
                required
                onChange={handleChange}
                name="WorkerJob"
                value={WorkerData.WorkerJob}
              ></input>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerStudy"
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
                id="WorkerStudy"
                name="WorkerStudy"
                className="form-select shadow-sm border-primary"
                value={WorkerData.WorkerStudy}
                onChange={handleChange}
              >
                <option value="">-------</option>
                <option>স্বাক্ষর জ্ঞান সম্পন্ন</option>
                <option>প্রাথমিক</option>
                <option>মাধ্যমিক</option>
                <option>উচ্চমাধ্যমিক</option>
                <option>স্নাতক</option>
                <option>স্নাতকোত্তর</option>
              </select>
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WdateOfBirth"
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
                id="WdateOfBirth"
                className="form-control border-primary"
                selected={
                  WorkerData.WdateOfBirth
                    ? new Date(WorkerData.WdateOfBirth)
                    : null
                }
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
          </div>

          {/* <div className="col-3">
            <DatePickers
              selectedDate={WorkerData.WdateOfBirth}
              onDateChange={handleDateChange}
            />
          </div> */}
        </div>

        <div className="row mt-4">
          <div className="col-3">
            <label
              htmlFor="WorkerNID"
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
                placeholder="NID নাম্বার লিখুন"
                id="WorkerNID"
                required
                onChange={handleChange}
                name="WorkerNID"
                value={WorkerData.WorkerNID}
              ></input>
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="WorkerMobile"
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
                placeholder="019xxxxxxxx"
                id="WorkerMobile"
                required
                onChange={handleChange}
                name="WorkerMobile"
                value={WorkerData.WorkerMobile}
              ></input>
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="WorkerMail"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-mobile-alt"></i> মেইল
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
                type="email"
                className="form-control border-primary"
                placeholder="Demo@gmail.com"
                id="WorkerMail"
                required
                onChange={handleChange}
                name="WorkerMail"
                value={WorkerData.WorkerMail}
              ></input>
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="designation"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-tag"></i> পদবী নির্বাচন করুণ
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-user-tag"></i>
              </span>
              <select
                className="form-control border-primary"
                id="designation"
                value={designation}
                onChange={handleRankChange}
                required
              >
                <option value="" disabled>
                  --------
                </option>
                {/* Full Access or Restricted Access Designations */}
                {loggedUserDesignation === "নির্বাহী পরিচালক" ||
                loggedUserDesignation === "সহকারী নির্বাহী পরিচালক" ||
                loggedUserDesignation === "অর্থ পরিচালক" ||
                loggedUserDesignation === "প্রোগ্রাম অফিসার" ||
                loggedUserDesignation === "অডিট অফিসার" ||
                loggedUserDesignation === "সহকারী অডিট অফিসার" ||
                loggedUserDesignation === "এরিয়া ম্যানাজার"
                  ? designations.map((designation) => (
                      <option
                        key={designation.DesignationName}
                        value={designation.DesignationName}
                      >
                        {designation.DesignationName}
                      </option>
                    ))
                  : designations
                      .filter((d) =>
                        [
                          "উর্দ্ধতন কর্মসূচী সংগঠক",
                          "কর্মসূচী সংগঠক",
                          "সহকারী কর্মসূচী সংগঠক",
                        ].includes(d.DesignationName)
                      )
                      .map((filteredDesignation) => (
                        <option
                          key={filteredDesignation.DesignationName}
                          value={filteredDesignation.DesignationName}
                        >
                          {filteredDesignation.DesignationName}
                        </option>
                      ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          {/* User Branch */}
          {showUserBranch && (
            <div className="col-md-3">
              <label
                htmlFor="WorkerBranchAdd"
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
                  className="form-select border-primary"
                  id="WorkerBranchAdd"
                  name="WorkerBranchAdd" // <-- Added the name attribute here
                  onChange={handleBranchChange}
                  value={selectedBranch}
                  required
                >
                  <option value="" disabled>
                    --------
                  </option>
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
          )}

          {/* User Center */}
          {showCenterIDMember && (
            <div className="col-md-3">
              <label
                htmlFor="WorkerCenterAdd"
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
                  id="WorkerCenterAdd"
                  name="WorkerCenterAdd" // Added the name attribute here
                  className="form-select border-primary"
                  value={WorkerData.WorkerCenterAdd} // Use WorkerData.WorkerCenterAdd here
                  onChange={handleCenterChange}
                  required
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
          )}

          <div className="col-md-3">
            <label
              htmlFor="JoiningDate"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-birthday-cake"></i> যোগদানের তারিখ
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
                id="JoiningDate"
                className="form-control border-primary"
                selected={
                  WorkerData.JoiningDate
                    ? new Date(WorkerData.JoiningDate)
                    : null
                }
                onChange={handleJoiningDateChange}
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
          </div>

          <div className="col-md-3">
            <label
              htmlFor="WorkerImage"
              className="form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-image"></i> কর্মীর ছবি
            </label>
            <div className="input-group shadow-sm">
              <span
                className="input-group-text bg-primary text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00d4ff)",
                  color: "#fff",
                }}
              >
                <i className="fas fa-image"></i>
              </span>
              <input
                id="WorkerImage"
                className="form-control border-primary"
                type="file"
                name="WorkerImage"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <small className="text-muted">
              ৬০০/৬০০ এবং ২০০ KB এর মধ্যে ছবি দিন ।
            </small>
          </div>
        </div>

        <div className="col-12 mb-4 mt-5">
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

        <div className="d-flex justify-content-center mb-3">
          <button
            type="submit"
            className="btn btn-primary btn-lg shadow"
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
      </form>
    </div>
  );
};

export default WorkerAdmission;
