// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const GrantMember = () => {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [error, setError] = useState("");
  const [Branches, setBranches] = useState([]);
  const [username, setUsername] = useState(""); // Add username state
  const [userDesignation, setUserDesignation] = useState("");
  const [reviewMembers, setReviewMembers] = useState([]);
  const [loggedUsers, setLoggedUsers] = useState({}); // State to store fetched designations

  const navigate = useNavigate();

  // Designations that require showing "Edit Member" and specific data
  const shouldShowEditMember =
    userDesignation === "উর্দ্ধতন কর্মসূচী সংগঠক" ||
    userDesignation === "কর্মসূচী সংগঠক" ||
    userDesignation === "সহকারী কর্মসূচী সংগঠক";

  // Fetch user data (branches, designation, username)
  useEffect(() => {
    const storedUserData = localStorage.getItem("BranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("Branch"))
        .map((key) => parsedData[key]);
      setBranches(branches);

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);
      setUserDesignation(designations[0]); // Assume there is one designation

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username);
    }
  }, []);

  // Fetch data based on the user's designation
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (shouldShowEditMember) {
          // Fetch data only from the review API if the user has one of the specific designations
          response = await axios.get(
            "http://localhost:5000/memberdmission/review"
          );
        } else {
          // Fetch data from the granted API for all other users
          response = await axios.get(
            "http://localhost:5000/memberdmission/granted"
          );
        }
        const data = response.data;

        // Fetch the designations for each submittedBy
        data.forEach(async (member) => {
          const submittedBy = member.submittedBy;
          if (submittedBy) {
            try {
              const userResponse = await axios.get(
                `http://localhost:5000/get-user-username/${submittedBy}`
              );
              if (userResponse.data.length > 0) {
                const { accountName, designation } = userResponse.data[0];
                setLoggedUsers((prevDesignations) => ({
                  ...prevDesignations,
                  [submittedBy]: { accountName, designation },
                }));
              }
            } catch (error) {
              console.error("Error fetching user designation:", error.message);
            }
          }
        });

        if (shouldShowEditMember) {
          // Filter centers by the current username for the users with specific designations
          const filteredCenters = data.filter(
            (center) => center.submittedBy === username
          );
          setReviewMembers(filteredCenters);
        } else {
          setPendingMembers(data);
        }
      } catch (error) {
        setError("Error fetching member data");
      }
    };

    fetchData();
  }, [shouldShowEditMember, username, loggedUsers]);

  const GrantedMember = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/memberdmission/granted/${id}`,
        { username }
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving member:", error.message);
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
      console.error("Error canceling member:", error.message);
      alert("Error canceling the member.");
    }
  };

  const reviewMember = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/memberdmission/review/${id}`
      );
      setPendingMembers(pendingMembers.filter((member) => member._id !== id));
      alert("Member sent back for correction");
    } catch (error) {
      console.error("Error reviewing member:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Filter logic based on Branches for non-review users
  const filteredMembers = pendingMembers.filter((member) =>
    Branches.includes(member.BranchMember)
  );

  const ViewMember = (member) => {
    navigate("/home/MemberAbout", { state: { memberID: member._id } });
  };

  const EditMember = (member) => {
    navigate("/home/MemberEdit", { state: { memberID: member._id } });
  };

  const CheckedMember = async (id) => {
    try {
      // Assuming you want to update the member's approvalStatus to "Approved"
      const updatedMember = {
        approvalStatus: "Approved",
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
          <h2 className="text-center mb-4 pt-3">
            {shouldShowEditMember ? "সদস্য পুনঃনিরীক্ষণ" : "সদস্যর অনুমতি"}
          </h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {shouldShowEditMember ? (
          reviewMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>সসদ্য ID</th>
                    <th>সসদ্য নাম</th>
                    <th>সসদ্য NID</th>
                    <th>অভিবাবক</th>
                    <th>শাখা</th>
                    <th>কেন্দ্র</th>
                    <th>ঠিকানা</th>
                    <th>নমিনী</th>
                    <th>ফোন</th>

                    <th>পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewMembers.map((member, index) => (
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
            <p className="text-center">পুনঃনিরীক্ষণের জন্য কোন সদস্য নেই</p>
          )
        ) : filteredMembers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>সসদ্য ID</th>
                  <th>সসদ্য নাম</th>
                  <th>সসদ্য NID</th>
                  <th>অভিবাবক</th>
                  <th>শাখা</th>
                  <th>কেন্দ্র</th>
                  <th>ঠিকানা</th>
                  <th>নমিনী</th>
                  <th>ফোন</th>
                  <th>আবেদনকারী</th>
                  <th>পাদবী</th>
                  <th>পদক্ষেপ</th>
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
                      {/* Show the fetched accountName */}
                      {loggedUsers[member.submittedBy]
                        ? loggedUsers[member.submittedBy].accountName // Display accountName instead of username
                        : "Loading..."}
                    </td>

                    <td>
                      {/* Show the fetched designation */}
                      {loggedUsers[member.submittedBy]
                        ? loggedUsers[member.submittedBy].designation
                        : "Loading..."}
                    </td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => GrantedMember(member._id)}
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
                        className="btn btn-warning me-2"
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
          <p className="text-center">অনুমতির জন্য কোন সদস্য নেই</p>
        )}
      </div>
    </div>
  );
};

export default GrantMember;
