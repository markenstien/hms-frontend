import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../main';
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from 'react-router-dom';

const InPatients = () => {
  const [inpatients, setInPatients] = useState([]); // State to store inpatients list
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const { isAuthenticated } = useContext(Context); // Destructure isAuthenticated from Context

  // Fetch inpatients from the API
  useEffect(() => {
    const fetchInPatients = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/inpatients/inpatients", { withCredentials: true });
        setInPatients(data.inpatients); // Set inpatients in state
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch inpatients"); // Show error message
      }
    };

    fetchInPatients(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter inpatients based on the search query
  const filteredInpatients = inpatients.filter((inpatient) =>
    `${inpatient.firstName} ${inpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to discharge an inpatient
  const dischargeInpatient = async (patientId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/inpatients/discharge/${patientId}`, {}, { withCredentials: true });
      toast.success(response.data.message); // Show success message
      setInPatients((prev) => prev.filter((inpatient) => inpatient.patientId !== patientId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to discharge inpatient"); // Show error message
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
            padding: '8px',
            marginTop: `20px`,
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '400px',
          }}
        />

        <div className="banner">
          {filteredInpatients.length > 0 ? (
            filteredInpatients.map((element) => (
              <div className="card" key={element.patientId}>
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>Date of Birth: <span>{element.dob.substring(0, 10)}</span></p>
                  <p>Age: <span>{new Date().getFullYear() - new Date(element.dob).getFullYear()}</span></p>
                  <p>Gender: <span>{element.gender}</span></p>
                  <p>Mobile: <span>{element.mobile}</span></p>
                  <p>Landline: <span>{element.landline || "N/A"}</span></p>
                  <p>Email: <span>{element.email || "N/A"}</span></p>
                  <p>Address: <span>{element.address}</span></p>
                  <p>Primary Health Concern: <span>{element.primaryHealthConcern}</span></p>
                  <p>Medical History: <span>{element.medicalHistory || "N/A"}</span></p>
                  <p>Current Medications: <span>{element.currentMedications || "N/A"}</span></p>
                  <p>Family Medical History: <span>{element.familyMedicalHistory || "N/A"}</span></p>
                  <p>Insurance Provider: <span>{element.insuranceInformation?.provider || "N/A"}</span></p>
                  <p>Policy Number: <span>{element.insuranceInformation?.policyNumber || "N/A"}</span></p>
                  <p>Patient ID: <span>{element.patientId}</span></p>
                  <p>Admission Date: <span>{element.admissionDate.substring(0, 10)}</span></p>
                  <p>Ward/Room Preference: <span>{element.wardRoomPreference || "N/A"}</span></p>
                  <p>Expected Length of Stay: <span>{element.expectedLengthOfStay || "N/A"}</span></p>
                  <p>Emergency Contact: <span>{`${element.emergencyContact.name} (${element.emergencyContact.relationship}): ${element.emergencyContact.contactNumber}`}</span></p>
                  <p>Guardian Details: <span>{`${element.guardianDetails.name || "N/A"} (${element.guardianDetails.relationship || "N/A"})`}</span></p>
                </div>
                <button className="discharge-btn" onClick={() => dischargeInpatient(element.patientId)}>Discharge</button>
              </div>
            ))
          ) : (
            <h1>No Inpatients Found!</h1>
          )}
        </div>
      </section>
    </>
  );
};

export default InPatients;
