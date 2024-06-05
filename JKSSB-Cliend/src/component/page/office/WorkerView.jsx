// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MEMBER_LIST_CENTER_ROUTE = "/home/WorkerDetails";

const WorkerView = () => {
  const location = useLocation();
  const workerID = location.state ? location.state.workerID : null;
  const navigate = useNavigate();
  const [allWorker, setAllWorker] = useState({});
  const [, setDesignations] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [, setCenters] = useState([]);
  const [, setBranches] = useState([]);
  const [workerBranchAdd, setWorkerBranchAdd] = useState("");
  const [workerCenterAdd, setWorkerCenterAdd] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    // Fetch worker data
    fetch(`https://ashalota.gandhipoka.com/worker-callback/${workerID}`)
      .then((res) => res.json())
      .then((data) => {
        setAllWorker(data);
        setWorkerBranchAdd(data.WorkerBranchAdd || "");
        setWorkerCenterAdd(data.WorkerCenterAdd || "");
        setDesignation(data.Designation || "");
      })
      .catch((error) => console.error("Error fetching worker data:", error));

    // Fetch designations
    axios
      .get("https://ashalota.gandhipoka.com/designation-callback")
      .then((response) => setDesignations(response.data))
      .catch((error) =>
        console.error("Error fetching designation data:", error)
      );

    // Fetch centers
    axios
      .get("https://ashalota.gandhipoka.com/center-callback")
      .then((response) => setCenters(response.data))
      .catch((error) => console.error("Error fetching center data:", error));

    // Fetch branches
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => setBranches(response.data))
      .catch((error) => console.error("Error fetching branch data:", error));
  }, [workerID, setBranches, setCenters, setDesignations]);

  const handleUpdateWorker = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      ID: form.ID.value,
      WorkerName: form.WorkerName.value,
      WorkerParent: form.WorkerParent.value,
      WorkerJob: form.WorkerJob.value,
      WorkerHome: form.WorkerHome.value,
      WorkerUnion: form.WorkerUnion.value,
      WorkerPost: form.WorkerPost.value,
      WorkerSubDic: form.WorkerSubDic.value,
      WorkerDic: form.WorkerDic.value,
      WorkerNID: form.WorkerNID.value,
      WorkerMobile: form.WorkerMobile.value,
      WorkerBranchAdd: workerBranchAdd,
      WorkerCenterAdd: workerCenterAdd,
      Designation: designation,
    };

    fetch(`https://ashalota.gandhipoka.com/worker-callback/${workerID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubmitMessage("Successfully Updated!");
        } else {
          console.error("Worker Update Failed");
        }
      });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateWorker}>
        <div className="border-bottom mb-3">
          <h2 className="text-center mb-4 pt-3">কর্মী সম্পাদনা</h2>
        </div>
        <div className="row g-4 mt-5">
          <div className="col-md-3">
            <label htmlFor="workerID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="ID"
              className="form-control"
              defaultValue={allWorker.workerID}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerName" className="form-label">
              নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerName"
              defaultValue={allWorker.WorkerName}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerParent" className="form-label">
              পিতা/স্বামীর নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerParent"
              defaultValue={allWorker.WorkerParent}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerJob" className="form-label">
              পেশা
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerJob"
              defaultValue={allWorker.WorkerJob}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerHome" className="form-label">
              গ্রাম/পাড়া
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerHome"
              defaultValue={allWorker.WorkerHome}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerUnion" className="form-label">
              ইউনিয়ন
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerUnion"
              defaultValue={allWorker.WorkerUnion}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerPost" className="form-label">
              ডাকঘর
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerPost"
              defaultValue={allWorker.WorkerPost}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerSubDic" className="form-label">
              থানা
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerSubDic"
              defaultValue={allWorker.WorkerSubDic}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerDic" className="form-label">
              জেলা
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerDic"
              defaultValue={allWorker.WorkerDic}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerNID" className="form-label">
              NID নাম্বার
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerNID"
              defaultValue={allWorker.WorkerNID}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerMobile" className="form-label">
              মোবাইল নাম্বার
            </label>
            <input
              className="form-control"
              type="text"
              name="WorkerMobile"
              defaultValue={allWorker.WorkerMobile}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerBranchAdd" className="form-label">
              শাঁখা
            </label>
            <div className="form-control">{workerBranchAdd}</div>
          </div>
          <div className="col-md-3">
            <label htmlFor="WorkerCenterAdd" className="form-label">
              কেন্দ্র
            </label>
            <div className="form-control">{workerCenterAdd}</div>
          </div>
          <div className="col-md-3">
            <label htmlFor="Designation" className="form-label">
              পদবি
            </label>
            <div className="form-control">{designation}</div>
          </div>
          <div className="d-flex justify-content-between mt-5">
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
      </form>
    </div>
  );
};

export default WorkerView;
