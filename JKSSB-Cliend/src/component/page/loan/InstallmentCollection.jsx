// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const InstallmentCollection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [fields, setFields] = useState({ installmentCollecting: {} });
  const [centerDay, setCenterDay] = useState("");

  useEffect(() => {
    // Fetch centers
    axios
      .get("https://ashalota.gandhipoka.com/center-callback")
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch center day when selectedCenter changes
    if (selectedCenter) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/center-callback-id/${selectedCenter}`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setCenterDay(response.data[0].CenterDay); // Assuming CenterDay is available in the first item of the response array
          } else {
            setCenterDay(""); // If CenterDay is not available for the center, set it to an empty string or handle accordingly
          }
        })
        .catch((error) => {
          console.error("Error fetching center details:", error);
        });
    } else {
      setCenterDay(""); // Clear centerDay if no center is selected
    }
  }, [selectedCenter]);

  useEffect(() => {
    // Fetch data based on selected center and date
    if (selectedCenter && selectedDate) {
      const searchDate = moment(selectedDate).format("DD-MM-YY"); // Format selectedDate as "DD-MM-YY"
      axios
        .get(
          `https://ashalota.gandhipoka.com/get-installmentDate/${selectedCenter}`
        )
        .then((response) => {
          const filteredData = response.data.filter((item) =>
            item.nextDates.includes(searchDate)
          );
          setCenterMember(filteredData);

          // Initialize installment inputs state for each member
          const initialInstallmentInputs = {};
          filteredData.forEach((member) => {
            initialInstallmentInputs[member.loanID] = "";
          });
          setFields({ installmentCollecting: initialInstallmentInputs });
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    } else {
      setCenterMember([]);
      setFields({ installmentCollecting: {} });
    }
  }, [selectedCenter, selectedDate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    const invalidEntries = [];
    const emptyEntries = [];
    const validData = centerMember.map((member) => {
      const installmentCollectingValue =
        fields.installmentCollecting[member.loanID];
      if (!installmentCollectingValue) {
        emptyEntries.push(member);
      } else if (
        parseFloat(installmentCollectingValue) !==
        parseFloat(member.installment)
      ) {
        invalidEntries.push(
          `কিস্তি জমা must match the installment amount for ${member.loanID}`
        );
      }
      return {
        ...member,
        InstallmentCollecting: installmentCollectingValue || 0,
      };
    });

    if (invalidEntries.length > 0) {
      setSubmitMessage(invalidEntries.join(", "));
      return;
    }

    if (emptyEntries.length > 0) {
      const confirmation = window.confirm(
        "Some input fields are empty. Do you want to save the non-empty data?"
      );
      if (!confirmation) {
        return;
      }
    }

    // Filter out empty fields
    const dataWithInstallments = validData.filter(
      (member) =>
        member.InstallmentCollecting !== "" &&
        member.InstallmentCollecting !== 0
    );

    // Send data to backend
    axios
      .post("https://ashalota.gandhipoka.com/save-installments-collection", {
        centerName: selectedCenter,
        installmentDate: moment(selectedDate).format("DD-MM-YY"),
        data: dataWithInstallments,
      })
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
        console.error("Error saving dates:", error.message);
      });
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
                id="CenterName"
                onChange={handleCenterChange}
                value={selectedCenter}
              >
                <option value="">Choose...</option>
                {centers.map((center) => (
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
                    <td>
                      <input
                        type="number"
                        value={
                          fields.installmentCollecting[center.loanID] || ""
                        }
                        placeholder="কিস্তি"
                        onChange={(e) =>
                          handleChange(
                            "installmentCollecting",
                            center.loanID,
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </td>
                    {/* Add more table cells for other data if needed */}
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
