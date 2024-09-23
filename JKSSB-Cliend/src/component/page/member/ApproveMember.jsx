// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const ApproveMember = () => {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const navigate = useNavigate();
  const [designations, setDesignations] = useState({});

  useEffect(() => {
    const fetchPendingMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/memberdmission/approved"
        );
        setPendingMembers(response.data);

        // Fetch the designations for each submittedBy
        response.data.forEach(async (member) => {
          const submittedBy = member.submittedBy;
          if (submittedBy) {
            try {
              const userResponse = await axios.get(
                `http://localhost:5000/get-user-username/${submittedBy}`
              );
              if (userResponse.data.length > 0) {
                const { accountName, designation } = userResponse.data[0];
                setDesignations((prevDesignations) => ({
                  ...prevDesignations,
                  [submittedBy]: { accountName, designation },
                }));
              }
            } catch (error) {
              console.error("Error fetching user designation:", error.message);
            }
          }
        });
      } catch (error) {
        setError("Error fetching pending members");
      }
    };

    fetchPendingMembers();

    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);

      // Retrieve branches (if needed for further logic)
      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      // Retrieve designations from user data
      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state

      // Check if the user has one of the required designations
      const requiredDesignations = [
        "শাখা ব্যাবস্থাপক ",
        "সহকারী শাখা ব্যাবস্থাপক ",
        "শাখা হিসাব রক্ষক ",
        "সহকারী শাখা হিসাবরক্ষক",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess); // Set access state
    }
  }, []);

  const approveMember = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/memberdmission/approved/${id}`,
        { username } // Pass username to the backend
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving center:", error.message);
      alert("Error approving the member.");
    }
  };

  const cancelMember = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/memberdmission/cancel/${id}`
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling center:", error.message);
      alert("Error canceling the member.");
    }
  };

  const reviewMember = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/memberdmission/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the center from the list after it's sent for review
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert("Center sent back for correction");
    } catch (error) {
      console.error("Error reviewing center:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const ViewMember = (member) => {
    navigate("/home/MemberAbout", {
      state: { memberID: member._id, from: "ApproveMember" },
    });
  };

  // Filter logic based on userBranches
  const filteredMembers = userBranches.includes("AllBranch")
    ? pendingMembers
    : pendingMembers.filter((member) =>
        userBranches.some((branch) => branch === member.BranchMember)
      );

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Approve Members</h2>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-danger">এই পেইজে আপনার অনুমতি নেই।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light container-fluid">
      <div className="p-2">
        <div className="border-bottom mb-5">
          <h2 className="text-center mb-4 pt-3">Approve Members</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {filteredMembers.length > 0 ? (
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
                  <th>Applied By</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
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
                      {designations[member.submittedBy]?.accountName || "N/A"}
                    </td>
                    <td>
                      {designations[member.submittedBy]?.designation || "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => approveMember(member._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => ViewMember(member)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-warning  me-2"
                        onClick={() => reviewMember(member._id)}
                      >
                        <i className="fas fa-redo"></i>
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

export default ApproveMember;
