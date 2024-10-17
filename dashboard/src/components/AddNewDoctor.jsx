import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [philsysornic, setPhilsysornic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false); // loading state

  const departmentsArray = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "Radiology",
    "ENT"
  ];

  const navigateTo = useNavigate();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent further submissions. Because I have a doubleclicking mouse problem

    setLoading(true); // set loading to true

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("philsysornic", philsysornic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("password", password);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("docAvatar", docAvatar);

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      toast.success(response.data.message); // show success message
      navigateTo("/"); // go to home page
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false); // reset loading state
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <div className="container form-component add-admin-form">
        <img src="/aboutlogo.png" alt="logo" className="logo" />
        <h1 className="form-title">Add New Doctor</h1>

        <form onSubmit={handleAddNewDoctor}>
          <div className="first-wrapper">
            <div className="profile-picture-container">
              <img
                src={docAvatarPreview ? `${docAvatarPreview}` : "/noAvatarHolder.jpg"}
                alt="Doctor's Avatar"
                className="profile-picture"
              />
              <input
                type="file"
                onChange={handleAvatar}
                className="upload-button"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <input
            type="number"
            placeholder="PhilSys or NIC"
            value={philsysornic}
            onChange={(e) => setPhilsysornic(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            value={doctorDepartment}
            onChange={(e) => setDoctorDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((element, index) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading}>Add New Doctor</button>
        </form>
      </div>
    </section>
  );
};

export default AddNewDoctor;
