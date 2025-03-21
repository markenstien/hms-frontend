import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";

const PatientsArchive = () => {
  const [archivedPatients, setArchivedPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useContext(Context);

  // Fetch archived patients from the API
  useEffect(() => {
    const fetchArchivedPatients = async () => {
      try {
        const { data } = await axios.get(
          "https://hmscore1-backend.vercel.app/api/v1/archivedPatients",
          { withCredentials: true }
        );
        setArchivedPatients(data.archivedPatients); // Set archived patients in state
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch archived patients"
        ); // Show error message
      }
    };

    fetchArchivedPatients(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter archived patients based on the search query
  const filteredArchivedPatients = archivedPatients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = new Date(Date.now() - birthDate.getTime());
    return ageDiff.getUTCFullYear() - 1970; // Calculate age
  };

  return (
    <>
      <section className="page archive">
        <h1>ARCHIVED PATIENTS</h1>

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
          {filteredArchivedPatients.length > 0 ? (
            filteredArchivedPatients.map((patient) => (
              <div className="card" key={patient._id}>
                <h4>{`${patient.firstName} ${patient.lastName}`}</h4>
                <div className="details">
                  <p>
                    Date of Birth: <span>{patient.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Age: <span>{calculateAge(patient.dob)}</span>
                  </p>{" "}
                  {/* Display computed age */}
                  <p>
                    Gender: <span>{patient.gender}</span>
                  </p>
                  <p>
                    Mobile: <span>{patient.mobile}</span>
                  </p>
                  <p>
                    Landline: <span>{patient.landline || "N/A"}</span>
                  </p>
                  <p>
                    Email: <span>{patient.email || "N/A"}</span>
                  </p>
                  <p>
                    Address: <span>{patient.address}</span>
                  </p>
                  <p>
                    Primary Health Concern:{" "}
                    <span>{patient.primaryHealthConcern}</span>
                  </p>
                  <p>
                    Medical History:{" "}
                    <span>{patient.medicalHistory || "N/A"}</span>
                  </p>
                  <p>
                    Current Medications:{" "}
                    <span>{patient.currentMedications || "N/A"}</span>
                  </p>
                  <p>
                    Discharge Date:{" "}
                    <span>
                      {patient.dischargeDate
                        ? new Date(patient.dischargeDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    Status: <span>{patient.status}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Archived Patients Found!</h1>
          )}
        </div>
      </section>
    </>
  );
};

export default PatientsArchive;
