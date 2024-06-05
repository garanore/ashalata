// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const MEMBER_LIST_CENTER_ROUTE = "/home/BranchList";

function BranchEditModal() {
  const location = useLocation();
  const BranchID = location.state ? location.state.BranchID : null;
  const navigate = useNavigate();
  const [allBranch, setAllBranch] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    fetch(`https://ashalota.gandhipoka.com/branch-callback/${BranchID}`)
      .then((res) => res.json())
      .then((data) => setAllBranch(data));
  }, [BranchID]);

  const handleUpdateBranch = (e) => {
    e.preventDefault();
    const form = e.target;
    const ID = form.ID.value;
    const BranchName = form.BranchName.value;
    const BranchAddress = form.BranchAddress.value;
    const BranchMobile = form.BranchMobile.value;
    const selectedManager = form.selectedManager.value;

    setSubmitMessage("Successfully Updated!");
    const updatedData = {
      ID,
      BranchName,
      BranchAddress,
      BranchMobile,
      selectedManager,
    };

    fetch(`https://ashalota.gandhipoka.com/branch-callback/${BranchID}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Branch Updated Successfully");
        } else {
          console.error("Branch Update Failed");
        }
      });
  };

  const handleCancel = () => {
    navigate(MEMBER_LIST_CENTER_ROUTE);
  };

  return (
    <div className="form-row bg-light container-fluid p-2">
      <form onSubmit={handleUpdateBranch}>
        <div className=" ">
          <div className=" border-bottom mb-3 ">
            <h2 className="text-center   mb-4 pt-3">শাখা সম্পাদনা </h2>
          </div>
        </div>

        <div className="row  g-4  mt-5">
          <div className="col-md-4">
            <label htmlFor="BranchID" className="form-label">
              ID
            </label>
            <input
              type="text"
              name="ID"
              className="form-control"
              defaultValue={allBranch.BranchID}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="BranchName" className="form-label">
              নাম
            </label>
            <input
              className="form-control"
              type="text"
              name="BranchName"
              defaultValue={allBranch.BranchName}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="BranchAddress" className="form-label">
              ঠিকানা
            </label>
            <input
              className="form-control"
              type="text"
              name="BranchAddress"
              defaultValue={allBranch.BranchAddress}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="BranchMobile" className="form-label">
              মোবাইল
            </label>
            <input
              className="form-control"
              type="text"
              name="BranchMobile"
              defaultValue={allBranch.BranchMobile}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="selectedManager" className="form-label">
              ম্যানেজার
            </label>
            <input
              className="form-control"
              type="text"
              name="selectedManager"
              defaultValue={allBranch.selectedManager}
            />
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
export default BranchEditModal;
