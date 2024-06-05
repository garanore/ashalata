// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BranchList() {
  const [branchData, setBranchData] = useState([]);
  const [centerCounts, setCenterCounts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          "https://ashalota.gandhipoka.com/branch-callback"
        );
        const branches = response.data;

        setBranchData(branches);

        // Fetch center counts for each branch
        const fetchCenterCounts = async () => {
          const counts = {};
          for (const branch of branches) {
            try {
              const centerResponse = await axios.get(
                `https://ashalota.gandhipoka.com/center-callback-by-branch/${branch.BranchName}`
              );
              counts[branch.BranchName] = centerResponse.data.length;
            } catch (error) {
              console.error(
                `Error fetching center count for branch ${branch.BranchName}:`,
                error.message
              );
            }
          }
          setCenterCounts(counts);
        };

        fetchCenterCounts();
      } catch (error) {
        console.error("Error fetching branch data:", error.message);
      }
    };

    fetchBranchData();
  }, []);

  const handleEditClick = (branch) => {
    navigate("/home/BranchEditModal", { state: { BranchID: branch._id } });
  };

  return (
    <div>
      <div className="bg-light container-fluid">
        <div className="mt-2 ">
          <h2 className="text-center mb-4 pt-3">শাঁখার তালিকা </h2>
        </div>

        <div className="mt-5 bg-light">
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>ঠিকানা</th>
                <th>মোবাইল</th>
                <th>ম্যানেজার</th>
                <th>কেন্দ্র সংখ্যা</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {branchData.map((branch) => (
                <tr key={branch.BranchID}>
                  <td>{branch.BranchID}</td>
                  <td>{branch.BranchName}</td>
                  <td>{branch.BranchAddress}</td>
                  <td>{branch.BranchMobile}</td>
                  <td>{branch.selectedManager}</td>
                  <td>{centerCounts[branch.BranchName] || 0}</td>
                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEditClick(branch)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BranchList;
