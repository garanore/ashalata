// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SavingTypeTranslations = {
  General: "সাধারণ",
  Meyadi: "মেয়াদি",
  NonMeyadi: "এককালিন",
};

const SavingList = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [SavingType, setSavingType] = useState("");
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
    setCenterMember([]);
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
        if (SavingType && selectedCenter) {
          const translatedSavingType = SavingTypeTranslations[SavingType];
          const endpoint =
            SavingType === "General"
              ? `https://ashalota.gandhipoka.com/savingtype-callback/${translatedSavingType}`
              : `https://ashalota.gandhipoka.com/saving-callback-center/${selectedCenter}`;

          const response = await axios.get(endpoint);

          let filteredData = [];
          if (SavingType === "General") {
            filteredData = response.data.filter(
              (item) => item.SavingCenter === selectedCenter
            );
          } else if (selectedDate) {
            const searchDate = moment(selectedDate).format("DD-MM-YY");
            filteredData = response.data.filter((item) =>
              item.nextDates.includes(searchDate)
            );
          }

          setCenterMember(filteredData);
        } else {
          setCenterMember([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [SavingType, selectedCenter, selectedDate]);

  const exportToExcel = () => {
    const data = centerMember.map((center) => ({
      কেন্দ্র: selectedCenter,
      "কেন্দ্র বার": centerDay,
      "কেন্দ্র কর্মীর নাম": selectedWorker,
      তারিখ: selectedDate ? moment(selectedDate).format("DD-MM-YY") : "",
      "Saving ID": center.SavingID,
      "সদস্য ID": center.memberID,
      "সদস্য নাম": center.SavingName,
      "পিতা/স্বামীর নাম": center.fathername,
      মোবাইল: center.SavingMobile,
      "সঞ্চয়ের ধরণ": center.SavingType,
      "সঞ্চয়ের সময়": center.SavingTime,
      "সঞ্চয়ের পরিমাণ": center.SavingAmount,
      // Add more fields if needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Savings");

    // Apply styles to the header row
    const headerRow = [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
    ];
    headerRow.forEach((cell) => {
      worksheet[cell].s = {
        font: {
          bold: true,
          sz: 16,
        },
      };
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Savings.xlsx");
  };

  return (
    <div className="bg-light container-fluid">
      <form>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">সঞ্চয়ের তালিকা</h2>
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
                value={SavingType}
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
                {centers.map((center) => (
                  <option key={center._id} value={center.centerID}>
                    {center.centerID}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="date" className="form-label">
                তারিখ নির্বাচন করুণ
              </label>
              <div>
                <DatePicker
                  id="date"
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
          {centerMember.length > 0 ? (
            <>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Saving ID</th>
                    <th>সদস্য ID</th>
                    <th>সদস্য নাম</th>
                    <th>পিতা/স্বামীর নাম</th>
                    <th>মোবাইল</th>
                    <th>কেন্দ্র</th>
                    <th>সঞ্চয়ের ধরণ</th>
                    <th>সঞ্চয়ের সময়</th>
                    <th>সঞ্চয়ের পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  {centerMember.map((center, index) => (
                    <tr key={index}>
                      <td>{center.SavingID}</td>
                      <td>{center.memberID}</td>
                      <td>{center.SavingName}</td>
                      <td>{center.fathername}</td>
                      <td>{center.SavingMobile}</td>
                      <td>{center.SavingCenter}</td>
                      <td>{center.SavingType}</td>
                      <td>{center.SavingTime}</td>
                      <td>{center.SavingAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-success mt-3"
                  onClick={exportToExcel}
                >
                  Download as Excel
                </button>
              </div>
            </>
          ) : selectedCenter && (SavingType === "General" || selectedDate) ? (
            <p>
              {" "}
              কেন্দ্র এবং {SavingType === "General" ? "সাধারণ" : "তারিখ"}{" "}
              অনুযায়ী কোন সঞ্চয় নেই{" "}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SavingList;
