import React, { useContext, useState } from "react";
import ButtonLinkList from "./widget/ButtonLinkList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

const AddNewWard = () => {
    const navigateTo = useNavigate();
    const [formData, setFormData] = useState({
        code : "",
        roomModel : "",
        roomNumber : "",
        roomStatus: "",
        capacity : "",
        availability : "",
        description : "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          const response = await axios.post(
            `${apiBaseURL}/api/v1/ward/create`,
            formData,
            { withCredentials: true }
          );
          toast.success(response.data.message);
          navigateTo("/ward");
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setIsSubmitting(false);
        }
      };

    return (
        <>
        <section className="page">
            <div>
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="form-title">Ward - Add New</h1>
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
                <div className="card-main" style={ {width:'40%'}}>
                    <div className="card-header">
                        <div className="card-title">Ward Form</div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="form">
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Code</label>
                                <input
                                type="text"
                                name="code"
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
                                    <option value="regular">Regular</option>
                                    <option value="private">VIP</option>
                                    <option value="delux">Delux</option>
                                    <option value="suite">Suite</option>
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

                            <button type="submit" className="form-button">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
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

export default AddNewWard;