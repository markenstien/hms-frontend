import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBedPulse, FaUserDoctor } from "react-icons/fa6";
import { PiBedFill } from "react-icons/pi"; 
//import { GoCheckCircleFill } from "react-icons/go";
//import { AiFillCloseCircle } from "react-icons/ai";
import BigDataChart from "./BigDataChart"; // Ensure this component is implemented
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  //const [appointments, setAppointments] = useState([]);
  //const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalInpatients, setTotalInpatients] = useState(0);
  const [totalOutpatients, setTotalOutpatients] = useState(0); // State for outpatients
  const [randomQuote, setRandomQuote] = useState("");
  const [inpatientCount, setInpatientCount] = useState(0); // State for inpatient count
  const [outpatientCount, setOutpatientCount] = useState(0); // State for outpatient count



  // TOTAL BED CAPACITY
  //I Will make a ui for this on the future updatessss
  const totalBedCapacity = 50;


  const quotes = [
    "The greatest use of a life is to spend it on something that will outlast it. – William James",
    "Service to others is the rent you pay for your room here on earth. – Muhammad Ali",
    "To care for anyone else enough to make their problems one’s own is ever the beginning of one’s real influence. – Walter Benjamin",
    "Wherever there is a human being, there is an opportunity for kindness. – Lucius Annaeus Seneca",
  ];


  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const inpatientResponse = await axios.get("http://localhost:4000/api/v1/inpatients/count", { withCredentials: true });
        setInpatientCount(inpatientResponse.data.count);
        
        const outpatientResponse = await axios.get("http://localhost:4000/api/v1/outpatients/count", { withCredentials: true });
        setOutpatientCount(outpatientResponse.data.count);
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    {/*
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/appointment/getall", { withCredentials: true });
        setAppointments(data.appointments);
        setTotalAppointments(data.appointments.length);
      } catch (error) {
        setAppointments([]);
        console.error("ERROR GETTING APPOINTMENTS", error);
      }
    };
    */}

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", { withCredentials: true });
        setTotalDoctors(data.doctors.length);
      } catch (error) {
        setTotalDoctors(0);
        console.error("ERROR GETTING DOCTORS", error);
      }
    };

    const fetchInpatients = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/inpatients/inpatients", { withCredentials: true });
        setTotalInpatients(data.inpatients.length);
      } catch (error) {
        setTotalInpatients(0);
        console.error("ERROR GETTING INPATIENTS", error);
      }
    };

    const fetchOutpatients = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/outpatients/outpatients", { withCredentials: true });
        setTotalOutpatients(data.outpatients.length);
      } catch (error) {
        setTotalOutpatients(0);
        console.error("ERROR GETTING OUTPATIENTS", error);
      }
    };

    if (isAuthenticated) {
      fetchCounts();
      //fetchAppointments();
      fetchDoctors();
      fetchInpatients();
      fetchOutpatients();
    }

    //this is for the random quote
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
  }, [isAuthenticated]);

  

  {/*

    DISABLED FOR NOW

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  */}
  

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  };


  // Calculate available beds
  const availableBeds = totalBedCapacity - totalInpatients;

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{user && `${user.firstName}`}</h5>
            </div>
            <p>{randomQuote}</p>
          </div>
        </div>
        {/*
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
          */}
        <div className="thirdBox">
          <p>Total Doctors</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserDoctor style={{ marginRight: '8px', fontSize: '27px' }} /> {/* Bed icon for total */}
            <h3>{totalDoctors} Total</h3>
          </div>
        </div>
        <div className="fourthBox">
          <p>Bed Capacity</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaBedPulse style={{ marginRight: '8px', fontSize: '27px' }} /> {/* Bed icon for total */}
            <h3>{totalBedCapacity} Total</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PiBedFill style={{ marginRight: '8px', fontSize: '27px' }} /> {/* Bed icon for available */}
            <h3>{availableBeds} Available</h3> {/* Display available beds */}
          </div>
        </div>




        
      </div>

      <div className="banner">
        <BigDataChart 
          totalInpatients={totalInpatients}
          totalOutpatients={totalOutpatients}
          totalDoctors={totalDoctors}
        />
      </div>
      

      {/*

      DISABLED THIS FEATURE AS FOR NOW  
      <div className="banner">
        <h5>Appointments</h5>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited === true ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Appointments Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      */}
    </section>
  );
};

export default Dashboard;
