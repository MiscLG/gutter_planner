import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getUsers} from "./API"


function AdminPage(){
    const [error, setError] = useState(null);
    const [userQuery, setUQuery] = useState([]);
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

    //fills page with api results
    const userList = (
        <div >
            <h3> Client List</h3>
            <ul> 
                {userQuery.map(user=> <li key={user.node.id}>{user.node.username}</li>)}
            </ul>
        </div>
    )
    
    //calls the api on load
    useEffect(()=>{
        // history.push("/admin");
        queryUser();
    },[]);

    return (
        <div >
            {history.push("/admin")}
            <h1> Admin Page </h1>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (userList)
                }
            </div>
            
        </div>
    )

};

export default AdminPage;