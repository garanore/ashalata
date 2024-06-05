// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import DatePickers from "./../../datepicker/DatePicker";
const API_URL = "https://ashalota.gandhipoka.com/workeradmission";
const DESIGNATION_CALLBACK_API =
  "https://ashalota.gandhipoka.com/designation-callback";

const WorkerAdmission = () => {
  const [WorkerCount, setWorkerCount] = useState(0);
  const [workerID, setWorkerID] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranchs] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

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
    Workerimage: null,
    WorkerCenterAdd: "",
    WorkerBranchAdd: "",
    Designation: "",
    JoiningDate: "",
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
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("Error fetching branch count");
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
    // Fetch branches data
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranchs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

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
    if (name === "WorkerBranchAdd") {
      setSelectedBranch(value);
      setWorkerData((prevData) => ({
        ...prevData,
        WorkerBranchAdd: value,
      }));
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
  // Total Family Member End
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(WorkerData),
      });

      // eslint-disable-next-line no-unused-vars
      const data = await response.json();

      // Handle success
      setSuccessMessage("Successfully added worker data!");
      setWorkerCount(WorkerCount + 1);
      setWorkerID(generateWorkerID());
      setWorkerData({
        workerID: "",
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
        Workerimage: null,
        WorkerCenterAdd: "",
        WorkerBranchAdd: "",
        Designation: "",
        JoiningDate: "",
        agreementChecked: false,
      });
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      formRef.current.reset();
    } catch (error) {
      console.error("Error submitting WorkerAdmission data:", error.message);
      // Handle error appropriately
    }
  };
  return (
    <div className=" container-fluid">
      <div className="  mt-2 bg-light">
        <div className="mb-5 ">
          <h2 className="text-center mb-4 pt-4 ">অফিস কর্মী ভর্তি ফর্ম </h2>
        </div>

        <form className=" bg-light " onSubmit={handleSubmit} ref={formRef}>
          {/* <!-- Full Name --> */}

          <div className="row">
            <div className="mb-3 col-4">
              <label htmlFor="workerID" className="form-label">
                Worker ID:
              </label>
              <input
                id="workerID"
                className="form-control"
                type="text"
                value={workerID}
                disabled
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="WorkerName" className="form-label">
                নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerName"
                required
                onChange={handleChange}
                name="WorkerName"
                value={WorkerData.WorkerName}
              ></input>
            </div>

            {/* সদস্য তথ্য শুরু */}

            <div className="col-md-4">
              <label htmlFor="WorkerParent" className="form-label">
                পিতা/স্বামীর নাম
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerParent"
                required
                onChange={handleChange}
                name="WorkerParent"
                value={WorkerData.WorkerParent}
              ></input>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-3">
              <label htmlFor="WorkerJob" className="form-label">
                পেশা
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerJob"
                required
                onChange={handleChange}
                name="WorkerJob"
                value={WorkerData.WorkerJob}
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="WorkerHome" className="form-label">
                গ্রাম/পাড়া
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerHome"
                required
                onChange={handleChange}
                name="WorkerHome"
                value={WorkerData.WorkerHome}
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="WorkerUnion" className="form-label">
                ইউনিয়ন
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerUnion"
                required
                onChange={handleChange}
                name="WorkerUnion"
                value={WorkerData.WorkerUnion}
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="WorkerPost" className="form-label">
                ডাকঘর
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerPost"
                required
                onChange={handleChange}
                name="WorkerPost"
                value={WorkerData.WorkerPost}
              ></input>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-3">
              <label htmlFor="WorkerSubDic" className="form-label">
                থানা
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerSubDic"
                required
                onChange={handleChange}
                name="WorkerSubDic"
                value={WorkerData.WorkerSubDic}
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="WorkerDic" className="form-label">
                জেলা
              </label>
              <input
                type="text"
                className="form-control"
                id="WorkerDic"
                required
                onChange={handleChange}
                name="WorkerDic"
                value={WorkerData.WorkerDic}
              ></input>
            </div>

            <div className="col-md-3">
              <label htmlFor="WorkerMarital" className="form-label">
                বৈবাহিক অবস্থা
              </label>
              <select
                id="WorkerMarital"
                name="WorkerMarital"
                className="form-select"
                value={WorkerData.WorkerMarital}
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

            <div className="col-md-3">
              <label htmlFor="WorkerStudy" className="form-label">
                শিক্ষাগত যোগ্যতা
              </label>
              <select
                id="WorkerStudy"
                name="WorkerStudy"
                className="form-select"
                value={WorkerData.WorkerStudy}
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

          <div className="row mt-4">
            <div className="col-3">
              <label htmlFor="WorkerNID" className="form-label">
                NID নাম্বার{" "}
              </label>
              <input
                type="number"
                className="form-control"
                id="WorkerNID"
                required
                onChange={handleChange}
                name="WorkerNID"
                value={WorkerData.WorkerNID}
              ></input>
            </div>

            <div className="col-3">
              <DatePickers
                selectedDate={WorkerData.WdateOfBirth}
                onDateChange={handleDateChange}
              />
            </div>

            <div className="col-3">
              <label htmlFor="WorkerMobile" className="form-label">
                মোবাইল নাম্বার{" "}
              </label>
              <input
                type="number"
                className="form-control"
                id="WorkerMobile"
                required
                onChange={handleChange}
                name="WorkerMobile"
                value={WorkerData.WorkerMobile}
              ></input>
            </div>

            <div className="col-3">
              <label htmlFor="WorkerMail" className="col-form-label">
                মেইল{" "}
              </label>

              <input
                type="email"
                className="form-control"
                id="WorkerMail"
                required
                onChange={handleChange}
                name="WorkerMail"
                value={WorkerData.WorkerMail}
              ></input>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-3">
              <label htmlFor="WorkerBranchAdd" className="form-label">
                শাঁখা নির্বাচন করুণ
              </label>
              <select
                id="WorkerBranchAdd"
                className="form-select"
                value={selectedBranch.WorkerBranchAdd}
                onChange={handleBranchChange}
                name="WorkerBranchAdd"
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
            <div className="col-md-3">
              <label htmlFor="WorkerCenterAdd" className="form-label">
                কেন্দ্র নির্বাচন করুণ
              </label>
              <select
                id="workerCenterAdd"
                name="WorkerCenterAdd"
                className="form-select"
                value={WorkerData.WorkerCenterAdd}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                {centers.map((center) => (
                  <option key={center.centerID} value={center.centerID}>
                    {center.centerID}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="Designation" className="form-label">
                পদবি
              </label>
              <select
                id="Designation"
                name="Designation"
                className="form-select"
                value={WorkerData.Designation}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                {/* Map over the designations state to create options */}
                {designations.map((designation) => (
                  <option
                    key={designation.DesignationID}
                    value={designation.DesignationName}
                  >
                    {designation.DesignationName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 col-3">
              <label htmlFor="JoiningDate" className="form-label">
                যোগদানের তারিখ
              </label>

              <div>
                <DatePicker
                  id="JoiningDate"
                  className="form-control"
                  selected={
                    WorkerData.JoiningDate
                      ? new Date(WorkerData.JoiningDate)
                      : null
                  }
                  onChange={handleJoiningDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
                name="agreementChecked"
                checked={WorkerData.agreementChecked}
                onChange={handleChange}
              ></input>
              <label className="form-check-label" htmlFor="gridCheck">
                Check me out
              </label>
            </div>
          </div>

          <div className="col-12 mb-5">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default WorkerAdmission;
