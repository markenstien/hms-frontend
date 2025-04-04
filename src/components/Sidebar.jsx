import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor, FaBedPulse } from "react-icons/fa6";
import {
  FaFileArchive,
  FaHospital,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, whoIs } from "./Routers";


const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;
const userAuth = whoIs();


const Sidebar = () => {
  const [show, setShow] = useState(false);

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

  const gotoAddNewUser = () => {
    navigateTo("/user/list");
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

    console.log(userAuth);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("auth-details");
    document.cookie = "adminToken=; Max-Age=0; path=/";
    toast.success('Logged out successfully');
    navigateTo("/login", { replace: true });

    // try {
    //   const res = await axios.get(
    //     `${apiBaseURL}/api/v1/user/admin/logout`,
    //     { withCredentials: true }
    //   );

    //   toast.success(res.data.message);
     
    // } catch (err) {
    //   toast.error(err.response?.data?.message || "Logout failed");

    // }
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

  const hasAuth = isAuthenticated();

  const accessGroup = (accessGroup) => {
    var navlList = [];
    switch(accessGroup) {
      case 'Doctor' :
      case 'Nurse' : 
        navlList = [
            <div onClick={gotoHome} className="link-item">
              <TiHome
                onMouseEnter={(e) => handleMouseEnter(e, "Home")}
                onMouseLeave={handleMouseLeave}
              />
              Dashboard
            </div>,
            <div onClick={gotoInPatients} className="link-item">
              <FaBedPulse
                onMouseEnter={(e) => handleMouseEnter(e, "In Patients")}
                onMouseLeave={handleMouseLeave}
              />
              In Patients
            </div>,
            <div onClick={gotoOutPatients} className="link-item">
              <FaBedPulse
                onMouseEnter={(e) => handleMouseEnter(e, "Out Patients")}
                onMouseLeave={handleMouseLeave}
              />
              Out Patients
            </div>
        ];
      break;
      case 'Admin' :
        navlList = [
          <div onClick={gotoHome} className="link-item">
              <TiHome
                onMouseEnter={(e) => handleMouseEnter(e, "Home")}
                onMouseLeave={handleMouseLeave}
              />
              Dashboard
            </div>,
          <div onClick={gotoWards} className="link-item">
            <FaHospital
              onMouseEnter={(e) => handleMouseEnter(e, "Wards")}
              onMouseLeave={handleMouseLeave}
            />
            Wards
          </div>,

          <div onClick={gotoAddNewUser} className="link-item">
            <FaUserDoctor
              onMouseEnter={(e) => handleMouseEnter(e, "User")}
              onMouseLeave={handleMouseLeave}
            />
            User
          </div>,

          <div onClick={gotoPatientsArchive} className="link-item">
            <FaFileArchive
              onMouseEnter={(e) => handleMouseEnter(e, "Archived Patients")}
              onMouseLeave={handleMouseLeave}
            />
            Archived Patients
          </div>
        ];
      break;
    }

    return navlList;
  }
  return (
    <>
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
        style={!hasAuth ? { display: "none" } : { display: "flex" }}
        className={hasAuth ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          {hasAuth ? (<div>
            <img src={userAuth.docAvatar.url || ''} style={{width: '120px', height:'120px',borderRadius: '100%' , border:'1px solid white', padding:'10px'}}></img>
          </div>) : ('')}
          <div><strong>{userAuth.role}</strong> - {userAuth.lastName}</div>
          {accessGroup(userAuth.role)}

          <div onClick={handleLogout} className="link-item">
            <RiLogoutBoxFill
              onClick={handleLogout}
              onMouseEnter={(e) => handleMouseEnter(e, "Logout")}
              onMouseLeave={handleMouseLeave}
            />
            Logout
          </div>
        </div>
      </nav>

      <div
        style={hasAuth ? { display: "flex" } : { display: "none" }}
        className="wrapper"
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};



export default Sidebar;
