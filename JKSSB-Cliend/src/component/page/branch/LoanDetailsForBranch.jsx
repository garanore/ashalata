// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoanDetailsForBranch() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loans, setLoans] = useState({});
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);

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

  const handleBranchChange = async (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    try {
      const response = await axios.get(
        `https://ashalota.gandhipoka.com/loan-callback-by-branch/${encodeURIComponent(
          branch
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
        [branch]: loansWithInstallmentCount,
      }));
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  const totalAmount =
    selectedBranch &&
    loans[selectedBranch]?.reduce(
      (total, loan) => total + (loan.OLamount || 0),
      0
    );

  const handleView = (loanItem) => {
    navigate("/home/LoanView", { state: { loanID: loanItem.loanID } });
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
        <h2 className="text-center mb-4 pt-4">শাখার ঋণের তালিকা </h2>
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
                <th>ঋণের ধরণ</th>
                <th>ঋণের পরিমাণ</th>
                <th>মোট কিস্তি</th>
                <th>কিস্তি জমা</th>
                <th>কিস্তি বাকি</th>
                <th>কেন্দ্র</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {loans[selectedBranch]?.map((loanItem) => (
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
                  <td>{loanItem.OLcenter}</td>
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
          <p>মোট ঋণ সংখ্যা: {loans[selectedBranch]?.length || 0} টি</p>
          <p>মোট ঋণের পরিমাণ: {totalAmount} টাকা</p>
        </div>
      </div>
    </div>
  );
}

export default LoanDetailsForBranch;
