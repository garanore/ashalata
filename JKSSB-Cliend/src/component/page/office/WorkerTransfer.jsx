// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

// Sample data (replace it with your actual data)
const workers = [
  { id: 1, name: "কামাল", currentCenter: "Center A" },
  { id: 2, name: "জামাল 2", currentCenter: "Center B" },
  { id: 3, name: "সুমন 3", currentCenter: "Center C" },
  // ... Add more workers
];

const centers = ["Center A", "Center B", "Center C", "Center D", "Center E"];

// Main Component
function WorkerTransfer() {
  // State variables to store selected values
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  // const [transferCenters, setTransferCenters] = useState([]);

  // Effect to reset selected center when worker changes
  useEffect(() => {
    setSelectedCenter("");
  }, [selectedWorker]);

  // Event handlers for change in select options and input fields
  const handleWorkerChange = (e) => {
    const workerId = e.target.value;
    const selectedWorker = workers.find(
      (worker) => worker.id === Number(workerId)
    );
    setSelectedWorker(selectedWorker);
  };

  const handleCenterChange = (e) => {
    setSelectedCenter(e.target.value);
  };

  const handleTransferClick = () => {
    if (selectedWorker && selectedCenter) {
      // Add logic to transfer worker to the selected center
      console.log(
        `Transfer worker ${selectedWorker.name} to ${selectedCenter}`
      );
      // You may update your database or perform any other necessary actions here
    }
  };

  return (
    <div>
      <div>
        <div className="  mt-2 bg-light">
          <div className="mb-5 ">
            <h2 className="text-center mb-4 pt-4 ">কর্মী ট্র্যান্সফার করুণ </h2>
          </div>

          <form className=" bg-light ">
            {/* <!-- Full Name --> */}
            <div className="row g-4 p-2">
              <div className="mb-3 col-4">
                <label htmlFor="workerInput" className="form-label">
                  কর্মী নির্বাচন করুণ
                </label>
                <input
                  type="text"
                  id="workerInput"
                  className="form-control"
                  placeholder="Type worker name or ID"
                  list="workerList"
                  onChange={handleWorkerChange}
                />
                <datalist id="workerList">
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name}
                    </option>
                  ))}
                </datalist>
              </div>
              {selectedWorker && (
                <div className="mb-3 col-4">
                  <label htmlFor="currentCenter" className="form-label">
                    বর্তমান কেন্দ্র
                  </label>
                  <input
                    type="text"
                    id="currentCenter"
                    className="form-control"
                    value={selectedWorker.currentCenter}
                    readOnly
                  />
                </div>
              )}

              {/* Transfer Center Select */}
              {selectedWorker && (
                <div className="mb-3 col-4">
                  <label htmlFor="transferCenter" className="form-label">
                    কেন্দ্র পরিবর্তন
                  </label>
                  <select
                    id="transferCenter"
                    className="form-select"
                    value={selectedCenter}
                    onChange={handleCenterChange}
                  >
                    <option value="">Choose...</option>
                    {centers.map((center) => (
                      <option key={center} value={center}>
                        {center}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              {selectedWorker && selectedCenter && (
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={handleTransferClick}
                >
                  Transfer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Worker Input */}

      {/* Current Center */}
    </div>
  );
}

export default WorkerTransfer;
