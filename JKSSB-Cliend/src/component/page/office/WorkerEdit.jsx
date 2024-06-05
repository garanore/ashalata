// MemberEdit.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MEMBER_LIST_CENTER_ROUTE = "/home/WorkerDetails";

const WorkerEdit = () => {
  const location = useLocation();
  const workerID = location.state ? location.state.workerID : null;
  const navigate = useNavigate();
  const [allWorker, setAllWorker] = useState({});
  const [designations, setDesignations] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranchs] = useState([]);

  useEffect(() => {
    // Fetch worker data
    fetch(`https://ashalota.gandhipoka.com/worker-callback/${workerID}`)
      .then((res) => res.json())
      .then((data) => setAllWorker(data))
      .catch((error) => console.error("Error fetching worker data:", error));

    // Fetch designations
    axios
      .get("https://ashalota.gandhipoka.com/designation-callback")
      .then((response) => {
        setDesignations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching designation data:", error);
      });

    // Fetch centers
    axios
      .get("https://ashalota.gandhipoka.com/center-callback")
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    // Fetch branches
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranchs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });
  }, [workerID]);

  const handleUpdateWorker = (e) => {
    e.preventDefault();
    const form = e.target;
    const ID = form.ID.value;
    const WorkerName = form.WorkerName.value;
    const WorkerParent = form.WorkerParent.value;
    const WorkerJob = form.WorkerJob.value;
    const WorkerHome = form.WorkerHome.value;
    const WorkerUnion = form.WorkerUnion.value;
    const WorkerPost = form.WorkerPost.value;
    const WorkerSubDic = form.WorkerSubDic.value;
    const WorkerDic = form.WorkerDic.value;
    const WorkerNID = form.WorkerNID.value;
    const WorkerMobile = form.WorkerMobile.value;
    const WorkerBranchAdd = form.WorkerBranchAdd.value;
    const WorkerCenterAdd = form.WorkerCenterAdd.value;
    const Designation = form.Designation.value;

    setSubmitMessage("Successfully Updated!");
    const updatedData = {
      ID,
      WorkerName,
      WorkerParent,
      WorkerJob,
      WorkerHome,
      WorkerUnion,
      WorkerPost,
      WorkerSubDic,
      WorkerDic,
      WorkerNID,
      WorkerMobile,
      WorkerBranchAdd,
      WorkerCenterAdd,
      Designation,
    };

    fetch(`https://ashalota.gandhipoka.com/worker-callback/${workerID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // console.log("Worker Updated Successfully");
        } else {
          console.error("Worker Update Failed");
        }
      });
  };

  const handleCenterChange = (e) => {
    const selectedCenter = e.target.value;
    setAllWorker({ ...allWorker, WorkerCenterAdd: selectedCenter });
  };

  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setAllWorker({ ...allWorker, WorkerBranchAdd: selectedBranch });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  const handleDesignationChange = (e) => {
    setAllWorker({ ...allWorker, Designation: e.target.value });
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateWorker}>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">কর্মী সম্পাদনা </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
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
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="WorkerBranchAdd" className="form-label">
              শাঁখা নির্বাচন করুণ
            </label>
            <select
              id="WorkerBranchAdd"
              className="form-select"
              value={allWorker.WorkerBranchAdd}
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

          <div className="col-md-3 mb-3">
            <label htmlFor="WorkerCenterAdd" className="form-label">
              কেন্দ্র নির্বাচন করুণ
            </label>
            <select
              className="form-select"
              id="WorkerCenterAdd"
              value={allWorker.WorkerCenterAdd} // Set the value to the state
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

          <div className="col-md-3">
            <label htmlFor="Designation" className="form-label">
              পদবি
            </label>
            <select
              id="Designation"
              name="Designation"
              className="form-select"
              value={allWorker.Designation ? allWorker.Designation : ""}
              onChange={handleDesignationChange}
            >
              <option value="">Choose...</option>
              {designations.map((designation) => (
                <option
                  key={designation._id}
                  value={designation.DesignationName}
                >
                  {designation.DesignationName}
                </option>
              ))}
            </select>
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

export default WorkerEdit;
