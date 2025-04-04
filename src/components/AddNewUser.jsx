import React, { useContext, useState } from "react";
import { Context } from "../main";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuthenticated, navigateToAddInPatient, navigateToAddUser, navigateToUsers } from "./Routers";
import ButtonLinkList from "./widget/ButtonLinkList";
import { departmentsArray, userAccessTypes, userPositions } from "./helpers/UserTypeHelpers";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

const AddNewUser = () => {

  // State variables for storing admin details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [philsysornic, setPhilsysornic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [userAccess, setUserAccess] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");

  const DivMargin = ({height = '40'}) => {
    return (
      <div style={{
        height : height + 'px'
      }}>
  
      </div>
    );
  }

  
    const handleAvatar = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        setDocAvatarPreview(reader.result);
        setDocAvatar(file);
        };
    };

  // Handler for adding new admin when the form is submitted
  const handleAddNewAdmin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const formData = new FormData();
      // Sending a POST request to the server to add a new adminconst formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("philsysornic", philsysornic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("password", password);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("userAccess", userAccess);
      formData.append("userPosition", userPosition);
      formData.append("docAvatar", docAvatar);

      const response = await axios.post(
        `${apiBaseURL}/api/v1/user/addnew`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.message);
      navigateTo("/user/list");
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const fetchUserPositions = () => {
        switch(userAccess) {
            case 'Administrative' : 
                return userPositions.administrative;
            case 'staff' : 
                return userPositions.staff;
            default : 
                return [];
        }
    }


  if (!isAuthenticated()) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="page">
        <div className="flex">
            <div className="flex-1">
            <h1 className="form-title">User - Add New</h1>
            </div>

            <div className="flex-2">
                <ButtonLinkList buttonList={[
                {
                    "textContent" : 'List',
                    "icon" : 'list',
                    'className' : 'button-link bg-primary',
                    'onClick' : navigateToUsers,
                },

                {
                    "textContent" : 'Add',
                    "icon" : 'add',
                    'onClick' : navigateToAddUser,
                    'className' : 'button-link bg-primary'
                }
            ]}></ButtonLinkList>
            </div>
        </div>

        <div style={{width: '600px'}}>
            <div className="card-main">
                <div className="card-header">
                    <div className="card-title">Add User Form</div>
                </div>

                <div className="card-body">
                    <form onSubmit={handleAddNewAdmin}>
                        <div className="flex">
                            <div className="flex-1" style={{marginRight:'12px'}}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <input
                            type="date"
                            placeholder="Date of Birth"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />

                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <div style={{textAlign:'center', width: '250px', margin:'0px auto'}}>
                            {
                                docAvatarPreview == '' ? '': (
                                    <div style={{marginTop:'25px'}}>
                                        <img
                                            src={
                                            docAvatarPreview
                                                ? `${docAvatarPreview}`
                                                : "/noAvatarHolder.jpg"
                                            }
                                            alt="Doctor's Avatar"
                                            className="profileImage"
                                        />
                                    </div>
                                )
                            }
                            <div>
                                <label htmlFor="#">Upload Profile Picture</label>
                                <input
                                    type="file"
                                    onChange={handleAvatar}
                                    className=""
                                />
                            </div>
                        </div>
                        
                        <DivMargin></DivMargin>

                        <div>
                            <label htmlFor="#">User Access</label>
                            <select
                                value={userAccess}
                                onChange={(e) => setUserAccess(e.target.value)}
                                required
                            >
                                <option value="">--Select</option>
                                {userAccessTypes.map((value) => <option value={value}>{value}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="#">Position</label>
                            <select
                                value={userPosition}
                                onChange={(e) => setUserPosition(e.target.value)}
                                required
                            >
                                <option value="">--Select</option>
                                {fetchUserPositions().map((value,index) => <option value={value}>{value}</option>)}
                            </select>
                        </div>

                        {userPosition == 'Doctor' ? (<div>
                            <label htmlFor="#">Doctors Department</label>
                            <select
                                value={doctorDepartment}
                                onChange={(e) => setDoctorDepartment(e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departmentsArray.map((element, index) => (
                                <option key={index} value={element}>
                                    {element}
                                </option>
                                ))}
                            </select>
                        </div>) : ''}

                        <div>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                        <input
                            type="number"
                            placeholder="PhilSys or NIC"
                            value={philsysornic}
                            onChange={(e) => setPhilsysornic(e.target.value)}
                        />
                        
                        </div>
                        <div>
                        
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>

                        <button type="submit" className="button-link bg-success">Add New Admin</button>
                    </form>
                </div>
            </div>
        </div>

      </section>
    </>
  );
};

export default AddNewUser;
