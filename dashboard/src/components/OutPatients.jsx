import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";

const OutPatients = () => {
  const [outpatients, setOutPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ insuranceInformation: {} });

  // Fetch outpatients from the API
  useEffect(() => {
    const fetchOutPatients = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/outpatients/outpatients",
          { withCredentials: true }
        );
        setOutPatients(data.outpatients);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch outpatients"
        );
      }
    };

    fetchOutPatients();
  }, []);

  // If not authenticated, redirect to login yes
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // filter outpatients based on the search query
  const filteredOutpatients = outpatients.filter((outpatient) =>
    `${outpatient.firstName} ${outpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("insuranceInformation.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuranceInformation: {
          ...prev.insuranceInformation,
          [key]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // function to open the modal for updating outpatient data
  const openModal = (outpatient) => {
    setFormData({
      ...outpatient,
      insuranceInformation: outpatient.insuranceInformation || {},
    });
    setShowModal(true);
  };

 // function to handle form submission for updating outpatient data
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      `http://localhost:4000/api/v1/outpatients/update/${formData.patientId}`,
      formData,
      { withCredentials: true }
    );

    toast.success(response.data.message); // Show success toast

    // update the state with the updated outpatient
    setOutPatients((prev) =>
      prev.map((outpatient) =>
        outpatient.patientId === formData.patientId ? formData : outpatient
      )
    );

    setShowModal(false);
    setFormData({ insuranceInformation: {} });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update outpatient data"
    );
  }
};


 // function to archive an outpatient
 const archiveOutpatient = async (patientId) => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/v1/outpatients/archive/${patientId}`,
      {},
      { withCredentials: true }
    );
    toast.success(response.data.message); // show success toast
    setOutPatients((prev) =>
      prev.filter((outpatient) => outpatient.patientId !== patientId)
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to archive outpatient"
    );
  }
};

  return (
    <>
      <section className="page patients">
        <h1>OUTPATIENTS</h1>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
          style={{
            padding: "8px",
            marginTop: `20px`,
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "400px",
          }}
        />

        <div className="banner">
          {filteredOutpatients.length > 0 ? (
            filteredOutpatients.map((element) => (
              <div className="card" key={element.patientId}>
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Date of Birth: <span>{element.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Age:{" "}
                    <span>
                      {new Date().getFullYear() -
                        new Date(element.dob).getFullYear()}
                    </span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                  <p>
                    Mobile: <span>{element.mobile}</span>
                  </p>
                  <p>
                    Landline: <span>{element.landline || "N/A"}</span>
                  </p>
                  <p>
                    Email: <span>{element.email || "N/A"}</span>
                  </p>
                  <p>
                    Address: <span>{element.address}</span>
                  </p>
                  <p>
                    Primary Health Concern:{" "}
                    <span>{element.primaryHealthConcern}</span>
                  </p>
                  <p>
                    Medical History:{" "}
                    <span>{element.medicalHistory || "N/A"}</span>
                  </p>
                  <p>
                    Current Medications:{" "}
                    <span>{element.currentMedications || "N/A"}</span>
                  </p>
                  <p>
                    Family Medical History:{" "}
                    <span>{element.familyMedicalHistory || "N/A"}</span>
                  </p>
                  <p>
                    Insurance Provider:{" "}
                    <span>
                      {element.insuranceInformation?.provider || "N/A"}
                    </span>
                  </p>
                  <p>
                    Policy Number:{" "}
                    <span>
                      {element.insuranceInformation?.policyNumber || "N/A"}
                    </span>
                  </p>
                  <p>
                    Patient ID: <span>{element.patientId}</span>
                  </p>
                  <p>
                    Appointment Date:{" "}
                    <span>{element.appointmentDate.substring(0, 10)}</span>
                  </p>
                  <p>
                    Follow-up Required:{" "}
                    <span>{element.followUpNeeded ? "Yes" : "No"}</span>
                  </p>
                </div>
                <button
                  className="update-btn"
                  onClick={() => openModal(element)}
                >
                  Update
                </button>
                <button
                  className="discharge-btn" /*i used this classname because they look the same */
                  onClick={() => archiveOutpatient(element.patientId)}
                >
                  Archive
                </button>
              </div>
            ))
          ) : (
            <h1>No Outpatients Found!</h1>
          )}
        </div>

        {/* Modal for Updating Outpatient Data */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Outpatient Data</h2>
              <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  required
                />

                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ? formData.dob.substring(0, 10) : ""} // Format for date input
                  onChange={handleChange}
                  required
                />

                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  required
                />

                <label>Landline</label>
                <input
                  type="text"
                  name="landline"
                  value={formData.landline || ""}
                  onChange={handleChange}
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />

                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />

                <label>Primary Health Concern</label>
                <input
                  type="text"
                  name="primaryHealthConcern"
                  value={formData.primaryHealthConcern || ""}
                  onChange={handleChange}
                />

                <label>Medical History</label>
                <input
                  type="text"
                  name="medicalHistory"
                  value={formData.medicalHistory || ""}
                />

                <label>Current Medications</label>
                <input
                  type="text"
                  name="currentMedications"
                  value={formData.currentMedications || ""}
                  onChange={handleChange}
                />

                <label>Family Medical History</label>
                <input
                  type="text"
                  name="familyMedicalHistory"
                  value={formData.familyMedicalHistory || ""}
                  onChange={handleChange}
                />

                <label>Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceInformation.provider"
                  value={formData.insuranceInformation.provider || ""}
                  onChange={handleChange}
                />

                <label>Policy Number</label>
                <input
                  type="text"
                  name="insuranceInformation.policyNumber"
                  value={formData.insuranceInformation.policyNumber || ""}
                  onChange={handleChange}
                />

                <label>Follow-up Required</label>
                <input
                  type="checkbox"
                  name="followUpNeeded"
                  className="checkbox-input"
                  checked={formData.followUpNeeded || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      followUpNeeded: e.target.checked,
                    })
                  }
                />

                <div className="modal-buttons">
                  <button type="submit" className="save-btn">
                    Update
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
      </section>
    </>
  );
};

export default OutPatients;
