// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const restrictedDesignations = [
  "উর্দ্ধতন কর্মসূচী সংগঠক",
  "কর্মসূচী সংগঠক",
  "সহকারী কর্মসূচী সংগঠক",
];

const InstallmentCollection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [fields, setFields] = useState({ installmentCollecting: {} });
  const [centerDay, setCenterDay] = useState("");
  const [centerBranch, setcenterBranch] = useState("");
  const [userCenters, setuserCenters] = useState([]);

  const [hasAccess, setHasAccess] = useState(false); // Initially, set access to false
  const [designation, setDesignation] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);

  const [username, setUsername] = useState("Unknown");

  const [calculatedOnlyInterest, setCalculatedOnlyInterest] = useState({});

  useEffect(() => {
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

    // Retrieve user branch data from localStorage
    const storedUserBranchData = localStorage.getItem("userBranchData");
    if (storedUserBranchData) {
      const parsedData = JSON.parse(storedUserBranchData);

      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);

      const centers = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserCenter"))
        .map((key) => parsedData[key]);

      const userDesignation = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key])[0];

      // Get username from localStorage data
      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const storedUsername = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(storedUsername); // Store the username in the state

      setDesignation(userDesignation); // Set the designation in the state

      if (branches.includes("AllBranch")) {
        setHasAccess(true); // Grant full access
      } else if (restrictedDesignations.includes(userDesignation)) {
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

  useEffect(() => {
    // Fetch center day when selectedCenter changes
    if (selectedCenter) {
      axios
        .get(`http://localhost:5000/center-callback-id/${selectedCenter}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCenterDay(response.data[0].CenterDay); // Assuming CenterDay is available in the first item of the response array
            setcenterBranch(response.data[0].centerBranch); // Assuming CenterDay is available in the first item of the response array
          } else {
            setCenterDay(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
            setcenterBranch(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
          }
        })
        .catch((error) => {
          console.error("Error fetching center details:", error);
        });
    } else {
      setCenterDay(""); // Clear centerDay if no center is selected
      setcenterBranch(""); // Clear centerDay if no center is selected
    }
  }, [selectedCenter]);

  useEffect(() => {
    // Fetch data based on selected center and date
    if (selectedCenter && selectedDate) {
      const searchDate = moment(selectedDate).format("DD-MM-YY"); // Format selectedDate as "DD-MM-YY"
      axios
        .get(`http://localhost:5000/get-installmentDate/${selectedCenter}`)
        .then((response) => {
          const filteredData = response.data.filter(
            (item) =>
              item.nextDates.includes(searchDate) &&
              item.ActiveStatus === (deleteMode ? "False" : "True")
          );
          setCenterMember(filteredData);
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    } else {
      setCenterMember([]);
    }
  }, [selectedCenter, selectedDate, deleteMode]);

  const handleCenterChange = (e) => {
    setSelectedCenter(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (field, id, value) => {
    setFields({
      ...fields,
      [field]: { ...fields[field], [id]: value },
    });
  };

  const handleBlur = (field, id) => {
    const member = centerMember.find((member) => member.loanID === id);
    if (member) {
      const installment = parseFloat(member.installment); // Convert to number
      const inputValue = parseFloat(fields[field][id]); // Convert input value to number

      // Ensure both values are valid numbers
      if (!isNaN(inputValue) && !isNaN(installment)) {
        // Check if the input value is a multiple of the installment amount
        if (inputValue % installment !== 0) {
          setSubmitMessage(
            `Input value must be a multiple of ${installment} for loanID ${id}`
          );
        } else {
          setSubmitMessage(""); // Clear error message if input is valid
        }
      } else {
        setSubmitMessage("Please enter a valid number");
      }
    }
  };

  const handleInstallmentChange = (
    loanID,
    value,
    installment,
    onlyInterest
  ) => {
    const inputValue = parseFloat(value);
    const installmentValue = parseFloat(installment);

    if (
      !isNaN(inputValue) &&
      !isNaN(installmentValue) &&
      installmentValue > 0
    ) {
      // Calculate how many times the installment is entered
      const multiplier = Math.floor(inputValue / installmentValue);

      // Calculate the new onlyInterest value based on the multiplier
      const newOnlyInterest = multiplier * onlyInterest;

      // Store the calculated onlyInterest in state
      setCalculatedOnlyInterest((prevState) => ({
        ...prevState,
        [loanID]: newOnlyInterest,
      }));

      // Continue with the normal handleChange logic
      handleChange("installmentCollecting", loanID, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyEntries = [];

    const validData = centerMember.map((member) => {
      const installmentCollectingValue =
        fields.installmentCollecting[member.loanID];
      const installmentCountValue = fields.installmentCount?.[member.loanID];

      if (!installmentCollectingValue || !installmentCountValue) {
        emptyEntries.push(member);
      }

      return {
        ...member,
        InstallmentCollecting: installmentCollectingValue || 0, // Default to 0 if empty
        InstallmentCount: installmentCountValue || 0,
      };
    });

    if (emptyEntries.length > 0) {
      const confirmation = window.confirm(
        "Some input fields are empty. Do you want to save the non-empty data?"
      );
      if (!confirmation) {
        return; // Stop form submission if not confirmed
      }
    }

    const dataWithInstallments = validData.filter(
      (member) =>
        member.InstallmentCollecting !== "" &&
        member.InstallmentCollecting !== 0 &&
        member.InstallmentCount !== "" &&
        member.InstallmentCount !== 0
    );

    // Prepare data to send to the backend
    const requestData = {
      centerName: selectedCenter,
      installmentDate: moment(selectedDate).format("DD-MM-YY"),
      centerBranch: centerBranch, // Include the centerBranch information
      submittedBy: [username], // Send submittedBy as an array
      data: dataWithInstallments.map((member) => ({
        loanID: member.loanID,
        memberID: member.memberID,
        OLname: member.OLname,
        OLmobile: member.OLmobile,
        loanType: member.loanType,
        onlyInterest: member.onlyInterest,
        installment: [member.InstallmentCollecting], // Send installment as an array
        installmentCount: [member.InstallmentCount],
      })),
    };

    // Send data to backend
    axios
      .post("http://localhost:5000/save-installments-collection", requestData)
      .then(() => {
        setSubmitMessage("Data saved successfully!");

        // Clear inputs
        setFields({ installmentCollecting: {} });
        setSelectedDate(null);
        setSelectedCenter("");
        setCenterMember([]);
      })
      .catch((error) => {
        setSubmitMessage(`Error: ${error.message}`);
        console.error("Error saving data:", error.message);
      });
  };

  // Toggle button function
  const handleToggleClick = () => {
    setDeleteMode(!deleteMode);
  };

  return (
    <div className="bg-light container-fluid">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">কিস্তি গ্রহণ</h2>
          </div>

          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="CenterName" className="form-label">
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
            <div className="col-md-3 mb-3">
              <label htmlFor="centerBranch" className="form-label">
                শাখা
              </label>
              <input
                type="text"
                className="form-control"
                id="centerBranch"
                value={centerBranch}
                readOnly
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="InstallmentDate" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="InstallmentDate"
                  className="form-control"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col-md-3 mb-3  justify-content-end  mt-3">
              <label className="form-label">Show Deleted Installment</label>
              <button
                type="button"
                className={`btn btn-lg btn-toggle ${
                  deleteMode ? "active" : ""
                }`}
                onClick={handleToggleClick}
                aria-pressed={deleteMode}
              >
                <div className="handle"></div>
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          {centerMember.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>মোবাইল</th>
                  <th>ঋণের ধরণ</th>
                  <th>কিস্তির পরিমাণ </th>
                  <th>কিস্তি জমা </th>
                  <th>কিস্তি সংখ্যা </th>
                  {/* Add more table headings if needed */}
                </tr>
              </thead>
              <tbody>
                {centerMember.map((center, index) => (
                  <tr key={index}>
                    <td>{center.loanID}</td>
                    <td>{center.memberID}</td>
                    <td>{center.OLname}</td>
                    <td>{center.OLmobile}</td>
                    <td>{center.loanType}</td>
                    <td>{center.installment}</td>
                    {/* Wrap hidden input in a <td> */}
                    <td style={{ display: "none" }}>
                      <input
                        type="hidden"
                        value={
                          calculatedOnlyInterest[center.loanID] ||
                          center.onlyInterest
                        }
                        name={`onlyInterest-${center.loanID}`}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={
                          fields.installmentCollecting[center.loanID] || ""
                        }
                        placeholder="কিস্তি"
                        onChange={(e) =>
                          handleInstallmentChange(
                            center.loanID,
                            e.target.value,
                            center.installment,
                            center.onlyInterest
                          )
                        }
                        onBlur={() =>
                          handleBlur("installmentCollecting", center.loanID)
                        }
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="সংখ্যা"
                        value={fields.installmentCount?.[center.loanID] || ""} // Installment count value
                        onChange={(e) =>
                          handleChange(
                            "installmentCount",
                            center.loanID,
                            e.target.value
                          )
                        } // Update installment count
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedCenter && selectedDate ? (
            <p> কেন্দ্র এবং তারিখ অনুযায়ী কোন কিস্তি নেই </p>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {submitMessage && (
          <div
            className={`alert ${
              submitMessage.includes("Error") ? "alert-danger" : "alert-success"
            } mt-3`}
            role="alert"
          >
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default InstallmentCollection;
