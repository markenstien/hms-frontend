import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewOutpatient = () => {
    const { isAuthenticated } = useContext(Context);
    const navigateTo = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        mobile: '',
        landline: '',
        email: '',
        address: '',
        primaryHealthConcern: '',
        medicalHistory: '',
        currentMedications: '',
        familyMedicalHistory: '',
        insuranceProvider: '',
        policyNumber: '',
        appointmentDate: '',
        followUpNeeded: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/v1/outpatients/add',
                formData, 
                { withCredentials: true});
                
            toast.success(response.data.message || "OutPatient Successfully Added!");
            // Optional... display the generated policy number
            console.log("Generated Policy Number:", response.data.policyNumber);
            navigateTo('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <section className="page">
                <div className="container form-component add-admin-form">
                    <img src="/aboutlogo.png" alt="logo" className="logo" />
                    <h1 className="form-title">Add New Outpatient</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Outpatient Information */}
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
                            name="insuranceProvider"
                            value={formData.insuranceProvider}
                            onChange={handleChange}
                        />

                        {/* Appointment Date */}
                        
                        <input
                            type="date"
                            placeholder="Appointment Date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            required
                        />

                        <div className="form-group">
                            <label className="checkbox-label">
                                Follow-up Needed:
                                <input
                                    type="checkbox"
                                    name="followUpNeeded"
                                    checked={formData.followUpNeeded}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                            </label>
                        </div>

                        <button type="submit">Add Outpatient</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AddNewOutpatient;
