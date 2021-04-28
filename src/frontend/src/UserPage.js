import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getUser, getUsers,getUserItems} from "./API"
import GoogleCalendarLoader from "./API/GoogleCalendarLoader"
import {useSelector,useDispatch} from "react-redux";
import {Button,Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';

function UserPage(){
    const user = useSelector(state=> state.user)
    const [error, setError] = useState(null);
    const [userQuery, setUQuery] = useState([]);
    const [userItems, setUserItems] = useState({})
    let history = useHistory();

    //Queries Client API
    const queryUser = async () => {
        try {
            let result = await getUsers();
            // result.data.map((value, index)=> console.log(value,index))
            // console.log(result.data.clients)
            console.log(result)
            setUQuery(result.data.users.edges)
        } catch (error) {
            console.log(error)
            setError("Something went wrong.");
        }
    };

    const queryUserAddress = async () => {
        let result = await getUserItems(user)
        console.log(result.data.addresses)
        setUserItems(result.data.addresses.reduce(function(map, obj) {
            // console.log(obj)
            map[obj.addressLine1] = obj;
            return map;
        }, {}))
        
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
    
    //calls the api on load
    useEffect(()=>{
        // history.push("/admin");
        // queryUser();
        queryUserAddress();
    },[]);

    return (
        <div >
            {history.push("/user")}
            {/* <GoogleCalendarLoader/> */}
            <Typography variant="subtitle1" component="h3">
                This is your portal to your account information!
            </Typography>
            <DataGrid pagination {...userItems}/>

            {/* {(addressList)}
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (userList)
                }
            </div> */}
            
        </div>
    )

};

export default UserPage;