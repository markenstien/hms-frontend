import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewAdmin = () => {
  // Accessing authentication context to check if the user is logged in
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  // State variables for storing admin details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [philsysornic, setPhilsysornic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  // Handler for adding new admin when the form is submitted
  const handleAddNewAdmin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Sending a POST request to the server to add a new admin
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/admin/addnew",
        { 
          firstName, 
          lastName, 
          email, 
          phone, 
          philsysornic, 
          dob, 
          gender, 
          password, 
          role: "Admin" 
        },
        {
          withCredentials: true, // Include credentials in the request
          headers: { "Content-Type": "application/json" }, // Set content type
        }
      );
      // Show success message upon successful addition
      toast.success(response.data.message);
      setIsAuthenticated(true); // Update authentication state
      navigateTo("/"); // Navigate to home after successful admin addition
    } catch (error) {
      // Show error message if something goes wrong
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Redirect to the login page if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="page">
        <div className="container form-component add-admin-form">
          <img src="/aboutlogo.png" alt="logo" className="logo" />
          <h1 className="form-title">Add New Admin</h1>

          <form onSubmit={handleAddNewAdmin}>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} // Update state on input change
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} // Update state on input change
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update state on input change
              />
              <input
                type="number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // Update state on input change
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="PhilSys or NIC"
                value={philsysornic}
                onChange={(e) => setPhilsysornic(e.target.value)} // Update state on input change
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)} // Update state on input change
              />
            </div>
            <div>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state on input change
              />
            </div>

            <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
              <button type="submit">Add New Admin</button> {/* Submit button for the form */}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddNewAdmin;
