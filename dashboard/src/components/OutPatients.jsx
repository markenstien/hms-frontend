import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../main';
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from 'react-router-dom';

const OutPatients = () => {
  const [outpatients, setOutPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useContext(Context);

  // Fetch outpatients from the API
  useEffect(() => {
    const fetchOutPatients = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/outpatients/outpatients", { withCredentials: true });
        setOutPatients(data.outpatients); // Set outpatients in state
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch outpatients"); // Show error message
      }
    };

    fetchOutPatients(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter outpatients based on the search query
  const filteredOutpatients = outpatients.filter((outpatient) =>
    `${outpatient.firstName} ${outpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to archive an outpatient
  const archiveOutpatient = async (patientId) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/outpatients/archive/${patientId}`, {}, { withCredentials: true });
      toast.success(response.data.message); // Show success message
      setOutPatients((prev) => prev.filter((outpatient) => outpatient.patientId !== patientId)); // Remove archived outpatient from state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive outpatient"); // Show error message
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
          {filteredOutpatients.length > 0 ? (
            filteredOutpatients.map((element) => (
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
                  <p>Appointment Date: <span>{element.appointmentDate.substring(0, 10)}</span></p>
                  <p>Follow-up Required: <span>{element.followUpNeeded ? "Yes" : "No"}</span></p>
                </div>
                <button className="archive-btn" onClick={() => archiveOutpatient(element.patientId)}>Archive</button>
              </div>
            ))
          ) : (
            <h1>No Outpatients Found!</h1>
          )}
        </div>
      </section>
    </>
  );
};

export default OutPatients;
