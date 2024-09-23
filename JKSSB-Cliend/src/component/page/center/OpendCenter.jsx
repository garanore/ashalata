// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/opencenter";

function OpenCenter() {
  const [centerCount, setCenterCount] = useState(0);
  const [centerID, setCenterID] = useState("");

  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [formData, setFormData] = useState({
    centerID: "",
    CenterName: "",
    CenterAddress: "",
    CenterMnumber: "",
    centerBranch: "",
    CenterDay: "",
    submittedBy: "", // Make sure this is part of the form state
    GrantedBy: "Null", // Ensure it's set correctly
    DeletedStatus: "Null", // Ensure it's set correctly
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(true);

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

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";

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
      setFormData((prevData) => ({
        ...prevData,
        submittedBy: username, // Set the username correctly here
      }));
    }
  }, []);

  // For Center ID-----------------------------------

  const fetchCenterCount = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      const count = response.data.count;
      setCenterCount(count);
      setCenterID(generateCenterID(count));
    } catch (error) {
      console.error("Error fetching branch count:", error.message);
      setSubmitMessage("Error fetching branch count");
    }
  }, []);

  useEffect(() => {
    fetchCenterCount();
  }, [fetchCenterCount]);

  const generateCenterID = (count) => {
    const paddedCount = (count + 1).toString().padStart(4, "0");
    return `C${paddedCount}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.CenterName.trim() ||
        !formData.CenterAddress.trim() ||
        (typeof formData.CenterMnumber === "string" &&
          !formData.CenterMnumber.trim())
      ) {
        return;
      }

      const trimmedFormData = {
        ...formData,
        centerID: formData.centerID.trim(),
        CenterName: formData.CenterName.trim(),
        CenterAddress: formData.CenterAddress.trim(),
        CenterMnumber: formData.CenterMnumber.trim(),
        centerBranch: formData.centerBranch.trim(),
        CenterDay: formData.CenterDay.trim(),
        approvalStatus: "Approved", // Ensure it's set correctly
        ActiveStatus: "True", // Ensure it's set correctly
      };

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, {
        ...trimmedFormData,
      });

      setSubmitMessage("Pending for Approval");

      setCenterCount(centerCount + 1);
      setCenterID(generateCenterID(centerCount + 1));
      setFormData({
        centerID: "",
        CenterName: "",
        CenterAddress: "",
        CenterMnumber: "",
        centerBranch: "",
        CenterDay: "",
        submittedBy: "", // Reset this as well
        GrantedBy: "Null", // Ensure it's set correctly
        DeletedStatus: "Null", // Ensure it's set correctly
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">কেন্দ্র খুলুন</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-light  container-fluid ">
      <div className=" ">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">কেন্দ্র খুলুন</h2>
          </div>
        </div>

        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="mb-3 col-3">
                <label htmlFor="centerID" className="form-label">
                  Center ID:
                </label>
                <input
                  id="centerID"
                  className="form-control"
                  type="text"
                  value={centerID}
                  disabled
                />
              </div>
              <div className="mb-3 col-md-3 col-3">
                <label htmlFor="CenterName" className="form-label">
                  কেন্দ্রের নাম
                </label>
                <input
                  id="CenterName"
                  className="form-control"
                  type="text"
                  value={formData.CenterName}
                  onChange={handleChange}
                  name="CenterName"
                />
              </div>

              <div className="mb-3 col-3 col-md-3">
                <label htmlFor="CenterAddress" className="form-label">
                  ঠিকানা
                </label>
                <input
                  id="CenterAddress"
                  className="form-control"
                  type="text"
                  value={formData.CenterAddress}
                  onChange={handleChange}
                  name="CenterAddress"
                />
              </div>

              <div className="mb-3 col-3 col-md-3">
                <label htmlFor="CenterMnumber" className="form-label">
                  মোবাইল:
                </label>
                <input
                  id="CenterMnumber"
                  className="form-control"
                  type="number"
                  value={formData.CenterMnumber}
                  onChange={handleChange}
                  name="CenterMnumber"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-4 col-md-4">
                <label htmlFor="centerBranch" className="form-label">
                  শাঁখা নির্বাচন করুণ
                </label>
                <select
                  id="centerBranch"
                  className="form-select"
                  value={formData.centerBranch}
                  onChange={handleChange}
                  name="centerBranch"
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

              <div className="col-md-3">
                <label htmlFor="CenterDay" className="form-label">
                  কেন্দ্রের বার
                </label>
                <select
                  id="CenterDay"
                  name="CenterDay"
                  className="form-select"
                  value={formData.CenterDay}
                  onChange={handleChange}
                >
                  <option value="">Choose...</option>
                  <option>শনিবার</option>
                  <option>রবিবার </option>
                  <option>সোমবার </option>
                  <option>মঙ্গলবার</option>
                  <option>বুধবার</option>
                  <option>বৃহস্পতিবার </option>
                  <option>শুক্রবার</option>
                </select>
              </div>
            </div>

            <div className="col-12 mb-5 mt-5">
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Apply
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
      </div>
    </div>
  );
}

export default OpenCenter;
