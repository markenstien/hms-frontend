import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor, FaBedPulse } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  FaWalking,
  FaFileArchive,
  FaClinicMedical,
  FaHospital,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [tooltip, setTooltip] = useState(""); // State to store tooltip text
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 }); // State to store tooltip position
  const [hideTimeout, setHideTimeout] = useState(null); // To track timeout ID

  const navigateTo = useNavigate();

  const gotoHome = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };
  const gotoAddNewInpatient = () => {
    navigateTo("/inpatient/add");
    setShow(!show);
  };
  const gotoAddNewOutpatient = () => {
    navigateTo("/outpatient/add");
    setShow(!show);
  };
  const gotoInPatients = () => {
    navigateTo("/inpatients");
    setShow(!show);
  };

  const gotoWards = () => {
    navigateTo("/ward/");
    setShow(!show);
  }
  const gotoPatientsArchive = () => {
    navigateTo("/archivedPatients");
    setShow(!show);
  };
  const gotoOutPatients = () => {
    navigateTo("/outpatients");
    setShow(!show);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "https://hmscore1-backend.vercel.app/api/v1/user/admin/logout",
        { withCredentials: true }
      );

      toast.success(res.data.message);
  
      localStorage.removeItem("adminToken");
      
      document.cookie = "adminToken=; Max-Age=0; path=/";
  

      navigateTo("/login", { replace: true });
      setIsAuthenticated(false);
    
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");

    }
  };
  
  


  

  // Handle tooltip position and content on hover
  const handleMouseEnter = (event, text) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip(text);
    setTooltipPos({ top: rect.top, left: rect.right + 10 });

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    const timeoutId = setTimeout(() => {
      setTooltip("");
    }, 2000); //2secondsaaa

    setHideTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    setTooltip("");

    // Clear any active timeout when the mouse leaves
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  };

  return (
    <>
      {/* Tooltip */}
      {tooltip && (
        <span
          className="tooltip"
          style={{
            position: "absolute",
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            backgroundColor: "white",
            color: "#408026",
            padding: "5px",
            borderRadius: "4px",
            zIndex: 1000,
            whiteSpace: "nowrap",
            border: "1px solid #408026",
          }}
        >
          {tooltip}
        </span>
      )}

      {/* Sidebar */}
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome
            onClick={gotoHome}
            onMouseEnter={(e) => handleMouseEnter(e, "Home")}
            onMouseLeave={handleMouseLeave}
          />
          <FaBedPulse
            onClick={gotoAddNewInpatient}
            onMouseEnter={(e) => handleMouseEnter(e, "Add New Inpatient")}
            onMouseLeave={handleMouseLeave}
          />
          <FaWalking
            onClick={gotoAddNewOutpatient}
            onMouseEnter={(e) => handleMouseEnter(e, "Add New Outpatient")}
            onMouseLeave={handleMouseLeave}
          />
          <FaHospital
            onClick={gotoInPatients}
            onMouseEnter={(e) => handleMouseEnter(e, "Inpatients")}
            onMouseLeave={handleMouseLeave}
          />
          <FaHospital
            onClick={gotoWards}
            onMouseEnter={(e) => handleMouseEnter(e, "Wards")}
            onMouseLeave={handleMouseLeave}
          />

          <FaClinicMedical
            onClick={gotoOutPatients}
            onMouseEnter={(e) => handleMouseEnter(e, "Outpatients")}
            onMouseLeave={handleMouseLeave}
          />
          <FaUserDoctor
            onClick={gotoDoctorsPage}
            onMouseEnter={(e) => handleMouseEnter(e, "Doctors")}
            onMouseLeave={handleMouseLeave}
          />
          <MdAddModerator
            onClick={gotoAddNewAdmin}
            onMouseEnter={(e) => handleMouseEnter(e, "Add New Admin")}
            onMouseLeave={handleMouseLeave}
          />
          <IoPersonAddSharp
            onClick={gotoAddNewDoctor}
            onMouseEnter={(e) => handleMouseEnter(e, "Add New Doctor")}
            onMouseLeave={handleMouseLeave}
          />
          <FaFileArchive
            onClick={gotoPatientsArchive}
            onMouseEnter={(e) => handleMouseEnter(e, "Archived Patients")}
            onMouseLeave={handleMouseLeave}
          />
          <RiLogoutBoxFill
            onClick={handleLogout}
            onMouseEnter={(e) => handleMouseEnter(e, "Logout")}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </nav>

      <div
        style={isAuthenticated ? { display: "flex" } : { display: "none" }}
        className="wrapper"
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
