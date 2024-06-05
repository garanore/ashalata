// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";

const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

const SavingCollection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMembers, setCenterMembers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [savingType, setSavingType] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [fields, setFields] = useState({ savingCollecting: {} });
  const [centerDay, setCenterDay] = useState("");

  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/center-callback")
      .then((response) => {
        setCenters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching center data:", error);
      });
  }, []);

  const handleSavingTypeChange = (e) => {
    setSavingType(e.target.value);
    setSelectedDate(null);
    setCenterMembers([]);
  };

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setSelectedCenter(center);
    axios
      .get(`https://ashalota.gandhipoka.com/center-callback-id/${center}`)
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
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (savingType && selectedCenter) {
          const translatedSavingType = SavingTypeTranslations[savingType];
          const endpoint =
            savingType === "General"
              ? `https://ashalota.gandhipoka.com/savingtype-callback/${translatedSavingType}`
              : `https://ashalota.gandhipoka.com/saving-callback-center/${selectedCenter}`;

          const response = await axios.get(endpoint);

          let filteredData = [];
          if (savingType === "General") {
            filteredData = response.data.filter(
              (item) => item.SavingCenter === selectedCenter
            );
          } else if (selectedDate) {
            const searchDate = moment(selectedDate).format("DD-MM-YY");
            filteredData = response.data.filter((item) =>
              item.nextDates.includes(searchDate)
            );
          }

          setCenterMembers(filteredData);

          const initialSavingInputs = {};
          filteredData.forEach((member) => {
            initialSavingInputs[member.SavingID] = "";
          });
          setFields({ savingCollecting: initialSavingInputs });
        } else {
          setCenterMembers([]);
          setFields({ savingCollecting: {} });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [savingType, selectedCenter, selectedDate]);

  const handleChange = (field, id, value) => {
    setFields({
      ...fields,
      [field]: { ...fields[field], [id]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidEntries = [];
    const emptyEntries = [];
    const validData = centerMembers.map((member) => {
      const savingCollectingValue = fields.savingCollecting[member.SavingID];
      if (!savingCollectingValue) {
        emptyEntries.push(member);
      } else if (
        savingType !== "General" &&
        parseFloat(savingCollectingValue) !== parseFloat(member.SavingAmount)
      ) {
        invalidEntries.push(
          `সঞ্চয় জমা must match the saving amount for ${member.SavingID}`
        );
      }
      return { ...member, SavingCollecting: savingCollectingValue || 0 };
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

    const dataWithSavings = validData.filter(
      (member) =>
        member.SavingCollecting !== "" && member.SavingCollecting !== 0
    );

    axios
      .post("https://ashalota.gandhipoka.com/save-savings-collection", {
        centerName: selectedCenter,
        savingDate: moment(selectedDate).format("DD-MM-YY"),
        centerWorker: selectedWorker,
        data: dataWithSavings,
      })
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        setSubmitMessage("Data saved successfully!");
        setFields({ savingCollecting: {} });
        setSelectedDate(null);
        setSelectedCenter("");
        setCenterMembers([]);
      })
      .catch((error) => {
        setSubmitMessage(`Error: ${error.message}`);
        console.error("Error saving data:", error.message);
      });
  };

  return (
    <div className="bg-light container-fluid">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">সঞ্চয় গ্রহণ</h2>
          </div>
          <div className="row">
            <div className="mb-3 col-3">
              <label htmlFor="SavingType" className="form-label">
                সঞ্চয়ের ধরণ
              </label>
              <select
                id="SavingType"
                className="form-select"
                onChange={handleSavingTypeChange}
                value={savingType}
              >
                <option value="">বাছাই করুণ</option>
                {Object.entries(SavingTypeTranslations).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
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
              <label htmlFor="SavingCollectionDate" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="SavingCollectionDate"
                  className="form-control"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
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
          </div>
        </div>
        <div className="table-responsive">
          {centerMembers.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Saving ID</th>
                  <th>সদস্য ID</th>
                  <th>সদস্য নাম</th>
                  <th>মোবাইল</th>
                  <th>সঞ্চয়ের ধরণ</th>
                  <th>সঞ্চয়ের সময়</th>
                  <th>সঞ্চয়ের পরিমাণ</th>
                  <th>সঞ্চয় জমা</th>
                </tr>
              </thead>
              <tbody>
                {centerMembers.map((center, index) => (
                  <tr key={index}>
                    <td>{center.SavingID}</td>
                    <td>{center.memberID}</td>
                    <td>{center.SavingName}</td>
                    <td>{center.SavingMobile}</td>
                    <td>{center.SavingType}</td>
                    <td>{center.SavingTime}</td>
                    <td>{center.SavingAmount}</td>
                    <td>
                      <input
                        type="number"
                        value={fields.savingCollecting[center.SavingID] || ""}
                        placeholder="সঞ্চয়"
                        onChange={(e) =>
                          handleChange(
                            "savingCollecting",
                            center.SavingID,
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedCenter && (savingType === "General" || selectedDate) ? (
            <p>
              {" "}
              কেন্দ্র এবং {savingType === "General" ? "সাধারণ" : "তারিখ"}{" "}
              অনুযায়ী কোন সঞ্চয় নেই{" "}
            </p>
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

export default SavingCollection;
