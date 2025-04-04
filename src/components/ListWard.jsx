import { useState, useEffect, useContext} from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ButtonLinkList from "./widget/ButtonLinkList";
import axios from "axios";
import { toast } from "react-toastify";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;


// dfetch doctors from the API
const ListWard = () => {
    const [wards, setWards] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        code : "",
        roomModel : "",
        roomNumber : "",
        roomStatus: "",
        capacity : "",
        availability : "",
        description : "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            `${apiBaseURL}/api/v1/ward/update/${formData._id}`,
            formData,
            { withCredentials: true }
          );
          toast.success(response.data.message);
          fetchWards();

          setIsShowModal(false);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
        //   setIsSubmitting(false);
        }
    }
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

    useEffect(() => {
        fetchWards();
    }, []);

      const openUpdateModal = (ward) => {
        setIsShowModal(true);
        setFormData(ward);
    }
    
    const TableContent = ({wards = []}) => {
        const columns = [
            {
                name: 'Code',
                selector: row => row.code,
            },
            {
                name: 'Room Number',
                selector: row => row.roomNumber,
            },
            {
                name: 'Model',
                selector: row => row.model,
            },
            {
                name: 'Capacity',
                selector: row => row.capacity,
            },
            {
                name: 'Load Count',
                selector: row => row.loadCount,
            },
            {
                name: 'Room Status',
                selector: row => row.roomStatus,
            },
            {
                name: 'AL',
                selector: row => row.roomAvailability,
            },
            {
                name: 'Descrption',
                selector: row => row.description,
            },
            {
                name: 'Action',
                selector: row => row.action,
            },
        ];
    
        var data = [];
        for(let i = 0; i < wards.length; i++) {
            data.push({
                id: wards[i]._id,
                code: wards[i].code,
                model: wards[i].roomModel,
                roomNumber : wards[i].roomNumber,
                capacity : wards[i].capacity,
                loadCount : wards[i].loadCount || 0,
                roomStatus : wards[i].roomStatus,
                description:  wards[i].description,
                roomAvailability : (wards[i].capacity -  (wards[i].loadCount || 0)) > 1 ?  <span className="bg-primary button-link">Available</span> : <span className="bg-danger button-link">Full</span>,
                action : <div onClick={() => openUpdateModal(wards[i])}>
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

    return (
        <>
            <section className="page">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="form-title">Ward - List</h1>
                    </div>

                    <div className="flex-2">
                        <ButtonLinkList buttonList={[
                            {
                                "textContent" : 'List',
                                "icon" : 'list',
                                'className' : 'button-link bg-primary',
                                'onClick' : navigateToWardList,
                            },

                            {
                                "textContent" : 'Add',
                                "icon" : 'add',
                                'onClick' : naivateToWardAdd,
                                'className' : 'button-link bg-primary'
                            }
                        ]}></ButtonLinkList>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Search"
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
                        <div className="card-title">Wards</div>
                    </div>
                    <div className="card-body">
                        <TableContent wards={wards}></TableContent>
                    </div>
                </div>
            </section>

            {
                !isShowModal ? '' : (
                    <div className="modal-overlay" style={{zIndex: '10000'}}>
                        <div className="modal-content">
                            <h1>Ward - Edit Form</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Model</label>
                                    <select
                                        name="roomModel"
                                        value={formData.roomModel}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                                    >
                                        <option value="">--Select</option>
                                        <option value="Medical and Surgical Patient">Medical and Surgical Patient Room - contagious/not contagious</option>
                                        <option value="Intensive Care Unit Patient">Intensive Care Unit Patient Room - contagious/not contagious</option>
                                        <option value="Maternity Care Patient">Maternity Care Patient Room</option>
                                    </select>
                                </div>

                                <div className="flex">
                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <label className="block mb-1 font-medium">Room Number</label>
                                            <input
                                            type="text"
                                            name="roomNumber"
                                            value={formData.roomNumber}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <label className="block mb-1 font-medium">Capacity</label>
                                            <input
                                            type="text"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Room Status</label>
                                    <select
                                        name="roomStatus"
                                        value={formData.roomStatus}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border rounded-lg shadow-sm"
                                    >
                                        <option value="">--Select</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea name="description" id="description" rows={3}
                                        className="block w-full" value={formData.description}
                                        onChange={handleChange}></textarea>
                                </div>
                                <div className="flex">
                                    <button type="submit" className="button-link bg-success">
                                        Submit
                                    </button>
                                    <div style={{width:'10px'}}></div>
                                    <button className="button-link bg-warning" onClick={() => {
                                        setIsShowModal(false)
                                    }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
}


const navigateToWardList = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/ward/")
    }

    return applyNavigation;
}

const naivateToWardAdd = () => {
    const navigateTo = useNavigate();
    const applyNavigation = () => {
        navigateTo("/ward/create")
    }

    return applyNavigation;
}



export default ListWard;