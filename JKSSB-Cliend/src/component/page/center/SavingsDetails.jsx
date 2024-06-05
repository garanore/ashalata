// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SavingDetails() {
  const [selectedCenter, setSelectedCenter] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [selectedMember, setSelectedMember] = useState(null);
  const [savings, setSavings] = useState({});
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState("");
  const [totalSavings, setTotalSavings] = useState({});

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

  const fetchTotalSaving = async (savingID) => {
    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/saving-collection-total/${savingID}`
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
        `https://ashalota.gandhipoka.com/saving-callback?center=${encodeURIComponent(
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

      // Fetch worker data for the selected center
      axios
        .get(`https://ashalota.gandhipoka.com/center-callback-id/${center}`)
        .then((response) => {
          const workerData = response.data;
          setSelectedWorker(
            workerData.length > 0 ? workerData[0].centerWorker : ""
          );
        })
        .catch((error) => {
          console.error("Error fetching center worker data:", error);
        });
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  // Calculate the total amount of all total savings for the selected center
  const totalAmount =
    selectedCenter &&
    Object.values(totalSavings[selectedCenter] || {}).reduce(
      (total, saving) => total + saving,
      0
    );

  const handleView = (savingItem) => {
    navigate("/home/SavingView", { state: { SavingID: savingItem.SavingID } });
  };

  const handleEdit = (savingItem) => {
    navigate("/home/SavingEdit", { state: { SavingID: savingItem.SavingID } });
  };
  const handleSavingAllDates = (savingItem) => {
    navigate("/home/SavingAllDates", {
      state: { SavingID: savingItem.SavingID },
    });
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
                <th>সঞ্চয়ের ধরণ</th>
                <th>সঞ্চয়ের সময়</th>
                <th>সঞ্চয়ের পরিমাণ</th>
                <th>মোট সঞ্চয়</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {savings[selectedCenter]?.map((savingItem) => (
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
                      onClick={() => handleView(savingItem)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEdit(savingItem)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleSavingAllDates(savingItem)}
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
          <p>মোট সঞ্চয় সংখ্যা: {savings[selectedCenter]?.length || 0} টি</p>
          <p>মোট সঞ্চয় পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
    </div>
  );
}

export default SavingDetails;
