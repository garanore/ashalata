// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/center.css";

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

function SavingDetails() {
  const [selectedCenter, setSelectedCenter] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedMember, setSelectedMember] = useState(null);
  const [savings, setSavings] = useState({});
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();
  const [centerDay, setCenterDay] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [totalSavings, setTotalSavings] = useState({});
  const [userCenters, setuserCenters] = useState([]);

  const [username, setUsername] = useState(""); // Add username state
  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 25; // Members per page

  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Fetch all active centers initially
    axios
      .get("http://localhost:5000/center-callback")
      .then((response) => {
        // Filter out centers with ActiveStatus "False"
        const activeCenters = response.data.filter(
          (center) => center.ActiveStatus !== "False"
        );

        // Store all active centers initially
        setCenters(activeCenters);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });

    // Function to fetch centers for branches
    const fetchCentersForBranches = async (branches) => {
      try {
        // Fetch centers for each branch
        const centerPromises = branches.map((branch) =>
          axios.get(`http://localhost:5000/center-callback-by-branch/${branch}`)
        );

        const centerResponses = await Promise.all(centerPromises);

        // Extract and merge center data from the responses
        const allCenters = centerResponses
          .map((response) => response.data)
          .flat(); // Flatten the array of arrays

        // Filter out inactive centers
        const activeCenters = allCenters.filter(
          (center) => center.ActiveStatus !== "False"
        );

        setCenters(activeCenters); // Set the merged active centers
      } catch (error) {
        console.error("Error fetching centers for branches:", error);
      }
    };

    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserCenter"))
        .map((key) => parsedData[key]);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const userDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];

      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username);
      setDesignation(userDesignation); // Set the designation in the state

      // First logic: check if the user has access to all branches
      if (branches.includes("AllBranch")) {
        setHasAccess(true); // Grant full access
      }
      // Second logic: check if the user has restricted designation
      else if (restrictedDesignations.includes(userDesignation)) {
        // Filter centers the user has access to based on UserCenter
        const userAccessibleCenters = centers;

        // Fetch only the centers the user has access to
        axios
          .get("http://localhost:5000/center-callback")
          .then((response) => {
            const activeCenters = response.data.filter(
              (center) =>
                center.ActiveStatus !== "False" &&
                userAccessibleCenters.includes(center.centerID)
            );
            setCenters(activeCenters); // Set the filtered centers
          })
          .catch((error) => {
            console.error("Error fetching center data:", error);
          });

        setuserCenters(userAccessibleCenters); // Store user's specific centers
        setHasAccess(false); // Restrict access to specific centers
      }
      // Third logic: check if the user has specific branches
      else if (branches.length > 0) {
        // Call the fetchCentersForBranches function only if branches exist
        fetchCentersForBranches(branches);
        setHasAccess(false); // Restrict access to specific centers
      }
      // If no specific access is granted
      else {
        setuserCenters(centers); // Store the user's specific centers
        setHasAccess(false); // Restrict access
      }
    }
  }, []);

  const fetchTotalSaving = async (savingID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/saving-collection-total/${savingID}`
      );
      return response.data.total;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Return 0 if the savingID is not found without logging the error
        return 0;
      } else {
        console.error("Error fetching total saving data:", error);
        return 0;
      }
    }
  };

  const handleCenterChange = async (e) => {
    const center = e.target.value;
    setSelectedCenter(center);
    setSelectedMember(null);

    // Fetch loan data for the selected center
    try {
      const response = await axios.get(
        `http://localhost:5000/saving-callback?center=${encodeURIComponent(
          center
        )}`
      );

      // Fetch total saving for each item
      const savingsData = response.data;
      const totalSavingsData = {};
      for (const savingItem of savingsData) {
        const totalSaving = await fetchTotalSaving(savingItem.SavingID);
        totalSavingsData[savingItem.SavingID] = totalSaving;
      }

      // Update the savings and totalSavings state with the fetched data
      setSavings((prevSavings) => ({
        ...prevSavings,
        [center]: savingsData,
      }));
      setTotalSavings((prevTotalSavings) => ({
        ...prevTotalSavings,
        [center]: totalSavingsData,
      }));

      // Apply the deleteMode filter to the fetched data
      if (deleteMode) {
        const inactiveCenters = savingsData.filter(
          (savingItem) => savingItem.ActiveStatus === "False"
        );
        setMembers(inactiveCenters); // Set the members to inactive centers
      } else {
        const activeCenters = savingsData.filter(
          (savingItem) => savingItem.ActiveStatus !== "False"
        );
        setMembers(activeCenters); // Set the members to active centers
      }

      setCurrentPage(1); // Reset to the first page after filtering

      // Fetch center worker and center day
      axios
        .get(`http://localhost:5000/center-callback-id/${center}`)
        .then((response) => {
          const workerData = response.data;
          setSelectedWorker(
            workerData.length > 0 ? workerData[0].centerWorker : ""
          );
          setCenterDay(workerData.length > 0 ? workerData[0].CenterDay : "");
        })
        .catch((error) => {
          console.error("Error fetching center worker data:", error);
        });

      axios
        .get(`http://localhost:5000/get-worker-name/${center}`)
        .then((response) => {
          const workerName = response.data.WorkerName;
          setSelectedWorker(workerName ? workerName : "No worker found");
        })
        .catch((error) => {
          console.error("Error fetching worker name:", error);
          setSelectedWorker("No worker found");
        });
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  // // Calculate the total amount of all total savings for the selected center
  // const totalAmount =
  //   selectedCenter &&
  //   Object.values(totalSavings[selectedCenter] || {}).reduce(
  //     (total, saving) => total + saving,
  //     0
  //   );

  const filteredLoans =
    savings[selectedCenter]?.filter(
      (saving) => saving.ActiveStatus === (deleteMode ? "False" : "True")
    ) || [];

  const totalAmount = filteredLoans.reduce(
    (total, saving) => total + (saving.SavingAmount || 0),
    0
  );

  const handleViewFroCenter = (savingItem) => {
    navigate("/home/SavingView", {
      state: { SavingID: savingItem.SavingID, from: "SavingDetails" },
    });
  };

  const handleEditForCenter = (savingItem) => {
    navigate("/home/SavingEdit", {
      state: { SavingID: savingItem.SavingID, from: "SavingDetails" },
    });
  };
  const handleSavingAllDates = (savingItem) => {
    navigate("/home/SavingAllDates", {
      state: { SavingID: savingItem.SavingID },
    });
  };

  const handleDeleteClick = (center) => {
    if (window.confirm("Delete the selected Center")) {
      const deleteDate = new Date().toISOString(); // Get the current date

      axios
        .put(
          `http://localhost:5000/memberdmission/ActiveStatus/${center._id}`,
          {
            username, // Pass username to the backend
            deleteDate, // Pass the current date to the backend
          }
        )
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          // After updating, refetch the centers for the selected branch
          handleCenterChange({ target: { value: selectedCenter } });
        })
        .catch((error) => {
          console.error("Error updating ActiveStatus:", error);
        });
    }
  };

  // Toggle button function remains the same
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
    // Refetch the centers based on the new delete mode
    handleCenterChange({ target: { value: selectedCenter } });
  };
  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(members.length / membersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">কেন্দ্রের সঞ্চয় তালিকা </h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="CenterSelect" className="form-label">
            কেন্দ্র নির্বাচন করুণ
          </label>
          <select
            className="form-select"
            id="CenterSelect"
            onChange={handleCenterChange}
            value={selectedCenter}
          >
            <option value="">Choose...</option>
            {hasAccess || !restrictedDesignations.includes(designation)
              ? centers.map((center) => (
                  <option key={center._id} value={center.centerID}>
                    {center.centerID}
                  </option>
                ))
              : centers
                  .filter((center) => userCenters.includes(center.centerID))
                  .map((center) => (
                    <option key={center._id} value={center.centerID}>
                      {center.centerID}
                    </option>
                  ))}
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="CenterWorker" className="form-label">
            কেন্দ্র কর্মীর নাম
          </label>
          <input
            type="text"
            className="form-control"
            id="CenterWorker"
            value={selectedWorker}
            readOnly
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="CenterDay" className="form-label">
            কেন্দ্র বার
          </label>
          <input
            type="text"
            className="form-control"
            id="CenterDay"
            value={centerDay}
            readOnly
          />
        </div>
        <div className="col-md-3 mb-3  justify-content-end  mt-3">
          <label className="form-label">Show Deleted Member</label>
          <button
            type="button"
            className={`btn btn-lg btn-toggle ${deleteMode ? "active" : ""}`}
            onClick={handleToggleClick}
            aria-pressed={deleteMode}
          >
            <div className="handle"></div>
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {selectedCenter && currentMembers.length > 0 && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>সদস্য ID</th>
                <th>মোবাইল</th>
                <th>সঞ্চয়ের ধরণ</th>
                <th>সঞ্চয়ের সময়</th>
                <th>সঞ্চয়ের পরিমাণ</th>
                <th>মোট সঞ্চয়</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((savingItem) => (
                <tr key={savingItem.SavingID}>
                  <td>{savingItem.SavingID}</td>
                  <td>{savingItem.SavingName}</td>
                  <td>{savingItem.memberID}</td>
                  <td>{savingItem.SavingMobile}</td>
                  <td>{savingItem.SavingType}</td>
                  <td>{savingItem.SavingTime}</td>
                  <td>{savingItem.SavingAmount}</td>
                  <td>
                    {totalSavings[selectedCenter]?.[savingItem.SavingID] || 0}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleViewFroCenter(savingItem)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>

                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEditForCenter(savingItem)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleSavingAllDates(savingItem)}
                    >
                      Date
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(savingItem)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4">
          <p>মোট ঋণ সংখ্যা: {filteredLoans.length} টি</p>
          <p>মোট ঋণের পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
      {selectedCenter && (
        <div className="row">
          <div className="col-md-12">
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="page-link"
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => paginate(i + 1)}
                      className="page-link"
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="page-link"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavingDetails;
