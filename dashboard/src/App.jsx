import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewInpatient from "./components/AddNewInpatient";
import AddNewOutpatient from "./components/AddNewOutpatient";
import PatientsArchive from "./components/PatientsArchive";
import InPatients from "./components/InPatients";
import OutPatients from "./components/OutPatients";
import AddNewAdmin from "./components/AddNewAdmin";
import Doctors from "./components/Doctors";
import Sidebar from "./components/Sidebar";
import BigDataChart from "./components/BigDataChart";
import { Context } from "./main";
import axios from "axios";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://hmscore1-backend.vercel.app/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  //const availableBeds = 20;
  const totalBedCapacity = 50;

  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/inpatient/add" element={<AddNewInpatient />} />
          <Route path="/outpatient/add" element={<AddNewOutpatient />} />
          <Route path="/inpatients" element={<InPatients />} />
          <Route path="/archivedPatients" element={<PatientsArchive />} />
          <Route path="/outpatients" element={<OutPatients />} />
          <Route
            path="/dashboard"
            element={
              <BigDataChart
                totalInpatients={10}
                totalOutpatients={5}
                totalDoctors={3}
              />
            }
          />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;

//hello
