import { useState, useEffect, useContext} from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ButtonLinkList from "./widget/ButtonLinkList";
import axios from "axios";
import { navigateToAddUser, navigateToUsers } from "./Routers";
import { departmentsArray, userAccessTypes, userPositions } from "./helpers/UserTypeHelpers";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;


// dfetch doctors from the API
const ListUser = () => {
    const [docAvatar, setDocAvatar] = useState("");
    const [docAvatarPreview, setDocAvatarPreview] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); 

    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        _id: "",
        firstName : "",
        lastName : "",
        dob : "",
        gender : "",
        userAccess : "",
        userPositions : "",
        doctorDepartment : "",
        email : "",
        phone : "",
        philsysornic : "",
        password : "",
        docAvatar : docAvatar
    });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Filter inpatients based on the search query
    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const { data } = await axios.get(
              `${apiBaseURL}/api/v1/user/list`,
              { withCredentials: true }
            );
            setUsers(data.users);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch doctors");
          }
        };
    
        fetchUsers();
      }, []);

          // Function to open the update modal
    const openUpdateModal = (user) => {
        console.log([
            'user',
            user
        ]);

        const dob = new Date(user.dob);

        setFormData({
            ...user,
            dob : formatDate(dob)
        });

        setDocAvatarPreview(user.docAvatar.url);
        console.log(user);
        setShowModal(true);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    const TableContent = ({users = []}) => {
        const columns = [
            {
                name: 'Name',
                selector: row => row.name,
            },
            {
                name: 'UserAccess',
                selector: row => row.userAccess,
            },
            {
                name: 'Position',
                selector: row => row.position,
            },
            {
                name: 'Phone',
                selector: row => row.phone,
            },
            {
                name: 'Email',
                selector: row => row.email,
            },
            {
                name: 'Edit',
                selector: row => row.action,
            }
        ];

        var data = [];
        for(let i = 0; i < users.length; i++) {
            data.push({
                id: users[i]._id,
                name: users[i].firstName + ' ' + users[i].lastName,
                userAccess: users[i].userAccess,
                position: users[i].userPosition,
                phone : users[i].phone,
                email : users[i].email,
                action: <div onClick={() => openUpdateModal(users[i])}>
                    <button className="button-link bg-success">Edit</button>
                </div>
            });
        }
    return (
            <>
                <DataTable
                    className="dataTable"
                    columns={columns}
                    data={data}
                    pagination
                />
            </>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();
        const formDataKeys = Object.keys(formData);

        formDataKeys.map((el, index) => {
            formDataToSubmit.append(el, formData[el]);
        });

        formDataToSubmit.append("docAvatar", docAvatar);

        const response = await axios.put(
            `${apiBaseURL}/api/v1/user/update/${formData._id}`,
            formDataToSubmit,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log([
            'update-response',
            response.data
        ]);
    };

    const handleAvatar = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setDocAvatarPreview(reader.result);
            setDocAvatar(file);
        };
    };


    const fetchUserPositions = () => {
        switch(formData.userAccess) {
            case 'Administrative' : 
                return userPositions.administrative;
            case 'Customer Service' : 
                return userPositions.customerService;
            default : 
                return [];
        }
    }
    return (
        <>
            <section className="page">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="form-title">User - List</h1>
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
                <input
                    type="text"
                    placeholder="Search"
                    className="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                        <div className="card-title">Wards</div>
                    </div>
                    <div className="card-body">
                        <TableContent users={filteredUsers}></TableContent>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="modal-overlay" style={{zIndex: '10000'}}>
                    <div className="modal-content">
                        <h2>Edit User Data</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="flex">
                                <div className="flex-1" style={{marginRight:'12px'}}>
                                    <input
                                        name="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        name="lastName"
                                        type="text"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
    
                            <input
                                name="dob"
                                type="date"
                                placeholder="Date of Birth"
                                value={formData.dob}
                                onChange={handleChange}
                            />
    
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
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
                                    name="userAccess"
                                    value={formData.userAccess}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">--Select</option>
                                    {userAccessTypes.map((value) => <option value={value}>{value}</option>)}
                                </select>
                            </div>
    
                            <div>
                                <label htmlFor="#">Position</label>
                                <select
                                    name="userPosition"
                                    value={formData.userPosition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">--Select</option>
                                    {fetchUserPositions().map((value,index) => <option value={value}>{value}</option>)}
                                </select>
                            </div>
    
                            {formData.userPosition == 'Doctor' ? (<div>
                                <label htmlFor="#">Doctors Department</label>
                                <select
                                    name="doctorDepartment"
                                    value={formData.doctorDepartment}
                                    onChange={handleChange}
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
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    name="phone"
                                    type="number"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                            <input
                                name="philsysornic"
                                type="number"
                                placeholder="PhilSys or NIC"
                                value={formData.philsysornic}
                                onChange={handleChange}
                            />
                            
                            </div>
                            <div>
                            
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            </div>
    
                            <div className="flex">
                                <button type="submit" className="button-link bg-success">Update</button>
                                    <div style={{width:'15px'}}></div>
                                <button type="submit" className="button-link bg-primary" onClick={() => {
                                    setShowModal(false)
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );


    

}

export default ListUser;