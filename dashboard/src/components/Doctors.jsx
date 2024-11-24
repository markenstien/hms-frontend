import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";

const departmentChoices = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Radiology",
  "ENT",
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [doctorImage, setDoctorImage] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // state for delete confirmation

  // dfetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "https://hmscore1-backend.vercel.app/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, []);

  const openPopup = (doctor) => {
    setEditingDoctor(doctor);
    setUpdatedDoctor(doctor);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingDoctor(null);
    setDoctorImage(null);
  };

  const handleChange = (e) => {
    setUpdatedDoctor({ ...updatedDoctor, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setDoctorImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("firstName", updatedDoctor.firstName);
    formData.append("lastName", updatedDoctor.lastName);
    formData.append("phone", updatedDoctor.phone);
    formData.append("email", updatedDoctor.email);
    formData.append("doctorDepartment", updatedDoctor.doctorDepartment);
    if (doctorImage) {
      formData.append("docAvatar", doctorImage);
    }

    // pang debug: check contents of formData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const { data } = await axios.put(
        `https://hmscore1-backend.vercel.app/api/v1/user/doctors/${editingDoctor._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Doctor updated successfully!");
      setDoctors(
        doctors.map((doc) => (doc._id === data.doctor._id ? data.doctor : doc))
      );
      closePopup();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://hmscore1-backend.vercel.app/api/v1/user/doctors/${editingDoctor._id}`,
        { withCredentials: true }
      );
      toast.success("Doctor deleted successfully!");
      setDoctors(doctors.filter((doc) => doc._id !== editingDoctor._id));
      closePopup();
      setIsDeleteConfirmOpen(false); // close the confirmation modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed!");
    }
  };

  const openDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

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
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="Doctor's Avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Birth: <span>{element.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    PhilSys or NIC: <span>{element.philsysornic}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                  <button
                    className="update-btn"
                    onClick={() => openPopup(element)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1>No Doctors Found!</h1>
          )}
        </div>

        {isPopupOpen && editingDoctor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Update Doctor Information</h2>
              <input
                type="file"
                name="docAvatar"
                onChange={handleImageChange}
                accept="image/*"
              />
              <input
                type="text"
                name="firstName"
                value={updatedDoctor.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={updatedDoctor.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                type="text"
                name="phone"
                value={updatedDoctor.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="email"
                value={updatedDoctor.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <select
                name="doctorDepartment"
                value={updatedDoctor.doctorDepartment}
                onChange={handleChange}
              >
                {departmentChoices.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <div className="popup-actions">
                <button className="save-btn" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={closePopup}>
                  Cancel
                </button>
                <button className="delete-btn" onClick={openDeleteConfirm}>
                  Delete Doctor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* delete Confirmation Popup */}
        {isDeleteConfirmOpen && (
          <div className="modal-overlay-confirmation">
            <div className="modal-content-confirmation">
              <h2>Are you sure you want to delete this doctor?</h2>
              <div className="popup-actions">
                <button className="delete-btn" onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button className="cancel-btn" onClick={closeDeleteConfirm}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Doctors;
