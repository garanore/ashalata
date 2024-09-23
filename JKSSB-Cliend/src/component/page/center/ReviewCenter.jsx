// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ReviewCenter = () => {
  const [centersNeedingCorrection, setCentersNeedingCorrection] = useState([]);
  const [editableCenterId, setEditableCenterId] = useState(null); // Track which row is editable
  const [error, setError] = useState("");
  const [editedCenter, setEditedCenter] = useState({
    CenterName: "",
    centerBranch: "",
    CenterAddress: "",
    CenterMnumber: "",
    centerWorker: "",
    CenterDay: "",
  });

  const [branches, setBranches] = useState([]);
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(true);

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

      const userBranchList = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(userBranchList);

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);
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
    }
  }, []);

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/opencenter/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("userBranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setCentersNeedingCorrection(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  // Handle field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedCenter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Set editable center
  const setEditableCenter = (center) => {
    setEditableCenterId(center._id);
    setEditedCenter({
      CenterName: center.CenterName,
      centerBranch: center.centerBranch,
      CenterAddress: center.CenterAddress,
      CenterMnumber: center.CenterMnumber,
      centerWorker: center.centerWorker,
      CenterDay: center.CenterDay,
    });
  };

  const saveCenterChanges = async (id) => {
    try {
      // Include the updated approvalStatus in the edited data
      const updatedCenter = {
        ...editedCenter,
        approvalStatus: "Approved",
      };

      const response = await axios.put(
        `http://localhost:5000/center-callback/${id}`, // Use the correct API endpoint
        updatedCenter
      );

      // Update the state with the new center data
      setCentersNeedingCorrection((prevState) =>
        prevState.map((center) =>
          center._id === id ? response.data.updatedCenter : center
        )
      );
      setEditableCenterId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating center:", error.message);
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Review Centers</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Review Centers</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {centersNeedingCorrection.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Center ID</th>
                  <th>Center Name</th>
                  <th>Branch</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centersNeedingCorrection.map((center) => (
                  <tr key={center._id}>
                    <td>{center.centerID}</td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterName"
                          value={editedCenter.CenterName}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        center.CenterName
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <select
                          id="centerBranch"
                          className="form-select"
                          name="centerBranch"
                          value={editedCenter.centerBranch}
                          onChange={handleFieldChange}
                        >
                          <option value="">Choose...</option>
                          {userBranches.includes("AllBranch") ||
                          userBranches.includes("AllCenter")
                            ? branches.map((branch) => (
                                <option
                                  key={branch._id}
                                  value={branch.BranchName}
                                >
                                  {branch.BranchName}
                                </option>
                              ))
                            : branches
                                .filter((branch) =>
                                  userBranches.includes(branch.BranchName)
                                )
                                .map((branch) => (
                                  <option
                                    key={branch._id}
                                    value={branch.BranchName}
                                  >
                                    {branch.BranchName}
                                  </option>
                                ))}
                        </select>
                      ) : (
                        center.centerBranch
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterAddress"
                          value={editedCenter.CenterAddress}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        center.CenterAddress
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <input
                          type="text"
                          name="CenterMnumber"
                          value={editedCenter.CenterMnumber}
                          onChange={handleFieldChange}
                        />
                      ) : (
                        center.CenterMnumber
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <select
                          id="CenterDay"
                          name="CenterDay"
                          className="form-select"
                          value={editedCenter.CenterDay}
                          onChange={handleFieldChange}
                        >
                          <option value="">Choose...</option>
                          <option value="শনিবার">শনিবার</option>
                          <option value="রবিবার">রবিবার</option>
                          <option value="সোমবার">সোমবার</option>
                          <option value="মঙ্গলবার">মঙ্গলবার</option>
                          <option value="বুধবার">বুধবার</option>
                          <option value="বৃহস্পতিবার">বৃহস্পতিবার</option>
                          <option value="শুক্রবার">শুক্রবার</option>
                        </select>
                      ) : (
                        center.CenterDay
                      )}
                    </td>
                    <td>
                      {editableCenterId === center._id ? (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() => saveCenterChanges(center._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setEditableCenterId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => setEditableCenter(center)}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No centers needing correction</p>
        )}
      </div>
    </div>
  );
};

export default ReviewCenter;
