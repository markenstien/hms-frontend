import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { elements } from "chart.js";

const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;


const AddNewInpatient = () => {
  
  const { isAuthenticated } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // redirect to login if not authenticated
  }

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
    patientConditionLevel: "",
    familyMedicalHistory: "",
    insuranceInformation: {
      provider: "",
      policyNumber: "",
    },
    physician : {
      name: "",
      id: "",
      email:  "",
      philsysornic : "",
      doctorDepartment : ""
    },

    ward : {
      id: "",
      roomNumber : "",
      model : "",
      loadCount : "",
      capacity: ""
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

  //api
  const [patients, setPatients] = useState([]);
  const [patientIsLoading, setPatientIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [dotorIsLoading, setDoctorIsLoading] = useState(false);
  const [wards, setWards] = useState([]);
  

  // dfetch doctors from the API
  useEffect(() => {
    const fetchPatients = async () => {
      setPatientIsLoading(true);
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/inpatients/inpatients`,
          { withCredentials: true }
        );
        console.log([
          'patients',
          data.inpatients
        ]);
        setPatients(data.inpatients);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
      setPatientIsLoading(false);
    };

    const fetchDoctors = async () => {
      setDoctorIsLoading(true);
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
      setDoctorIsLoading(false);
    }

    const fetchWards = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/ward/`,
          { withCredentials: true }
        );
        console.log([
          'wards',
          data.wards
        ]);
        setWards(data.wards);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };

    fetchWards();
    fetchPatients();
    fetchDoctors();
  }, []);

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

  const handleWard = (e) => {
    const { name, value } = e.target;
    const ward = wards[value];

    const physicianData = {
      id: ward._id,
      roomNumber:  ward.roomNumber,
      loadCount:  ward.loadCount?? 0 + 1,
      capacity : ward.capacity,
      roomModel : ward.roomModel,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiBaseURL}/api/v1/inpatients/add`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigateTo("/inpatients");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <section className="page">
        <div style={{width: '700px'}}>
            <div className="flex">
                <div className="flex-1">
                  <h1 className="form-title">In Patient - Add Record</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Personal Information</div>
                </div>
                <div className="card-body">
                  <div>
                    <label className="block mb-1 font-medium">First Name</label>
                    <input name="firstName" onChange={handleChange} value={formData.firstName}></input>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input name="lastName" onChange={handleChange} value={formData.lastName}></input>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Middle Name</label>
                    <input name="middleName" onChange={handleChange} value={formData.middleName}></input>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                    >
                        <option value="">--Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                  <label className="block mb-1 font-medium">Date of Birth</label>
                  <input type="date" name="dob" onChange={handleChange} value={formData.dob}></input>
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
                      <label className="block mb-1 font-medium">Admission Date</label>
                      <input type="date" name="admissionDate" onChange={handleChange} value={formData.admissionDate}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Health Concern</label>
                      <input name="primaryHealthConcern" onChange={handleChange} value={formData.primaryHealthConcern}></input>
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
                      <label className="block mb-1 font-medium">Current Medications</label>
                      <textarea name="currentMedications" id="" rows={3}  className="block w-full" 
                        value={formData.currentMedications}
                        onChange={handleChange}></textarea>
                  </div>
                  <div>
                      <label className="block mb-1 font-medium">Medical History</label>
                      <textarea name="medicalHistory" id="" rows={3}  className="block w-full" 
                        value={formData.medicalHistory}
                        onChange={handleChange}></textarea>
                  </div>
                  <div>
                      <label className="block mb-1 font-medium">Family Medical History</label>
                      <textarea name="familyMedicalHistory" id="" rows={3}  className="block w-full" 
                        value={formData.familyMedicalHistory}
                        onChange={handleChange}></textarea>
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
                  <div className="flex">
                    <div className="flex-1">
                      <div>
                          <label className="block mb-1 font-medium">Ward</label>
                          {wards.length < 0 ? (<h1>No attending doctors available</h1>) : (
                            <select
                            name="ward"
                            value={formData.physician.index}
                            onChange={handleWard}
                            className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                          >
                            <option value="">Select</option>
                            {wards.map((ward, index) => {
                              return <option value={index}>{ward.roomModel} - {ward.roomNumber}</option>
                            })}
                          </select>
                          )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div>
                          <label className="block mb-1 font-medium">Length Of Stay</label>
                          <input name="expectedLengthOfStay" onChange={handleChange} value={formData.expectedLengthOfStay}></input>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              <DivMargin></DivMargin>

              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Patient Insurance</div>
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

              <DivMargin></DivMargin>

              <div className="card-main">
                <div className="card-header">
                  <div className="card-title">Contacts</div>
                </div>

                <div className="card-body">
                  <div>
                      <label className="block mb-1 font-medium">Mobile Number</label>
                      <input type="text" name="mobile" onChange={handleChange} value={formData.mobile}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Email</label>
                      <input name="email" onChange={handleChange} value={formData.email}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Address</label>
                      <textarea name="address" onChange={handleChange} value={formData.address} rows={4} className="w-full"></textarea>
                  </div>

                  <DivMargin height="10"></DivMargin>
                  
                  <h3>Emergency Contact</h3>

                  <div>
                      <label className="block mb-1 font-medium">Name</label>
                      <input type="text" name="emergencyContact.name" onChange={handleChange} value={formData.emergencyContact.name}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Relation</label>
                      <input name="emergencyContact.relationship" onChange={handleChange} value={formData.emergencyContact.relationship}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Contact</label>
                      <input name="emergencyContact.contactNumber" onChange={handleChange} value={formData.emergencyContact.contactNumber}></input>
                  </div>

                  <DivMargin height="10"></DivMargin>
                  
                  <h3>Guardian</h3>

                  <div>
                      <label className="block mb-1 font-medium">Name</label>
                      <input type="text" name="guardianDetails.name" onChange={handleChange} value={formData.guardianDetails.name}></input>
                  </div>

                  <div>
                      <label className="block mb-1 font-medium">Relation</label>
                      <input name="guardianDetails.relationship" onChange={handleChange} value={formData.guardianDetails.relationship}></input>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? "Adding..." : "Add Inpatient"}
              </button>
            </form>
        </div>
      </section>
    </>
  );
};

const DivMargin = ({height = '40'}) => {
  return (
    <div style={{
      height : height + 'px'
    }}>

    </div>
  );
}

export default AddNewInpatient;
