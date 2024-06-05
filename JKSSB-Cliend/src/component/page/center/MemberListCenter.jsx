// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MemberListCenter() {
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [members, setMembers] = useState({});
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();

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

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setSelectedCenter(center);

    if (center) {
      axios
        .get(
          `https://ashalota.gandhipoka.com/member-callback?selectedCenter=${encodeURIComponent(
            center
          )}`
        )
        .then((response) => {
          setMembers({ ...members, [center]: response.data });
        })
        .catch((error) => {
          console.error("Error fetching member data:", error);
        });

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
        <h2 className="text-center mb-4 pt-4">কেন্দ্রের সদস্য তালিকা</h2>
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
          <label className="form-label">মোট সদস্য</label>
          <input
            type="text"
            className="form-control"
            value={members[selectedCenter]?.length || 0}
            readOnly
          />
        </div>
      </div>

      <div className="table-responsive">
        {selectedCenter && members[selectedCenter] && (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>নাম</th>
                <th>পিতা/স্বামী</th>
                <th>মোবাইল</th>
                <th>ঠিকানা</th>

                <th>পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody>
              {members[selectedCenter].map((member) => (
                <tr key={member.memberID}>
                  <td>{member.memberID}</td>
                  <td>{member.memberName}</td>
                  <td>{member.MfhName}</td>
                  <td>{member.MemberMobile}</td>
                  <td>{member.memberVillage}</td>

                  <td>
                    <button
                      type="button"
                      className="ms-3 btn btn-primary btn-sm"
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

export default MemberListCenter;
