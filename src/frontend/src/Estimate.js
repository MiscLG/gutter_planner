import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";


function Estimate(){
    const [error, setError] = useState(null);
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const submitEstimate = async ()=> {
        console.log("Submitted the form")
    }

    //fills page with api results
    const EstimateForm = (
        <form onSubmit={submitEstimate}>
            <label>
                Name:<input type="text" name="name"/>
            </label>
            <p/>
            <input type="submit" value="Submit"/>
        </form>
    )
    
    //calls the api on load
    useEffect(()=>{
        // history.push("/admin");
        // queryClient();
    },[]);

    return (
        <div >
            {history.push("/estimate")}
            <h1> Please fill out your information </h1>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (EstimateForm)
                }
            </div>
            
        </div>
    )

};

export default Estimate;