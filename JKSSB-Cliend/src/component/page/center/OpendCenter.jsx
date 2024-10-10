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
    submittedBy: "",
    GrantedBy: "Null",
    DeletedStatus: "Null",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(true);
  const [username, setUsername] = useState("");
  const [accountName, setAccountName] = useState(""); // Add accountName state

  useEffect(() => {
    // Fetch all branches
    axios
      .get("http://localhost:5000/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
      });

    // Retrieve user branch data and designation from localStorage
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

      const restrictedDesignations = [
        "উর্দ্ধতন কর্মসূচী সংগঠক",
        "কর্মসূচী সংগঠক",
        "সহকারী কর্মসূচী সংগঠক",
      ];
      const userHasRestrictedDesignation = designations.some((designation) =>
        restrictedDesignations.includes(designation)
      );

      setHasAccess(!userHasRestrictedDesignation);

      setFormData((prevData) => ({
        ...prevData,
        submittedBy: username,
      }));
    }
  }, []);

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
    const paddedCount = (count + 1).toString().padStart(3, "0");
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
      // Ensure that the required fields are filled
      if (
        !formData.CenterName.trim() ||
        !formData.CenterAddress.trim() ||
        (typeof formData.CenterMnumber === "string" &&
          !formData.CenterMnumber.trim())
      ) {
        return;
      }

      // Find the BranchID based on the selected centerBranch (BranchName)
      const selectedBranch = branches.find(
        (branch) => branch.BranchName === formData.centerBranch
      );

      const BranchID = selectedBranch ? selectedBranch.BranchID : null;

      if (!BranchID) {
        setSubmitMessage("Branch ID not found for the selected branch.");
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
        BranchID: BranchID, // Add BranchID to the form data
        approvalStatus: "Approved",
        ActiveStatus: "True",
      };

      // Send the data to the backend
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, {
        ...trimmedFormData,
      });

      setSubmitMessage("Pending for Approval");

      // Reset form fields and update center count and ID
      setCenterCount(centerCount + 1);
      setCenterID(generateCenterID(centerCount + 1));
      setFormData({
        centerID: "",
        CenterName: "",
        CenterAddress: "",
        CenterMnumber: "",
        centerBranch: "",
        CenterDay: "",
        submittedBy: "",
        GrantedBy: "Null",
        DeletedStatus: "Null",
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setSubmitMessage(`Error: ${error.message}`);
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
              <i
                className="fas fa-map-marker-alt"
                style={{ marginRight: "10px" }}
              ></i>
              কেন্দ্র খুলুন
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
    <div className=" bg-light  container-fluid ">
      <div className=" ">
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
                <i className="fas fa-map-marker-alt"></i> কেন্দ্র খুলুন
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

        <div>
          <form className="p-3">
            <div className="row mb-4">
              <div className="col-md-3">
                <label
                  htmlFor="memberID"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-id-card"></i> Center ID:
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
                    id="centerID"
                    className="form-control border-primary"
                    type="text"
                    value={centerID}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <label
                  htmlFor="CenterName"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-store"></i> কেন্দ্রের নাম
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
                    id="CenterName"
                    className="form-control border-primary"
                    type="text"
                    value={formData.CenterName}
                    onChange={handleChange}
                    placeholder="কেন্দ্রের নাম লিখুন"
                    name="CenterName"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="CenterAddress"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-home"></i> ঠিকানা
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
                    id="CenterAddress"
                    className="form-control border-primary"
                    type="text"
                    value={formData.CenterAddress}
                    placeholder="ঠিকানা লিখুন"
                    onChange={handleChange}
                    name="CenterAddress"
                  />
                </div>
              </div>

              <div className="col-3">
                <label
                  htmlFor="MemberMobile"
                  className="col-form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-mobile-alt"></i> মোবাইল:
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
                    id="CenterMnumber"
                    className="form-control border-primary"
                    type="number"
                    placeholder="মোবাইল নাম্বার লিখুন"
                    value={formData.CenterMnumber}
                    onChange={handleChange}
                    name="CenterMnumber"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-3">
                <label
                  htmlFor="BranchMember"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-code-branch"></i>শাঁখা নির্বাচন করুণ
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
                    id="centerBranch"
                    className="form-select border-primary"
                    value={formData.centerBranch}
                    onChange={handleChange}
                    name="centerBranch"
                  >
                    <option value="">--------</option>
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
              </div>

              <div className="col-md-3">
                <label
                  htmlFor="CenterDay"
                  className="form-label"
                  style={{ fontWeight: "bold", color: "#4A5568" }}
                >
                  <i className="fas fa-calendar-day"></i> কেন্দ্রের বার
                </label>
                <div className="input-group shadow-sm">
                  <span
                    className="input-group-text bg-primary text-white"
                    style={{
                      background: "linear-gradient(45deg, #007bff, #00d4ff)",
                      color: "#fff",
                    }}
                  >
                    <i className="fas fa-calendar-day"></i>
                  </span>
                  <select
                    id="CenterDay"
                    name="CenterDay"
                    className="form-select border-primary"
                    value={formData.CenterDay}
                    onChange={handleChange}
                  >
                    <option value="">--------</option>
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
            </div>

            <div className="col-12 mb-5 mt-5">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default OpenCenter;
