// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllMemberList() {
  const [MemberData, setMemberData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ashalota.gandhipoka.com/member-callback"
        );
        setMemberData(response.data);
      } catch (error) {
        console.error("Error fetching branch data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleView = (member) => {
    navigate("/home/MemberAbout", { state: { memberID: member._id } });
  };

  const handleEdit = (member) => {
    navigate("/home/MemberEdit", { state: { memberID: member._id } });
  };

  return (
    <div>
      <div className="bg-light container-fluid">
        <div className="mt-2 ">
          <h2 className="text-center mb-4 pt-3">সকল সদস্য তালিকা </h2>
        </div>

        <div className="mt-5 bg-light">
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>কেন্দ্র</th>
                <th>মোবাইল</th>
                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {MemberData.map((Member) => (
                <tr key={Member._id}>
                  <td>{Member.memberID}</td>
                  <td>{Member.memberName}</td>
                  <td>{Member.CenterIDMember}</td>
                  <td>{Member.MemberMobile}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleView(Member)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
                      onClick={() => handleEdit(Member)}
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

export default AllMemberList;
