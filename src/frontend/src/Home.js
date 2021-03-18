import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";


function Home(){
    const [error, setError] = useState(null);
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const submitEstimate = async ()=> {
        console.log("Submitted the form")
    }
    
    useEffect(()=>{
        // history.push("/admin");
        // queryClient();
    },[]);

    return (
        <div >
            {history.push("/")}
            <h1> Welcome to our site </h1>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  "Hello World!"
                }
            </div>
            
        </div>
    )

};

export default Home;