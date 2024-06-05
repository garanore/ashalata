// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoanDetails() {
  const [selectedCenter, setSelectedCenter] = useState("");
  const [loans, setLoans] = useState({});
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState("");
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

  const fetchInstallmentDateCount = async (loanID) => {
    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/installment-dates-count/${loanID}`
      );
      return response.data[0]?.installmentDateCount || 0;
    } catch (error) {
      console.error("Error fetching installment date count:", error);
      return 0;
    }
  };

  const handleCenterChange = async (e) => {
    const center = e.target.value;
    setSelectedCenter(center);

    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/loan-callback?center=${encodeURIComponent(
          center
        )}`
      );

      const loansWithInstallmentCount = await Promise.all(
        response.data.map(async (loan) => {
          const installmentDateCount = await fetchInstallmentDateCount(
            loan.loanID
          );
          const remainingInstallments =
            loan.totalInstallment - installmentDateCount;
          return { ...loan, installmentDateCount, remainingInstallments };
        })
      );

      setLoans((prevLoans) => ({
        ...prevLoans,
        [center]: loansWithInstallmentCount,
      }));

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
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  const totalAmount =
    selectedCenter &&
    loans[selectedCenter]?.reduce(
      (total, loan) => total + (loan.OLamount || 0),
      0
    );

  const handleView = (loanItem) => {
    navigate("/home/loanview", { state: { loanID: loanItem.loanID } });
  };

  const handleEdit = (loanItem) => {
    navigate("/home/LoanEdit", { state: { loanID: loanItem.loanID } });
  };

  const handleLoanAllDate = (loanItem) => {
    navigate("/home/LoanAllDates", { state: { loanID: loanItem.loanID } });
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">কেন্দ্রের ঋণের তালিকা </h2>
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

      <div className="table-responsive">
        {selectedCenter && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>সদস্য ID</th>
                <th>মোবাইল</th>
                <th>ঋণের ধরণ</th>
                <th>ঋণের পরিমাণ</th>
                <th>মোট কিস্তি</th>
                <th>কিস্তি জমা</th>
                <th>কিস্তি বাকি</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {loans[selectedCenter]?.map((loanItem) => (
                <tr key={loanItem.loanID}>
                  <td>{loanItem.loanID}</td>
                  <td>{loanItem.OLname}</td>
                  <td>{loanItem.memberID}</td>
                  <td>{loanItem.OLmobile}</td>
                  <td>{loanItem.loanType}</td>
                  <td>{loanItem.OLamount}</td>
                  <td>{loanItem.totalInstallment}</td>
                  <td>{loanItem.installmentDateCount}</td>
                  <td>{loanItem.remainingInstallments}</td>
                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleView(loanItem)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEdit(loanItem)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleLoanAllDate(loanItem)}
                    >
                      Date
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4">
          <p>মোট ঋণ সংখ্যা: {loans[selectedCenter]?.length || 0} টি</p>
          <p>মোট ঋণের পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
    </div>
  );
}

export default LoanDetails;
