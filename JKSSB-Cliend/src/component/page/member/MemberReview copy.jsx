// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const MemberReview = () => {
  const [ReviewMembers, setReviewMembers] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCenters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/memberdmission/review"
        );
        const centers = response.data;

        const storedUserData = localStorage.getItem("BranchData");
        const parsedData = JSON.parse(storedUserData);
        const currentUsername = parsedData.username;

        // Filter centers by the current username
        const filteredCenters = centers.filter(
          (center) => center.submittedBy === currentUsername
        );

        setReviewMembers(filteredCenters);
      } catch (error) {
        setError("Error fetching centers needing correction");
      }
    };

    fetchReviewCenters();
  }, []);

  const cancelMember = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/memberdmission/cancel/${id}`
      );
      setReviewMembers(ReviewMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the member.");
    }
  };

  const EditMember = (member) => {
    navigate("/home/MemberEdit", { state: { memberID: member._id } });
  };

  const CheckedMember = async (id) => {
    try {
      // Assuming you want to update the member's approvalStatus to "Approved"
      const updatedMember = {
        approvalStatus: "Pending",
      };

      const response = await axios.put(
        `http://localhost:5000/member-callback/${id}`, // Use the correct API endpoint
        updatedMember
      );

      // Update the state with the new member data
      setReviewMembers((prevState) =>
        prevState.map((member) =>
          member._id === id ? response.data.updatedMember : member
        )
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating member:", error.message);
      alert("Error updating the member.");
    }
  };

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Member Review</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {ReviewMembers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Member Name</th>
                  <th>Member NID</th>
                  <th>Parents Name</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Address</th>
                  <th>Nomini</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ReviewMembers.map((member, index) => (
                  <tr key={member._id || index}>
                    <td>{member.memberID}</td>
                    <td>{member.memberName}</td>
                    <td>{member.MemberNIDnumber}</td>
                    <td>{member.MfhName}</td>
                    <td>{member.BranchMember}</td>
                    <td>{member.CenterIDMember}</td>
                    <td>{member.memberVillage}</td>
                    <td>{member.NominiName}</td>
                    <td>{member.MemberMobile}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => CheckedMember(member._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => EditMember(member)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => cancelMember(member._id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No Members pending approval</p>
        )}
      </div>
    </div>
  );
};

export default MemberReview;
