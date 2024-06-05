// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const InstallmentList = () => {
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centerMember, setCenterMember] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
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
        })
        .catch((error) => {
          console.error("Error fetching center data:", error);
        });
    } else {
      setCenterMember([]);
    }
  }, [selectedCenter, selectedDate]);

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setSelectedCenter(e.target.value);
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

  const exportToExcel = () => {
    const data = centerMember.map((center) => ({
      কেন্দ্র: selectedCenter,
      "কেন্দ্র বার": centerDay,
      "কেন্দ্র কর্মীর নাম": selectedWorker,
      তারিখ: moment(selectedDate).format("DD-MM-YY"),
      "Loan ID": center.loanID,
      "সদস্য ID": center.memberID,
      "সদস্য নাম": center.OLname,
      "পিতা/স্বামীর নাম": center.fathername,
      মোবাইল: center.OLmobile,
      "ঋণের ধরণ": center.loanType,
      "কিস্তির পরিমাণ": center.installment,
      // Add more fields if needed
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Installments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "Installments.xlsx");
  };

  return (
    <div className="bg-light container-fluid">
      <form>
        <div className="mb-3">
          <div className="row mb-5">
            <h2 className="text-center mb-4 pt-4">কিস্তির তালিকা</h2>
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
                    <th>Loan ID</th>
                    <th>সদস্য ID</th>
                    <th>সদস্য নাম</th>
                    <th>পিতা/স্বামীর নাম</th>
                    <th>মোবাইল</th>
                    <th>কেন্দ্র </th>
                    <th>ঋণের ধরণ</th>
                    <th>কিস্তির পরিমাণ </th>
                    {/* Add more table headings if needed */}
                  </tr>
                </thead>
                <tbody>
                  {centerMember.map((center, index) => (
                    <tr key={index}>
                      <td>{center.loanID}</td>
                      <td>{center.memberID}</td>
                      <td>{center.OLname}</td>
                      <td>{center.fathername}</td>
                      <td>{center.OLmobile}</td>
                      <td>{center.OLcenter}</td>
                      <td>{center.loanType}</td>
                      <td>{center.installment}</td>
                      {/* Add more table cells for other data if needed */}
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
          ) : selectedCenter && selectedDate ? (
            <p> কেন্দ্র এবং তারিখ অনুযায়ী কোন কিস্তি নেই </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default InstallmentList;
