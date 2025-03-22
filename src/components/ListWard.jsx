import { useState, useEffect, useContext} from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ButtonLinkList from "./widget/ButtonLinkList";
import axios from "axios";
const apiBaseURL = import.meta.env.REACT_APP_API_BASE_URL;

// dfetch doctors from the API
const ListWard = () => {
    const [wards, setWards] = useState([]);
    useEffect(() => {
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
      }, []);

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
                <div className="card-main">
                    <div className="card-body">
                        <input placeholder="Search"></input>
                        <TableContent wards={wards}></TableContent>
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
    ];

    var data = [];
    for(let i = 0; i < wards.length; i++) {
        data.push({
            id: wards[i]._id,
            code: wards[i].code,
            model: wards[i].roomModel,
            roomNumber : wards[i].roomNumber,
            capacity : wards[i].capacity,
            loadCount : wards[i].loadCount,
            roomStatus : wards[i].roomStatus,
            description:  wards[i].description,
            roomAvailability : wards[i].roomAvailability,
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

export default ListWard;