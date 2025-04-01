import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import ButtonLinkList from "./widget/ButtonLinkList";
import { isAuthenticated, navigateToAddInPatient, navigateToInPatients } from "./Routers";
import DataTable from "react-data-table-component";

const InPatients = () => {
  const [inpatients, setInPatients] = useState([]); // State to store inpatients list
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({}); // State to store form data for editing

  const [doctors, setDoctors] = useState([]);
  const [wards, setWards] = useState([]);

  const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

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

  const handleWard = (e) => {
    const { name, value } = e.target;
    let ward = {};

    for(let i in wards) {
      if(wards[i]._id == value) {
        ward = wards[i];
      }
    }

    const wardData = {
      id: ward._id,
      roomNumber:  ward.roomNumber,
      loadCount:  ward.loadCount?? 0 + 1,
      capacity : ward.capacity,
      roomModel : ward.roomModel,
    };

    setFormData((prevData) => ({
      ...prevData,
      [name]: wardData,
    }));

    console.log([
      'form-data-physician',
      formData
    ]);
  }
  // Fetch inpatients from the API
  useEffect(() => {
    const fetchInPatients = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseURL}/api/v1/inpatients/inpatients`,
          { withCredentials: true }
        );
        setInPatients(data.inpatients); // Set inpatients in state
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch inpatients"
        ); // Show error message
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
    fetchDoctors();
    fetchInPatients(); // Call the fetch function
  }, []); // Empty dependency array means it runs once after the component mounts

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter inpatients based on the search query
  const filteredInpatients = inpatients.filter((inpatient) =>
    `${inpatient.firstName} ${inpatient.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to discharge an inpatient
  const dischargeInpatient = async (patientId) => {
    try {
      const response = await axios.post(
        `${apiBaseURL}/api/v1/inpatients/discharge/${patientId}`,
        { dischargeDate: new Date().toISOString() },
        { withCredentials: true }
      );
      toast.success(response.data.message); // Show success message
      setInPatients((prev) =>
        prev.filter((inpatient) => inpatient.patientId !== patientId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to discharge inpatient"
      ); // Show error message
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is a nested property
    if (name.includes(".")) {
      const [mainField, nestedField] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [mainField]: {
          ...prev[mainField],
          [nestedField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

  // Function to open the update modal
  const openUpdateModal = (inpatient) => {
    setFormData(inpatient);

    const dob = new Date(inpatient.dob);
    const admissionDate = new Date(inpatient.admissionDate);
    setFormData({
        ...inpatient,
        dob : formatDate(dob),
        admissionDate : formatDate(admissionDate)
    });
    
    setShowModal(true);
  };

  // Function to handle form submission for updating inpatient data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiBaseURL}/api/v1/inpatients/update/${formData.patientId}`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message); // Show success message
      setInPatients((prev) =>
        prev.map((inpatient) =>
          inpatient.patientId === formData.patientId ? formData : inpatient
        )
      );
      setShowModal(false); // Close the modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update inpatient"
      ); // show error message
    }
  };

  const InPatientsTable = ({inpatients= []}) => {
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
        name : 'Ward',
        selector : row => row.wardRoomNumber
      },
      {
        name : 'Action',
        selector : row => row.action
      }
    ];
  
    var data = [];
      for(let i = 0; i < inpatients.length; i++) {
          data.push({
              fullname: inpatients[i].lastName + ' ' + inpatients[i].firstName,
              primaryHealthConcern: inpatients[i].primaryHealthConcern,
              patientConditionLevel: inpatients[i].patientConditionLevel,
              physicianName : inpatients[i].physician.name,
              wardRoomNumber : inpatients[i].ward.roomNumber,
              action : <div onClick={() => openUpdateModal(inpatients[i])}>
                <button className="button-link bg-success">Edit</button>
              </div>
          });
      }
    return (
      <DataTable pagination className="dataTable" columns={columns} data={data}>
      
      </DataTable>
    );
  }

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
                <h1 className="form-title">In-Patients</h1>
            </div>

            <div className="flex-2">
                <ButtonLinkList buttonList={[
                    {
                        "textContent" : 'List',
                        "icon" : 'list',
                        'className' : 'button-link bg-primary',
                        'onClick' : navigateToInPatients,
                    },

                    {
                        "textContent" : 'Add',
                        "icon" : 'add',
                        'onClick' : navigateToAddInPatient,
                        'className' : 'button-link bg-primary'
                    }
                ]}></ButtonLinkList>
            </div>
        </div>

        {/* Search Box */}
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
        {/* Modal for Updating Inpatient Data */}
        {showModal && (
          <div className="modal-overlay" style={{zIndex: '10000'}}>
            <div className="modal-content">
              <h2>Edit Inpatient Data</h2>
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
                            value={formData.physician.id}
                            onChange={handlePhysician}
                            className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                          >
                            <option value="">Select</option>
                            {doctors.map((doctor, index) => {
                              // let isSelected = formData.physician
                              return <option value={doctor._id}>{doctor.doctorDepartment} - {doctor.firstName} {doctor.lastName}</option>
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
                              value={formData.ward.id}
                              onChange={handleWard}
                              className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                            >
                              <option value="">Select</option>
                              {wards.map((ward) => {
                                return <option value={ward._id}>{ward.roomModel} - {ward.roomNumber}</option>
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

        <div className="card-main">
          <div className="card-header">
            <div className="card-title">In Patients</div>
          </div>

          <div className="card-body">
            <InPatientsTable inpatients={filteredInpatients}></InPatientsTable>
          </div>
        </div>
      </section>
    </>
  );
};


export default InPatients;
