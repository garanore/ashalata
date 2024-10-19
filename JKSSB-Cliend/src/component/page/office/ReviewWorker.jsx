// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useNavigate } from "react-router-dom";
// import "../../../css/center.css";

// const ReviewWorker = () => {
//   const [ReviewWorkers, setReviewWorkers] = useState([]);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const centersPerPage = 25; // Centers per page

//   useEffect(() => {
//     const fetchReviewCenters = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/workeradmission/review"
//         );
//         const centers = response.data;

//         const storedUserData = localStorage.getItem("userBranchData");
//         const parsedData = JSON.parse(storedUserData);
//         const currentUsername = parsedData.username;

//         // Filter centers by the current username
//         const filteredCenters = centers.filter(
//           (center) => center.submittedBy === currentUsername
//         );

//         setReviewWorkers(filteredCenters);
//       } catch (error) {
//         setError("Error fetching centers needing correction");
//       }
//     };

//     fetchReviewCenters();
//   }, []);

//   const cancelMember = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/workeradmission/cancel/${id}`
//       );
//       setReviewWorkers(ReviewWorkers.filter((worker) => worker._id !== id));
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error canceling center:", error.message);
//       alert("Error canceling the member.");
//     }
//   };

//   const EditMember = (worker) => {
//     navigate("/home/MemberEdit", { state: { memberID: worker._id } });
//   };

//   const CheckedMember = async (id) => {
//     try {
//       // Assuming you want to update the worker's approvalStatus to "Approved"
//       const updatedWorker = {
//         approvalStatus: "Approved",
//       };

//       const response = await axios.put(
//         `http://localhost:5000/worker-callback/${id}`, // Use the correct API endpoint
//         updatedWorker
//       );

//       // Update the state with the new worker data
//       setReviewWorkers((prevState) =>
//         prevState.map((worker) =>
//           worker._id === id ? response.data.updatedWorker : worker
//         )
//       );

//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error updating worker:", error.message);
//       alert("Error updating the worker.");
//     }
//   };

//   // Pagination logic
//   const indexOfLastMember = currentPage * centersPerPage;
//   const indexOfFirstMember = indexOfLastMember - centersPerPage;
//   const currentWorker = ReviewWorkers.slice(
//     indexOfFirstMember,
//     indexOfLastMember
//   );
//   const totalPages = Math.ceil(ReviewWorkers.length / centersPerPage);

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="bg-light container-fluid">
//       <div className="row mb-4">
//         <div className="col">
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{
//               backgroundColor: "#f0f4f8", // Soft background for the header
//               borderRadius: "10px", // Rounded edges for a modern look
//               padding: "20px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
//             }}
//           >
//             <h2
//               className="text-center mb-0"
//               style={{
//                 fontWeight: "bold",
//                 color: "#2D3748",
//                 fontSize: "2rem", // Larger text for prominence
//               }}
//             >
//               <i className="fas fa-user-tie"></i>
//               কর্মী পুনঃনিরীক্ষণ
//             </h2>
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col">
//           <hr
//             style={{
//               border: "none",
//               borderTop: "2px solid #2D3748", // Thicker line for emphasis
//               marginTop: "10px",
//             }}
//           />
//         </div>
//       </div>

//       <div className="p-3">
//         {error && <div className="alert alert-danger">{error}</div>}

//         {currentWorker.length > 0 ? (
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-light">
//                 <tr>
//                   <th>Worker ID</th>
//                   <th>Worker Name</th>
//                   <th>NID</th>
//                   <th>Father Name</th>
//                   <th>Branch</th>
//                   <th>Center</th>
//                   <th>Address</th>
//                   <th>Mobile</th>
//                   <th>Education</th>
//                   <th>Marital</th>
//                   <th>Designation</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentWorker.map((worker, index) => (
//                   <tr key={worker._id || index}>
//                     <td>{worker.workerID}</td>
//                     <td>{worker.WorkerName}</td>
//                     <td>{worker.WorkerNID}</td>
//                     <td>{worker.WorkerParent}</td>
//                     <td>{worker.Branch}</td>
//                     <td>{worker.Center}</td>
//                     <td>{worker.WorkerUnion}</td>
//                     <td>{worker.WorkerMobile}</td>
//                     <td>{worker.WorkerStudy}</td>
//                     <td>{worker.WorkerMarital}</td>
//                     <td>{worker.Designation}</td>
//                     <td>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => CheckedMember(worker._id)}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button
//                         className="btn btn-success me-2"
//                         onClick={() => EditMember(worker)}
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>

//                       <button
//                         className="btn btn-danger"
//                         onClick={() => cancelMember(worker._id)}
//                       >
//                         <i className="fas fa-times"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="alert alert-warning text-center" role="alert">
//             <i className="fas fa-exclamation-triangle me-2"></i>{" "}
//             {/* Font Awesome warning icon */}
//             পুনঃনিরীক্ষণের জন্য কোন কর্মী নেই।
//           </div>
//         )}
//       </div>
//       <div className="row justify-content-center my-3">
//         <div className="col-md-12">
//           <nav>
//             <ul className="pagination pagination-rounded">
//               <li className="page-item">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
//                   disabled={currentPage === 1} // Disable if on the first page
//                   title="Previous Page"
//                 >
//                   <i className="fas fa-chevron-left"></i>{" "}
//                   {/* Left arrow icon */}
//                   Previous
//                 </button>
//               </li>
//               {[...Array(totalPages)].map((_, i) => (
//                 <li
//                   key={i + 1}
//                   className={`page-item ${
//                     i + 1 === currentPage ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     onClick={() => paginate(i + 1)}
//                     className="page-link"
//                     title={`Go to page ${i + 1}`}
//                   >
//                     {i + 1}
//                   </button>
//                 </li>
//               ))}
//               <li className="page-item">
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   className={`page-link ${
//                     currentPage === totalPages ? "disabled" : ""
//                   }`}
//                   disabled={currentPage === totalPages} // Disable if on the last page
//                   title="Next Page"
//                 >
//                   Next
//                   <i className="fas fa-chevron-right"></i>{" "}
//                   {/* Right arrow icon */}
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewWorker;
