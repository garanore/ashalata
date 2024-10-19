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
    Center: [""],
    Branch: [""],
  });

  useEffect(() => {
    // Fetch worker data
    fetch(`http://localhost:5000/worker-callback/${workerID}`)
      .then((res) => res.json())
      .then((data) => {
        setAllWorker({
          ...data,
          Center: Array.isArray(data.Center) ? data.Center : [""],
          Branch: Array.isArray(data.Branch) ? data.Branch : [""],
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

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Gather updated data from the form
    const updatedWorkerData = {
      WorkerNID: e.target.WorkerNID.value,
      WorkerName: e.target.WorkerName.value,
      WorkerParent: e.target.WorkerParent.value,
      WorkerJob: e.target.WorkerJob.value,
      WorkerHome: e.target.WorkerHome.value,
      WorkerUnion: e.target.WorkerUnion.value,
      WorkerPost: e.target.WorkerPost.value,
      WorkerSubDic: e.target.WorkerSubDic.value,
      WorkerDic: e.target.WorkerDic.value,
      WorkerMobile: e.target.WorkerMobile.value,
      WorkerBranchAdd: allWorker.WorkerBranchAdd,
      WorkerCenterAdd: allWorker.WorkerCenterAdd,
      designation: e.target.designation.value,
    };

    try {
      // Ensure that you're calling the correct backend server
      const response = await fetch(
        `http://localhost:5000/worker-callback/${allWorker._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWorkerData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Worker updated successfully");
        // Optionally refresh the worker data or navigate to another page
      } else {
        alert(data.message || "Failed to update worker");
      }
    } catch (error) {
      console.error("Update Worker Error:", error);
      alert("An error occurred while updating the worker.");
    }
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
    setAllWorker({ ...allWorker, designation: e.target.value });
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdate}>
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
                <i
                  className="fas fa-user-edit"
                  style={{ marginRight: "10px" }}
                ></i>{" "}
                কর্মী সম্পাদনা
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
                name="workerID"
                className="form-control border-primary"
                type="text"
                defaultValue={allWorker.workerID}
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
              <i className="fas fa-user"></i>
              নাম
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
                name="WorkerName"
                defaultValue={allWorker.WorkerName}
              />
            </div>
          </div>

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
                className="form-control border-primary"
                type="text"
                name="WorkerParent"
                defaultValue={allWorker.WorkerParent}
              />
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
                className="form-select shadow-sm border-primary"
                type="text"
                name="WorkerJob"
                defaultValue={allWorker.WorkerJob}
              />
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
                className="form-control border-primary"
                type="text"
                name="WorkerHome"
                defaultValue={allWorker.WorkerHome}
              />
            </div>
          </div>

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
                className="form-control border-primary"
                type="text"
                name="WorkerUnion"
                defaultValue={allWorker.WorkerUnion}
              />
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
                className="form-control border-primary"
                type="text"
                name="WorkerPost"
                defaultValue={allWorker.WorkerPost}
              />
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
                className="form-control border-primary"
                type="text"
                name="WorkerSubDic"
                defaultValue={allWorker.WorkerSubDic}
              />
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
                className="form-control border-primary"
                type="text"
                name="WorkerDic"
                defaultValue={allWorker.WorkerDic}
              />
            </div>
          </div>

          <div className="col-md-3">
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
                className="form-control border-primary"
                type="number"
                name="WorkerNID"
                defaultValue={allWorker.WorkerNID}
              />
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
                className="form-control border-primary"
                type="number"
                name="WorkerMobile"
                defaultValue={allWorker.WorkerMobile}
              />
            </div>
          </div>

          <div className="col-3">
            <label
              htmlFor="designation"
              className="col-form-label"
              style={{ fontWeight: "bold", color: "#4A5568" }}
            >
              <i className="fas fa-user-tag"></i> পদবী
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
                id="designation"
                name="designation"
                className="form-control border-primary"
                value={allWorker.designation ? allWorker.designation : ""}
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
          </div>

          {/* Branches */}
          {allWorker.WorkerBranchAdd?.map((branch, index) => (
            <div className="col-md-3 d-flex align-items-center" key={index}>
              <div className="w-100">
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
                    id={`WorkerBranchAdd${index}`}
                    className="form-select border-primary"
                    value={branch || "N/A"}
                    onChange={(e) => handleBranchChange(e, index)}
                  >
                    <option value="">--------</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.BranchName}>
                        {branch.BranchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm mt-4 ms-2 me-1"
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
          {allWorker.WorkerCenterAdd?.map((center, index) => (
            <div className="col-3 d-flex align-items-center" key={index}>
              <div className="w-100">
                <label
                  htmlFor="CenterIDMember"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-map-marker-alt"></i> কেন্দ্র নির্বাচন
                  করুণ
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
                    id={`WorkerCenterAdd${index}`}
                    className="form-select"
                    value={center || "N/A"}
                    onChange={(e) => handleCenterChange(e, index)}
                  >
                    <option value="">--------</option>
                    {centers.map((center) => (
                      <option key={center._id} value={center.centerID}>
                        {center.centerID}
                      </option>
                    ))}
                  </select>
                </div>
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
