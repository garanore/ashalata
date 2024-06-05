// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const MEMBER_LIST_CENTER_ROUTE = "/home/CenterList";
import axios from "axios";

function CenterEdit() {
  const location = useLocation();
  const centerID = location.state ? location.state.centerID : null;
  const navigate = useNavigate();
  const [allCenter, setAllCenter] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [workerNames, setWorkerNames] = useState([]);

  useEffect(() => {
    fetchCenterDetails();
    fetchWorkerNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerID]);

  const fetchCenterDetails = async () => {
    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/center-callback/${centerID}`
      );
      setAllCenter(response.data);
    } catch (error) {
      console.error("Error fetching center details:", error.message);
    }
  };

  const fetchWorkerNames = async () => {
    try {
      const response = await axios.get(
        "https://ashalota.gandhipoka.com/worker-callback-center"
      );
      setWorkerNames(response.data.map((worker) => worker.WorkerName));
    } catch (error) {
      console.error("Error fetching worker names:", error.message);
    }
  };

  const handleUpdateCenter = (e) => {
    e.preventDefault();
    const form = e.target;
    const ID = form.ID.value;
    const CenterName = form.CenterName.value;
    const CenterAddress = form.CenterAddress.value;
    const CenterMnumber = form.CenterMnumber.value;
    const centerWorker = form.centerWorker.value;
    const CenterDay = form.CenterDay.value;

    setSubmitMessage("Successfully Updated!");
    const updatedData = {
      ID,
      CenterName,
      CenterAddress,
      CenterMnumber,
      centerWorker,
      CenterDay,
    };

    fetch(`https://ashalota.gandhipoka.com/center-callback/${centerID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Center Updated Successfully");
        } else {
          console.error("Center Update Failed");
        }
      });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  const handleSelectChange = (event) => {
    setSelectedWorker(event.target.value);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateCenter}>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">কেন্দ্র সম্পাদনা </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="centerID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="ID"
              className="form-control"
              defaultValue={allCenter.centerID}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="CenterName" className="form-label">
              নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="CenterName"
              defaultValue={allCenter.CenterName}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="CenterAddress" className="form-label">
              ঠিকানা
            </label>
            <input
              className="form-control"
              type="text"
              name="CenterAddress"
              defaultValue={allCenter.CenterAddress}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="CenterMnumber" className="form-label">
              মোবাইল
            </label>
            <input
              className="form-control"
              type="text"
              name="CenterMnumber"
              defaultValue={allCenter.CenterMnumber}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="CenterDay" className="form-label">
              কেন্দ্রের বার
            </label>
            <select
              id="CenterDay"
              name="CenterDay"
              className="form-select"
              defaultValue={allCenter.CenterDay ? allCenter.CenterDay : ""}
            >
              <option value="">Choose...</option>
              <option
                value="শনিবার"
                selected={allCenter.CenterDay === "শনিবার"}
              >
                শনিবার
              </option>
              <option
                value="রবিবার"
                selected={allCenter.CenterDay === "রবিবার"}
              >
                রবিবার
              </option>
              <option
                value="সোমবার"
                selected={allCenter.CenterDay === "সোমবার"}
              >
                সোমবার
              </option>
              <option
                value="মঙ্গলবার"
                selected={allCenter.CenterDay === "মঙ্গলবার"}
              >
                মঙ্গলবার
              </option>
              <option
                value="বুধবার"
                selected={allCenter.CenterDay === "বুধবার"}
              >
                বুধবার
              </option>
              <option
                value="বৃহস্পতিবার"
                selected={allCenter.CenterDay === "বৃহস্পতিবার"}
              >
                বৃহস্পতিবার
              </option>
              <option
                value="শুক্রবার"
                selected={allCenter.CenterDay === "শুক্রবার"}
              >
                শুক্রবার
              </option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="centerWorker" className="form-label">
              কর্মী
            </label>
            <select
              className="form-select"
              name="centerWorker"
              value={selectedWorker}
              defaultValue={allCenter.centerWorker}
              onChange={handleSelectChange}
            >
              {allCenter.centerWorker ? (
                <option value={allCenter.centerWorker}>
                  {allCenter.centerWorker}
                </option>
              ) : (
                <option value="">Select a Worker</option>
              )}
              {workerNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
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
}
export default CenterEdit;
