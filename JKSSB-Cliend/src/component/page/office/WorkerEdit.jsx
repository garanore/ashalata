// MemberEdit.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// const MEMBER_LIST_CENTER_ROUTE = "/home/WorkerDetails";

const WorkerEdit = () => {
  const location = useLocation();
  const workerID = location.state ? location.state.workerID : null;
  const navigate = useNavigate();

  const [designations, setDesignations] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [centers, setCenters] = useState([]);
  const [branches, setBranchs] = useState([]);
  const [allWorker, setAllWorker] = useState({
    WorkerCenterAdd: [""],
    WorkerBranchAdd: [""],
  });

  useEffect(() => {
    // Fetch worker data
    // Fetch worker data
    fetch(`http://localhost:5000/worker-callback/${workerID}`)
      .then((res) => res.json())
      .then((data) => {
        setAllWorker({
          ...data,
          WorkerCenterAdd: Array.isArray(data.WorkerCenterAdd)
            ? data.WorkerCenterAdd
            : [""],
          WorkerBranchAdd: Array.isArray(data.WorkerBranchAdd)
            ? data.WorkerBranchAdd
            : [""],
        });
      })
      .catch((error) => console.error("Error fetching worker data:", error));

    // Fetch designations
    axios
      .get("http://localhost:5000/designation-callback")
      .then((response) => {
        setDesignations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching designation data:", error);
      });

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

    // Fetch branches
    axios
      .get("http://localhost:5000/branch-callback")
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
      WorkerBranchAdd: allWorker.WorkerBranchAdd,
      WorkerCenterAdd: allWorker.WorkerCenterAdd,
      Designation: form.Designation.value,
    };

    fetch(`http://localhost:5000/worker-callback/${workerID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
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

  const handleCenterChange = (e, index) => {
    const updatedCenters = [...allWorker.WorkerCenterAdd];
    updatedCenters[index] = e.target.value;
    setAllWorker({ ...allWorker, WorkerCenterAdd: updatedCenters });
  };
  const handleAddCenter = () => {
    setAllWorker((prevState) => ({
      ...prevState,
      WorkerCenterAdd: [...prevState.WorkerCenterAdd, ""],
    }));
  };
  const handleRemoveCenter = (index) => {
    const updatedCenters = allWorker.WorkerCenterAdd.filter(
      (_, i) => i !== index
    );
    setAllWorker({ ...allWorker, WorkerCenterAdd: updatedCenters });
  };

  const handleBranchChange = (e, index) => {
    const updatedBranches = [...allWorker.WorkerBranchAdd];
    updatedBranches[index] = e.target.value;
    setAllWorker({ ...allWorker, WorkerBranchAdd: updatedBranches });
  };

  const handleAddBranch = () => {
    setAllWorker((prevState) => ({
      ...prevState,
      WorkerBranchAdd: [...prevState.WorkerBranchAdd, ""],
    }));
  };

  const handleRemoveBranch = (index) => {
    const updatedBranches = allWorker.WorkerBranchAdd.filter(
      (_, i) => i !== index
    );
    setAllWorker({ ...allWorker, WorkerBranchAdd: updatedBranches });
  };

  const handleCancel = () => {
    const previousPage = location.state?.from || "WorkerDetails"; // Use "WorkerDetails" as a default
    const workerID = location.state?.workerID;

    if (previousPage === "OfficeWorkerGranted") {
      navigate("/home/OfficeWorkerGranted", { state: { workerID } });
    } else if (previousPage === "WorkerDetails") {
      navigate("/home/WorkerDetails", { state: { workerID }, replace: true });
    } else {
      navigate("/home/WorkerDetails", { state: { workerID }, replace: true });
    }
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

          {/* Branches */}
          {allWorker.WorkerBranchAdd.map((branch, index) => (
            <div className="col-3 d-flex align-items-center" key={index}>
              <div className="w-100">
                <label
                  htmlFor={`WorkerBranchAdd${index}`}
                  className="form-label"
                >
                  শাঁখা নির্বাচন করুণ
                </label>
                <select
                  id={`WorkerBranchAdd${index}`}
                  className="form-select"
                  value={branch || "N/A"}
                  onChange={(e) => handleBranchChange(e, index)}
                >
                  <option value="">Choose...</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.BranchName}>
                      {branch.BranchName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm mt-4 ms-2"
                onClick={handleAddBranch}
              >
                +
              </button>
              {allWorker.WorkerBranchAdd.length > 1 && index > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-4"
                  onClick={() => handleRemoveBranch(index)}
                >
                  X
                </button>
              )}
            </div>
          ))}

          {/* Centers */}
          {allWorker.WorkerCenterAdd.map((center, index) => (
            <div className="col-3 d-flex align-items-center" key={index}>
              <div className="w-100">
                <label
                  htmlFor={`WorkerCenterAdd${index}`}
                  className="form-label"
                >
                  কেন্দ্র নির্বাচন করুণ
                </label>
                <select
                  id={`WorkerCenterAdd${index}`}
                  className="form-select"
                  value={center || "N/A"}
                  onChange={(e) => handleCenterChange(e, index)}
                >
                  <option value="">Choose...</option>
                  {centers.map((center) => (
                    <option key={center._id} value={center.centerID}>
                      {center.centerID}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-2 mt-4"
                onClick={handleAddCenter}
              >
                +
              </button>
              {allWorker.WorkerCenterAdd.length > 1 && index > 0 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm ms-2 mt-4"
                  onClick={() => handleRemoveCenter(index)}
                >
                  X
                </button>
              )}
            </div>
          ))}

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
