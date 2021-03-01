import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getClients} from "./API"


function AdminPage(){
    const [error, setError] = useState(null);
    const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();

    //Queries Client API
    const queryClient = async () => {
        try {
            let result = await getClients();
            // result.data.map((value, index)=> console.log(value,index))
            // console.log(result.data.clients)
            console.log(result)
            setCQuery(result.data.clients)
        } catch (error) {
            console.log(error)
            setError("Something went wrong.");
        }
    };

    //fills page with api results
    const clientList = (
        <div >
            <h3> Client List</h3>
            <ul> 
                {clientQuery.map(client=> <li key={client.id}>{client.name}</li>)}
            </ul>
        </div>
    )
    
    //calls the api on load
    useEffect(()=>{
        // history.push("/admin");
        queryClient();
    },[]);

    return (
        <div >
            {history.push("/admin")}
            <h1> Admin Page </h1>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (clientList)
                }
            </div>
            
        </div>
    )

};

export default AdminPage;