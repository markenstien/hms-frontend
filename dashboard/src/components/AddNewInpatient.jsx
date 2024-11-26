import React, { useContext, useState } from "react";
import { Context } from "../main";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewInpatient = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    mobile: "",
    landline: "",
    email: "",
    address: "",
    primaryHealthConcern: "",
    medicalHistory: "",
    currentMedications: "",
    familyMedicalHistory: "",
    insuranceInformation: {
      provider: "",
      policyNumber: "",
    },
    admissionDate: "",
    wardRoomPreference: "",
    expectedLengthOfStay: "",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
    guardianDetails: {
      name: "",
      relationship: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://hmscore1-backend.vercel.app/api/v1/inpatients/add",
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // redirect to login if not authenticated
  }

  return (
    <>
      <section className="page">
        <div className="container form-component add-admin-form">
          <img src="/aboutlogo.png" alt="logo" className="logo" />
          <h1 className="form-title">Add New Inpatient</h1>
          <form onSubmit={handleSubmit}>
            {/* Inpatient Information */}
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Contact Information */}
            <input
              type="text"
              placeholder="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Landline"
              name="landline"
              value={formData.landline}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Address & Health Details */}
            <textarea
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
            <input
              type="text"
              placeholder="Primary Health Concern"
              name="primaryHealthConcern"
              value={formData.primaryHealthConcern}
              onChange={handleChange}
              required
            />
            <textarea
              placeholder="Medical History"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
            ></textarea>
            <textarea
              placeholder="Current Medications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
            ></textarea>
            <textarea
              placeholder="Family Medical History"
              name="familyMedicalHistory"
              value={formData.familyMedicalHistory}
              onChange={handleChange}
            ></textarea>

            {/* Insurance Information */}
            <input
              type="text"
              placeholder="Insurance Provider"
              name="insuranceInformation.provider"
              value={formData.insuranceInformation.provider}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Policy Number"
              name="insuranceInformation.policyNumber"
              value={formData.insuranceInformation.policyNumber}
              onChange={handleChange}
            />

            {/* Admission Information */}
            <input
              type="date"
              placeholder="Admission Date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Ward/Room Preference"
              name="wardRoomPreference"
              value={formData.wardRoomPreference}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Expected Length of Stay (days)"
              name="expectedLengthOfStay"
              value={formData.expectedLengthOfStay}
              onChange={handleChange}
            />

            {/* Emergency Contact & Guardian Details */}
            <h3>Emergency Contact</h3>
            <input
              type="text"
              placeholder="Name"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              name="emergencyContact.contactNumber"
              value={formData.emergencyContact.contactNumber}
              onChange={handleChange}
              required
            />

            <h3>Guardian Details</h3>
            <input
              type="text"
              placeholder="Name"
              name="guardianDetails.name"
              value={formData.guardianDetails.name}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Relationship"
              name="guardianDetails.relationship"
              value={formData.guardianDetails.relationship}
              onChange={handleChange}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Inpatient"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddNewInpatient;
