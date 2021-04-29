import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getUser, getUsers,getUserItems} from "./API"
import GoogleCalendarLoader from "./API/GoogleCalendarLoader"
import {useSelector,useDispatch} from "react-redux";
import {Button,Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import {handleClientLoad} from './API/CalendarAPI'
import {EventModal} from './API/EventModal'

const columns = [
  {field: 'jid',  headerNmae:'Job ID', width: 100},
  { field: 'address', headerName: 'Address', sortable:true, width:400},
  {field:'depositStatus', headerName:'Deposit Status', width:200,
    // valueGetter:(params)=> params.getValue('depositStatus')? "Paid":"Due",
  },
  {field:'startDate',headerName:'Date Started', width: 300,
    // valueGetter:(params)=> params.getValue('startDate')===null?"Date Pending":params.getValue('startDate').toLocaleString(),
  }

]

const rows = [
    {id:1, address:"Hello"},
    {id:3, address:"OOF"}
]


function UserPage(){
    const user = useSelector(state=> state.user)
    const address = useSelector(state=>state.estimate.address.addressLine1)
    const dispatch = useDispatch()
    const [error, setError] = useState(null);
    const [userQuery, setUQuery] = useState([]);
    const [userItems, setUserItems] = useState({})
    const [jobRows, setJobRows] = useState(rows)
    const [modalOpen,setModalOpen] = useState(false)
    
    const closeModal = () => {
        setModalOpen(false)
    }
    let history = useHistory();

    //Queries Client API
    const queryUser = async () => {
        try {
            let result = await getUsers();
            // result.data.map((value, index)=> console.log(value,index))
            // console.log(result.data.clients)
            // console.log(result)
            setUQuery(result.data.users.edges)
        } catch (error) {
            console.log(error)
            setError("Something went wrong.");
        }
    };
    const scheduleEstimate = () => {

    }

    const queryUserAddress = async () => {
        let result = await getUserItems(user)
        // console.log(result.data.addresses)
        setUserItems(result.data.addresses.reduce(function(map, obj,ix) {
            // console.log(obj)
            obj.id = ix
            map[obj.addressLine1] = obj;
            return map;
        }, {}));
        
        let id = 0;
        let items = result.data.addresses;
        let rows = []
        items.map(val=>{
            let jobs= val.jobs
            jobs.map(job=>(rows.push({
            id: ++id,
            jid: job.jid,
            address: val.addressLine1 + val.addressLine2,
            depositStatus: job.depositPaid,
            startDate: job.dateStarted,
            })))
        })     
        setJobRows(rows) 
        console.log(rows)
    }

    //fills page with api results
    const userList = (
        <div >
            <h3> Client List</h3>
            <ul> 
                {userQuery.map(user=> <li key={user.node.id}>{user.node.username}</li>)}
                
            </ul>
        </div>
    )

    const addressList = (
        <ul>
            {Object.keys(userItems).map(address=>
                <li key={0}>{address}</li>
            )}
        </ul>
    )
    const handleCellClick = (event)=>{
        setModalOpen(true)
        console.log(event)
        dispatch({type:"updateAddress", payload:{addressLine1:event.row.address}})
        
    }
    
    //calls the api on load
    useEffect(()=>{
        // history.push("/admin");
        // queryUser();
        queryUserAddress();
        handleClientLoad()
    },[]);
      
    return (
        <div >
            {history.push("/user")}
            {/* <GoogleCalendarLoader/> */}
            <EventModal
            address={address}
            open={modalOpen}
            handleClose={closeModal}
            />
            <Typography variant="subtitle1" component="h3">
                This is your portal to your account information!
            </Typography>
            
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid pagination columns={columns} rows={jobRows} pageSize={5} onCellClick={handleCellClick}/>
            </div>  
            {/* {console.log(userItems)} */}
        </div>
    )

};

export default UserPage;