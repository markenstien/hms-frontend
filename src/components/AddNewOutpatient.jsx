import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { navigateToAddNewOutPatient, navigateToOutPatients } from "./Routers";
import ButtonLinkList from "./widget/ButtonLinkList";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;
const AddNewOutpatient = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const [doctors, setDoctors] = useState([]);

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
    insuranceProvider: "",
    policyNumber: "",
    appointmentDate: "",
    insuranceInformation : {
      provider : "",
      policyNumber : ""
    },
    patientConditionLevel : "",
    followUpNeeded: false,
    physician : {
      name: "",
      id: "",
      email:  "",
      philsysornic : "",
      doctorDepartment : ""
    },
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(
        `${apiBaseURL}/api/v1/outpatients/add`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message || "OutPatient Successfully Added!");
      console.log("Generated Policy Number:", response.data.policyNumber);
      // navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const DivMargin = ({height = '40'}) => {
    return (
      <div style={{
        height : height + 'px'
      }}>
  
      </div>
    );
  }

  const handlePhysician = (e) => {
    const { name, value } = e.target;
    const doctor = doctors[value];

    const physicianData = {
      id: doctor._id,
      name:  doctor.firstName + ' ' + doctor.lastName,
      email:  doctor.email,
      philsysornic : doctor.philsysornic,
      doctorDepartment : doctor.doctorDepartment,
    };

    setFormData((prevData) => ({
      ...prevData,
      [name]: physicianData,
    }));

    console.log([
      'form-data-physician',
      formData
    ]);
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/user/doctors`,
          { withCredentials: true }
        );

        console.log([
          'doctors',
          data.doctors
        ]);
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    }

    fetchDoctors();
  }, []);

  return (
    <>
      <section className="page">
        <div className="flex">
          <div className="flex-1">
            <h1 className="form-title">Out Patient - Add Record</h1>
          </div>

          <div className="flex-2">
              <ButtonLinkList buttonList={[
                {
                    "textContent" : 'List',
                    "icon" : 'list',
                    'className' : 'button-link bg-primary',
                    'onClick' : navigateToOutPatients,
                },

                {
                    "textContent" : 'Add',
                    "icon" : 'add',
                    'onClick' : navigateToAddNewOutPatient,
                    'className' : 'button-link bg-primary'
                }
            ]}></ButtonLinkList>
          </div>
        </div>

        <div style={{width: '700px'}}>
            <form onSubmit={handleSubmit}>
              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Personal Information</div>
                </div>
                <div className="card-body">
                  <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Middle Name</label>
                    <input
                      type="text"
                      placeholder="Middle Name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Date of Birth</label>
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <DivMargin></DivMargin>
              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Admission Information</div>
                </div>
                <div className="card-body">
                  <div>
                    <label className="block mb-1 font-medium">Appointment Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Primary Health Concern</label>
                    <input
                      type="text"
                      placeholder="Primary Health Concern"
                      name="primaryHealthConcern"
                      value={formData.primaryHealthConcern}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Patient Condition Level</label>
                    <select
                        name="patientConditionLevel"
                        value={formData.patientConditionLevel}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                      >
                        <option value="">--Select</option>
                        <option value="Good">Good</option>
                        <option value="Serious">Serious</option>
                        <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Medical History</label>
                    <textarea
                      className="block w-full"
                      placeholder="Medical History"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      rows={3}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Current Medications</label>
                    <textarea
                      className="block w-full"
                      rows={3}
                      placeholder="Current Medications"
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Family Medical History</label>
                    <textarea
                      className="block w-full"
                      rows={3}
                      placeholder="Family Medical History"
                      name="familyMedicalHistory"
                      value={formData.familyMedicalHistory}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Attending Physician</label>
                    {
                      doctors.length < 0 ? (<h1>No attending doctors available</h1>) : (
                        <select
                          name="physician"
                          value={formData.physician.index}
                          onChange={handlePhysician}
                          className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                        >
                          <option value="">Select</option>
                          {doctors.map((doctor, index) => {
                            return <option value={index}>{doctor.doctorDepartment} - {doctor.firstName} {doctor.lastName}</option>
                          })}
                        </select>
                      )
                    }
                  </div>

                  <div className="form-group">
                    <label className="">
                      Follow-up Needed:
                      <input
                        style={{width:'15px', height:'15px'}}
                        type="checkbox"
                        name="followUpNeeded"
                        checked={formData.followUpNeeded}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <DivMargin></DivMargin>
              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Contact Information</div>
                </div>

                <div className="card-body">
                  {/* Contact Information */}

                  <div>
                    <label className="block mb-1 font-medium">Mobile</label>
                    <input
                      type="text"
                      placeholder="Mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Landline</label>
                    <input
                      type="text"
                      placeholder="Landline"
                      name="landline"
                      value={formData.landline}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Address</label>
                    <textarea
                      className="block w-full"
                      rows={3}
                      placeholder="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <DivMargin>

              </DivMargin>
              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Insurance Provider</div>
                </div>

                <div className="card-body">
                  <div>
                      <label className="block mb-1 font-medium">Insurance Provider</label>
                      <input type="text" name="insuranceInformation.provider" onChange={handleChange} value={formData.insuranceInformation.provider}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Policy Number</label>
                      <input name="insuranceInformation.policyNumber" onChange={handleChange} value={formData.insuranceInformation.policyNumber}></input>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn">
                Add Out Patient
              </button>
            </form>
        </div>
      </section>
    </>
  );
};

export default AddNewOutpatient;
