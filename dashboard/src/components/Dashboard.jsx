import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { FaBedPulse, FaUserDoctor } from "react-icons/fa6";
import { PiBedFill } from "react-icons/pi";
import BigDataChart from "./BigDataChart";

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalInpatients, setTotalInpatients] = useState(0);
  const [totalOutpatients, setTotalOutpatients] = useState(0);
  const [randomQuote, setRandomQuote] = useState("");

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
        const inpatientResponse = await axios.get(
          "http://localhost:4000/api/v1/inpatients/count",
          { withCredentials: true }
        );
        setTotalInpatients(inpatientResponse.data.count);

        const outpatientResponse = await axios.get(
          "http://localhost:4000/api/v1/outpatients/count",
          { withCredentials: true }
        );
        setTotalOutpatients(outpatientResponse.data.count);
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setTotalDoctors(data.doctors.length);
      } catch (error) {
        setTotalDoctors(0);
        console.error("ERROR GETTING DOCTORS", error);
      }
    };

    if (isAuthenticated) {
      fetchCounts();
      fetchDoctors();
    }

    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

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
        <div className="thirdBox">
          <p>Total Doctors</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaUserDoctor style={{ marginRight: "8px", fontSize: "27px" }} />
            <h3>{totalDoctors} Total</h3>
          </div>
        </div>
        <div className="fourthBox">
          <p>Bed Capacity</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaBedPulse style={{ marginRight: "8px", fontSize: "27px" }} />
            <h3>{totalBedCapacity} Total</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PiBedFill style={{ marginRight: "8px", fontSize: "27px" }} />
            <h3>{availableBeds} Available</h3>
          </div>
        </div>
      </div>

      <div
        className="banner"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <BigDataChart
          totalInpatients={totalInpatients}
          totalOutpatients={totalOutpatients}
          availableBeds={availableBeds}
          totalDoctors={totalDoctors}
        />
      </div>
    </section>
  );
};

export default Dashboard;
