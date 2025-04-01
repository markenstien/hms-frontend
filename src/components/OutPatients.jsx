import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ButtonLinkList from "./widget/ButtonLinkList";
import { navigateToAddNewOutPatient, navigateToOutPatients } from "./Routers";
import DataTable from "react-data-table-component";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

const OutPatients = () => {
  const [outpatients, setOutPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);

  const { isAuthenticated } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ insuranceInformation: {} });

  // Fetch outpatients from the API
  useEffect(() => {
    const fetchOutPatients = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/outpatients/outpatients`,
          { withCredentials: true }
        );
        setOutPatients(data.outpatients);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch outpatients"
        );
      }
    };

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
    fetchOutPatients();
  }, []);

  const handlePhysician = (e) => {
    const { name, value } = e.target;
    let doctor = {};

    for(let i in doctors) {
      if(doctors[i]._id == value) {
        doctor = doctors[i];
      }
    }
    // const doctor = doctors[value];

    const physicianData = {
      index : value,
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
      name,value
    ]);
  }


  // If not authenticated, redirect to login yes
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // filter outpatients based on the search query
  const filteredOutpatients = outpatients.filter((outpatient) =>
    `${outpatient.firstName} ${outpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("insuranceInformation.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insuranceInformation: {
          ...prev.insuranceInformation,
          [key]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // function to open the modal for updating outpatient data
  const openModal = (outpatient) => {
    setFormData({
      ...outpatient,
      insuranceInformation: outpatient.insuranceInformation || {},
    });

    const dob = new Date(outpatient.dob);
    const admissionDate = new Date(outpatient.admissionDate);
    setFormData({
        ...outpatient,
        dob : formatDate(dob),
        admissionDate : formatDate(admissionDate)
    });
    
    setShowModal(true);
  };

  // function to handle form submission for updating outpatient data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseURL}/api/v1/outpatients/update/${formData.patientId}`,
        formData,
        { withCredentials: true }
      );

      toast.success(response.data.message); // Show success toast

      // update the state with the updated outpatient
      setOutPatients((prev) =>
        prev.map((outpatient) =>
          outpatient.patientId === formData.patientId ? formData : outpatient
        )
      );

      setShowModal(false);
      setFormData({ insuranceInformation: {} });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update outpatient data"
      );
    }
  };

 
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

  const DataTableOutPatients = ({outpatients}) => {
    const columns = [
      {
        name: 'Name',
        selector: row => row.fullname,
      },
  
      {
        name: 'Health Concern',
        selector: row => row.primaryHealthConcern,
      },
      {
        name : 'Condition',
        selector : row => row.patientConditionLevel
      },
      {
        name: 'Attending Physician',
          selector: row => row.physicianName,
      },
      {
        name: 'Action',
        selector : row => row.action
      }
    ];
  
    var data = [];
      for(let i = 0; i < outpatients.length; i++) {
          data.push({
              fullname: outpatients[i].lastName + ' ' + outpatients[i].firstName,
              primaryHealthConcern: outpatients[i].primaryHealthConcern,
              patientConditionLevel: outpatients[i].patientConditionLevel ?? 'N/A',
              physicianName : outpatients[i].physician.name,
              action : <div onClick={() => openModal(outpatients[i])}>
                <button className="button-link bg-success">Edit</button>
              </div>
          });
      }
  
    return (<DataTable pagination className="dataTable" columns={columns} data={data} ></DataTable>);
  };

  const DivMargin = ({height = '40'}) => {
    return (
      <div style={{
        height : height + 'px'
      }}>
  
      </div>
    );
  }

  return (
    <>
      <section className="page">
        <div className="flex">
          <div className="flex-1">
            <h1 className="form-title">Out Patient</h1>
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

        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
          style={{
            padding: "8px",
            marginTop: `20px`,
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "400px",
          }}
        />

        <div className="card-main">
          <div className="card-header">
            <div className="card-title">Out Patients</div>
          </div>
          <div className="card-body">
            <DataTableOutPatients outpatients={filteredOutpatients}></DataTableOutPatients>
          </div>
        </div>
        {/* Modal for Updating Outpatient Data */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Outpatient Data</h2>
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
                          value={formData.physician.id}
                          onChange={handlePhysician}
                          className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                        >
                          <option value="">Select</option>
                          {doctors.map((doctor, index) => {
                            return <option value={doctor._id}>{doctor.doctorDepartment} - {doctor.firstName} {doctor.lastName}</option>
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

              <button type="submit" className="button-link bg-success" style={{marginTop: '40px', marginRight: '12px'}}>
                  Save Changes
                </button>

                <button type="submit" className="button-link bg-warning" style={{marginTop: '40px'}} onClick={() => {
                  setShowModal(false);
                }}>
                  Close
                </button>
            </form>
            </div>
          </div>
        )}
      </section>

    </>
  );
};


export default OutPatients;
