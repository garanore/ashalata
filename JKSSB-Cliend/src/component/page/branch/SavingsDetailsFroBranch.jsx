// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SavingsDetailsForBranch() {
  const [selectedBranch, setSelectedBranch] = useState("");

  const [savings, setSavings] = useState({});
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const [totalSavings, setTotalSavings] = useState({});

  useEffect(() => {
    axios
      .get("https://ashalota.gandhipoka.com/branch-callback")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch data:", error);
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
        return 0;
      } else {
        console.error("Error fetching total saving data:", error);
        return 0;
      }
    }
  };

  const handleBranchChange = async (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/saving-callback-by-branch/${encodeURIComponent(
          branch
        )}`
      );

      const savingsData = response.data;
      const totalSavingsData = {};
      for (const savingItem of savingsData) {
        const totalSaving = await fetchTotalSaving(savingItem.SavingID);
        totalSavingsData[savingItem.SavingID] = totalSaving;
      }

      setSavings((prevSavings) => ({
        ...prevSavings,
        [branch]: savingsData,
      }));
      setTotalSavings((prevTotalSavings) => ({
        ...prevTotalSavings,
        [branch]: totalSavingsData,
      }));
    } catch (error) {
      console.error("Error fetching savings data:", error);
    }
  };

  const totalAmount =
    selectedBranch &&
    Object.values(totalSavings[selectedBranch] || {}).reduce(
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
        <h2 className="text-center mb-4 pt-4">শাখার সঞ্চয় তালিকা </h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="branchSelect" className="form-label">
            শাঁখা নির্বাচন করুণ
          </label>
          <select
            className="form-select"
            id="branchSelect"
            onChange={handleBranchChange}
            value={selectedBranch}
          >
            <option value="">Choose...</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch.BranchName}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        {selectedBranch && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>সদস্য ID</th>
                <th>মোবাইল</th>
                <th>কেন্দ্র</th>
                <th>সঞ্চয়ের ধরণ</th>
                <th>সঞ্চয়ের সময়</th>
                <th>সঞ্চয়ের পরিমাণ</th>
                <th>মোট সঞ্চয়</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {savings[selectedBranch]?.map((savingItem) => (
                <tr key={savingItem.SavingID}>
                  <td>{savingItem.SavingID}</td>
                  <td>{savingItem.SavingName}</td>
                  <td>{savingItem.memberID}</td>
                  <td>{savingItem.SavingMobile}</td>
                  <td>{savingItem.SavingCenter}</td>
                  <td>{savingItem.SavingType}</td>
                  <td>{savingItem.SavingTime}</td>
                  <td>{savingItem.SavingAmount}</td>
                  <td>
                    {totalSavings[selectedBranch]?.[savingItem.SavingID] || 0}
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
          <p>মোট সঞ্চয় সংখ্যা: {savings[selectedBranch]?.length || 0} টি</p>
          <p>মোট সঞ্চয় পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
    </div>
  );
}

export default SavingsDetailsForBranch;
