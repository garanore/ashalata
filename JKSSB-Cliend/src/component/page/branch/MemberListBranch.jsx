// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MemberListBranch() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

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

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);

    if (branch) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/member-callback-by-branch/${encodeURIComponent(
            branch
          )}`
        )
        .then((response) => {
          setMembers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching member data:", error);
        });
    } else {
      setMembers([]);
    }
  };

  const handleEdit = (member) => {
    navigate("/home/MemberEdit", { state: { memberID: member._id } });
  };

  const handleView = (member) => {
    navigate("/home/MemberAbout", { state: { memberID: member._id } });
  };

  return (
    <div className="bg-light container-fluid">
      <div className="row mb-5">
        <h2 className="text-center mb-4 pt-4">শাখার সদস্য তালিকা</h2>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="branchSelect" className="form-label">
            শাখা নির্বাচন করুণ
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

        <div className="col-md-3 mb-3">
          <label className="form-label">মোট সদস্য</label>
          <input
            type="text"
            className="form-control"
            value={members.length || 0}
            readOnly
          />
        </div>
      </div>

      <div className="table-responsive">
        {selectedBranch && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>পিতা/স্বামী</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>
                <th>কেন্দ্র</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.memberID}>
                  <td>{member.memberID}</td>
                  <td>{member.memberName}</td>
                  <td>{member.MfhName}</td>
                  <td>{member.MemberMobile}</td>
                  <td>{member.memberVillage}</td>
                  <td>{member.CenterIDMember}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleView(member)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MemberListBranch;
