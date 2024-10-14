import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../main';
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]); // State to store doctors list
  const { isAuthenticated } = useContext(Context); // Destructure isAuthenticated from Context

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", { withCredentials: true });
        setDoctors(data.doctors); // Set doctors in state
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors"); // Show error message
      }
    };

    fetchDoctors(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts yeah

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <section className="page doctors">
        <h1>DOCTORS</h1>
        <div className="banner">
          {doctors && doctors.length > 0 ? (
            doctors.map((element) => (
              <div className="card" key={element._id}>
                <img src={element.docAvatar && element.docAvatar.url} alt="Doctor's Avatar" />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>Email: <span>{element.email}</span></p>
                  <p>Phone: <span>{element.phone}</span></p>
                  <p>Birth: <span>{element.dob.substring(0,10)}</span></p>
                  <p>Department: <span>{element.doctorDepartment}</span></p>
                  <p>PhilSys or NIC: <span>{element.philsysornic}</span></p>
                  <p>Gender: <span>{element.gender}</span></p>
                </div>
              </div>
            ))
          ) : (
            <h1>Doctor404, No Doctors Found!</h1> //if no doctors
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
 