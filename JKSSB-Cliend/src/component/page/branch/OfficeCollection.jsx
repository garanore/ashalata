/* eslint-disable no-unused-vars */
// // eslint-disable-next-line no-unused-vars

// export default OfficeCollection;
// Import necessary React components
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

// Sample data (replace it with your actual data)
const branches = ["Branch A", "Branch B", "Branch C"];
const centers = {
  "Branch A": ["Center 1A", "Center 2A", "Center 3A"],
  "Branch B": ["Center 1B", "Center 2B", "Center 3B"],
  "Branch C": ["Center 1C", "Center 2C", "Center 3C"],
};
const members = {
  "Center 1A": ["Member 1A", "Member 2A", "Member 3A"],
  "Center 2A": ["Member 1A", "Member 2A", "Member 3A"],
  "Center 3A": ["Member 1A", "Member 2A", "Member 3A"],

  "Center 1B": ["Member 2A", "Member 2B", "Member 3B"],
  "Center 2B": ["Member 1A", "Member 2A", "Member 3A"],
  "Center 3B": ["Member 1A", "Member 2A", "Member 3A"],

  "Center 1C": ["Member 2A", "Member 2B", "Member 3B"],
  "Center 2C": ["Member 1A", "Member 2A", "Member 3A"],
  "Center 3C": ["Member 1A", "Member 2A", "Member 3A"],
  // ... Add members for other centers
};

// Mock function to fetch amount from the database (replace with actual API call)
const fetchAmountFromDatabase = (selectedMember) => {
  // Replace this with actual API call to fetch amount from the database
  // For now, returning a mock amount
  return 500; // Mock amount value
};

// Main Form Component
function OfficeCollection() {
  // State variables to store selected values
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");

  // Effect to fetch amount from the database when selectedMember changes
  useEffect(() => {
    if (selectedMember) {
      // Fetch amount from the database
      const amountFromDatabase = fetchAmountFromDatabase(selectedMember);
      setAmount(amountFromDatabase.toString()); // Convert to string for read-only input
    }
  }, [selectedMember]);

  // Event handlers for change in select options and input fields
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedCenter("");
    setSelectedMember("");
    setAmount("");
    setTotal("");
  };

  const handleCenterChange = (e) => {
    setSelectedCenter(e.target.value);
    setSelectedMember("");
    setAmount("");
    setTotal("");
  };

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
    // Fetch and set amount from the database later
    // For now, you can leave this empty or set a default value
    setAmount(""); // Replace with logic to fetch amount from the database
  };

  const handleAmountChange = (e) => {
    // setAmount(e.target.value);
    // Add any logic related to amount if needed
  };

  const handleTotalChange = (e) => {
    setTotal(e.target.value);
    // Add any logic related to total if needed
  };

  const handleSubmit = () => {
    // Add logic to handle form submission
    // You can access selectedBranch, selectedCenter, selectedMember, amount, and total here
    console.log({
      selectedBranch,
      selectedCenter,
      selectedMember,
      amount,
      total,
    });
  };

  return (
    <div>
      <div>
        <div className="bg-light mt-2">
          <div className=" p-2">
            <div className=" border-bottom mb-5 ">
              <h2 className="text-center   mb-4 pt-3">অফিস জমা</h2>
            </div>
          </div>

          <div className="bg-light ">
            <form className=" p-3">
              <div className="row mb-5">
                <div className="col-4">
                  <div className="col-md-6">
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
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-4">
                  <div className="col-md-6">
                    {selectedBranch && centers[selectedBranch] && (
                      <>
                        <label htmlFor="centerSelect" className="form-label">
                          কেন্দ্র নির্বাচন করুণ
                        </label>
                        <select
                          className="form-select"
                          id="centerSelect"
                          onChange={handleCenterChange}
                          value={selectedCenter}
                        >
                          <option value="">Choose...</option>
                          {centers[selectedBranch].map((center) => (
                            <option key={center} value={center}>
                              {center}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-4">
                  <div className="col-md-6">
                    {selectedCenter && members[selectedCenter] && (
                      <>
                        <label htmlFor="memberSelect" className="form-label">
                          সদস্য নির্বাচন করুণ
                        </label>
                        <select
                          className="form-select"
                          id="memberSelect"
                          onChange={handleMemberChange}
                          value={selectedMember}
                        >
                          <option value="">Choose...</option>
                          {members[selectedCenter].map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-4">
                  <div className="">
                    {selectedMember && (
                      <>
                        <label htmlFor="amount" className="form-label">
                          কিস্তির পরিমাণ
                        </label>
                        <input
                          className="form-select"
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="টাকা"
                          readOnly
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  {selectedMember && (
                    <>
                      <label htmlFor="total" className="form-label">
                        টাকার পরিমাণ
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="total"
                        value={total}
                        onChange={handleTotalChange}
                        placeholder="জমা"
                      />
                    </>
                  )}
                </div>
              </div>

              {selectedMember && (
                <div className="col-12 mb-5 mt-5">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficeCollection;
