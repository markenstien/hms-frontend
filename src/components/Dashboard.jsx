import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaBedPulse, FaUserDoctor, FaHospital } from "react-icons/fa6";
import { PiBedFill } from "react-icons/pi";
import BigDataChart from "./BigDataChart";
import { isAuthenticated, whoIs } from "./Routers";
import OtpScreen from "./widget/OtpScreen";
const queryParameters = new URLSearchParams(window.location.search)

const Dashboard = () => {
  const [hasAuth, setHasAuth] = useState(isAuthenticated);
  const [userData, setUserData]= useState(whoIs());
  
  const [loadTimer, setLoadTimer] = useState({
    time : 0,
    interval : null,
    complete: false
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalInpatients, setTotalInpatients] = useState(0);
  const [totalOutpatients, setTotalOutpatients] = useState(0);
  const [randomQuote, setRandomQuote] = useState("");
  const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

  const totalBedCapacity = 50;
  const isFromLogin = searchParams.get('fromLogin');

  const [wards, setWards] = useState({
    availableBeds : '',
    occupied : '',
    availableWards : []
  });
  const quotes = [
    "The greatest use of a life is to spend it on something that will outlast it. – William James",
    "Service to others is the rent you pay for your room here on earth. – Muhammad Ali",
    "To care for anyone else enough to make their problems one’s own is ever the beginning of one’s real influence. – Walter Benjamin",
    "Wherever there is a human being, there is an opportunity for kindness. – Lucius Annaeus Seneca",
  ];
  const countdownTimer = () => {
    var countdownValue = 0;
    console.log("useEffect runs"); // Debugging to verify only runs once
    const interval = setInterval(() => {
        countdownValue++; // Correct way to update state
        console.log([
          countdownValue
        ]);

        if(countdownValue > 2) {
          setLoadTimer({
            complete : true
          })
          return clearInterval(interval);
        }
    }, 1000);
  }

  const calculateBeds = () => {
    let bedTotal = 0;
    for(let i in wards.availableWards) {
      bedTotal = bedTotal + wards.availableWards[i].capacity;
    }

    return bedTotal;
  }
  useEffect(() => {
    if(isFromLogin == 'yes') {
      countdownTimer();
    } else {
      setLoadTimer({
        complete : true
      })
    }

    const fetchWards = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/ward/`,
          { withCredentials: true }
        );
        setWards(w => ({...w, availableWards: data.wards}));

        /**
         * computing wards
         */
        let availableBedWardCount = 0;

        console.log([
          'wards',
          wards.availableWards
        ])
        for(let i in wards.availableWards) {

          console.log([
            'availableBedWardCount',
            availableBedWardCount
          ]);
          // availableBedWardCount = availableBedWardCount + wards.availableWards[i].capacity;
          // console.log([
          //   'availableBedWardCount',
          //   availableBedWardCount
          // ]);
          // availableBedWardCount++;
        }
        // setWards(w => ({...w, availableBeds: availableBedWardCount}));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };

    const fetchCounts = async () => {
      try {
        const inpatientResponse = await axios.get(
          `${apiBaseURL}/api/v1/inpatients/count`,
          { withCredentials: true }
        );
        setTotalInpatients(inpatientResponse.data.count);

        const outpatientResponse = await axios.get(
          `${apiBaseURL}/api/v1/outpatients/count`,
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
          `${apiBaseURL}/api/v1/user/doctors`,
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
      fetchWards();
    }

    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  // Calculate available beds
  const availableBeds = totalBedCapacity - totalInpatients;

  return (
    <>
      {loadTimer.complete ? '': (
        <div id="loading-screen">
          <p>We are preparing your data ... </p>
        </div>
      )}

      {!loadTimer.complete ? '' : (
        <section className="dashboard page hidden">
          <div className="banner">
            <div className="firstBox">
              <div className="content">
                <div>
                  <p>Hello,</p>
                  <h5>{userData && `${userData.firstName}`}</h5>
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
              <p>Wards</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaHospital style={{ marginRight: "8px", fontSize: "27px" }} />
                <h3>{wards.availableWards.length} Total</h3>
              </div>

              <p>Bed Capacity</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaBedPulse style={{ marginRight: "8px", fontSize: "27px" }} />
                <h3>{calculateBeds()} Total</h3>
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
      )}
    </>
  );
};

export default Dashboard;
