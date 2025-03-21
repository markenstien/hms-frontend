import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";

const InPatients = () => {
  const [inpatients, setInPatients] = useState([]); // State to store inpatients list
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { isAuthenticated } = useContext(Context); // Destructure isAuthenticated from Context
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({}); // State to store form data for editing
  const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;
  // Fetch inpatients from the API
  useEffect(() => {
    const fetchInPatients = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/inpatients/inpatients`,
          { withCredentials: true }
        );
        setInPatients(data.inpatients); // Set inpatients in state
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch inpatients"
        ); // Show error message
      }
    };

    fetchInPatients(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts

  // If not authenticated, redirect to login
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // Filter inpatients based on the search query
  const filteredInpatients = inpatients.filter((inpatient) =>
    `${inpatient.firstName} ${inpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to discharge an inpatient
  const dischargeInpatient = async (patientId) => {
    try {
      const response = await axios.post(
        `${apiBaseURL}/api/v1/inpatients/discharge/${patientId}`,
        { dischargeDate: new Date().toISOString() },
        { withCredentials: true }
      );
      toast.success(response.data.message); // Show success message
      setInPatients((prev) =>
        prev.filter((inpatient) => inpatient.patientId !== patientId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to discharge inpatient"
      ); // Show error message
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a nested property
    if (name.includes(".")) {
      const [mainField, nestedField] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [mainField]: {
          ...prev[mainField],
          [nestedField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to open the update modal
  const openUpdateModal = (inpatient) => {
    setFormData(inpatient);
    setShowModal(true);
  };

  // Function to handle form submission for updating inpatient data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseURL}/api/v1/inpatients/update/${formData.patientId}`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message); // Show success message
      setInPatients((prev) =>
        prev.map((inpatient) =>
          inpatient.patientId === formData.patientId ? formData : inpatient
        )
      );
      setShowModal(false); // Close the modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update inpatient"
      ); // show error message
    }
  };

  return (
    <>
      <section className="page patients">
        <h1>INPATIENTS</h1>

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
          {filteredInpatients.length > 0 ? (
            filteredInpatients.map((element) => (
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
                    Admission Date:{" "}
                    <span>{element.admissionDate.substring(0, 10)}</span>
                  </p>
                  <p>
                    Ward/Room Preference:{" "}
                    <span>{element.ward.roomModel || "N/A"} {element.ward.roomNumber || ""}</span>
                  </p>
                  <p>
                    Attending Physician:{" "}
                    <span>{element.physician.doctorDepartment || ""} {element.physician.name || "N/A"}</span>
                  </p>
                  <p>
                    Expected Length of Stay:{" "}
                    <span>{element.expectedLengthOfStay || "N/A"}</span>
                  </p>
                  <p>
                    Emergency Contact:{" "}
                    <span>{`${element.emergencyContact.name} (${element.emergencyContact.relationship}): ${element.emergencyContact.contactNumber}`}</span>
                  </p>
                  <p>
                    Guardian Details:{" "}
                    <span>{`${element.guardianDetails.name || "N/A"} (${
                      element.guardianDetails.relationship || "N/A"
                    })`}</span>
                  </p>
                </div>
                <button
                  className="update-btn"
                  onClick={() => openUpdateModal(element)}
                >
                  Update
                </button>
                <button
                  className="discharge-btn"
                  onClick={() => dischargeInpatient(element.patientId)}
                >
                  Discharge
                </button>
              </div>
            ))
          ) : (
            <h1>No Inpatients Found!</h1>
          )}
        </div>

        {/* Modal for Updating Inpatient Data */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Inpatient Data</h2>
              <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob?.substring(0, 10)}
                  onChange={handleChange}
                  required
                />

                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
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
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />

                <label>Landline</label>
                <input
                  type="tel"
                  name="landline"
                  value={formData.landline}
                  onChange={handleChange}
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <label>Primary Health Concern</label>
                <input
                  type="text"
                  name="primaryHealthConcern"
                  value={formData.primaryHealthConcern}
                  onChange={handleChange}
                  required
                />

                {/* Change textarea to input for medical history */}
                <label>Medical History</label>
                <input
                  type="text"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                />

                {/* Change textarea to input for current medications */}
                <label>Current Medications</label>
                <input
                  type="text"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                />

                {/* Change textarea to input for family medical history */}
                <label>Family Medical History</label>
                <input
                  type="text"
                  name="familyMedicalHistory"
                  value={formData.familyMedicalHistory}
                  onChange={handleChange}
                />

                <label>Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceInformation.provider"
                  value={formData.insuranceInformation?.provider || ""}
                  onChange={handleChange}
                />

                <label>Policy Number</label>
                <input
                  type="text"
                  name="insuranceInformation.policyNumber"
                  value={formData.insuranceInformation?.policyNumber || ""}
                  onChange={handleChange}
                />

                <label>Ward/Room Preference</label>
                <input
                  type="text"
                  name="wardRoomPreference"
                  value={formData.wardRoomPreference}
                  onChange={handleChange}
                />

                <label>Expected Length of Stay</label>
                <input
                  type="text"
                  name="expectedLengthOfStay"
                  value={formData.expectedLengthOfStay}
                  onChange={handleChange}
                />

                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact?.name || ""}
                  onChange={handleChange}
                  required
                />

                <label>Emergency Contact Relationship</label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact?.relationship || ""}
                  onChange={handleChange}
                  required
                />

                <label>Emergency Contact Number</label>
                <input
                  type="tel"
                  name="emergencyContact.contactNumber"
                  value={formData.emergencyContact?.contactNumber || ""}
                  onChange={handleChange}
                  required
                />

                <label>Guardian Name</label>
                <input
                  type="text"
                  name="guardianDetails.name"
                  value={formData.guardianDetails?.name || ""}
                  onChange={handleChange}
                  required
                />

                <label>Guardian Relationship</label>
                <input
                  type="text"
                  name="guardianDetails.relationship"
                  value={formData.guardianDetails?.relationship || ""}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default InPatients;
