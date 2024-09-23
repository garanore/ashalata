// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const GrantUser = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");
  const [userBranches, setUserBranches] = useState([]);
  const [, setUserDesignations] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [username, setUsername] = useState(""); // Add username state
  const [loggedUsers, setLoggedUsers] = useState({});

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/signup/grant");
        setPendingUsers(response.data);
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
                setLoggedUsers((prevDesignations) => ({
                  ...prevDesignations,
                  [submittedBy]: { accountName, designation },
                }));
              }
            } catch (error) {
              //   console.error("Error fetching user designation:", error.message);
            }
          }
        });
      } catch (error) {
        setError("Error fetching pending centers");
      }
    };

    fetchPendingUsers();

    const storedUserData = localStorage.getItem("userBranchData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      const branches = Object.keys(parsedData)
        .filter((key) => key.startsWith("UserBranch"))
        .map((key) => parsedData[key]);
      setUserBranches(branches);

      const designations = Object.keys(parsedData)
        .filter((key) => key.startsWith("designation"))
        .map((key) => parsedData[key]);
      setUserDesignations(designations);

      const userNames = Object.keys(parsedData)
        .filter((key) => key.startsWith("username"))
        .map((key) => parsedData[key]);

      // Assume there is only one username and take the first one
      const username = userNames.length > 0 ? userNames[0] : "Unknown";
      setUsername(username); // Set the username in the state

      const requiredDesignations = [
        "নির্বাহী পরিচালক ",
        "সহকারী নির্বাহী পরিচালক ",
      ];
      const userHasAccess = designations.some((designation) =>
        requiredDesignations.includes(designation)
      );
      setHasAccess(userHasAccess);
    }
  }, []);

  const GrantedUser = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/signup/grant/${id}`,
        { username } // Pass username to the backend
      );
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error approving User:", error.message);
    }
  };

  const cancelUser = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/signup/cancel/${id}`
      );
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error canceling User:", error.message);
    }
  };

  const reviewUser = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `http://localhost:5000/signup/review/${id}` // Call the API to update the status to "Needs Correction"
      );

      // Remove the User from the list after it's sent for review
      setPendingUsers(pendingUsers.filter((User) => User._id !== id));
      alert("User sent back for correction");
    } catch (error) {
      console.error("Error reviewing User:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredUsers = userBranches.includes("AllBranch")
    ? pendingUsers
    : pendingUsers.filter((User) =>
        userBranches.some((branch) => branch === User.centerBranch)
      );

  if (!hasAccess) {
    return (
      <div className="bg-light container-fluid">
        <div className="p-2">
          <div className="border-bottom mb-5">
            <h2 className="text-center mb-4 pt-3">Granted Users</h2>
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
          <h2 className="text-center mb-4 pt-3">Granted Users</h2>
        </div>
      </div>

      <div className="p-3">
        {error && <div className="alert alert-danger">{error}</div>}

        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Designation</th>
                  <th>Branch</th>
                  <th>Center</th>
                  <th>Submit By</th>
                  <th>S. Designation</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((User) => (
                  <tr key={User._id}>
                    <td>{User.accountName}</td>
                    <td>{User.username}</td>
                    <td>{User.email}</td>
                    <td>{User.phoneNumber}</td>
                    <td>{User.designation}</td>
                    <td>{User.UserBranch}</td>
                    <td>{User.UserCenter}</td>
                    <td>{User.submittedBy}</td>
                    <td>{loggedUsers[User.submittedBy]?.designation}</td>

                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => GrantedUser(User._id)}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => cancelUser(User._id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => reviewUser(User._id)}
                      >
                        <i className="fas fa-redo"></i> {/* Review Icon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No Users pending for Granted</p>
        )}
      </div>
    </div>
  );
};

export default GrantUser;
