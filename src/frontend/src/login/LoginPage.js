import React, {useState, useEffect} from "react";
import {useSelector,useDispatch} from 'react-redux'
import {useHistory} from "react-router-dom";
import {register,test_register} from "../API"
import {handleInput} from "../utilities"



function Login(){
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [error, setError] = useState(null);
    const [registrationVars, setRVars] = useState({});
    const [passwords,setPasswords] =useState({})
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const registration= async event => {
        event.preventDefault()
        // console.log(registrationVars)
        try {
            dispatch({type:'loggedIn/registered', payload:registrationVars})
            let result = await register({...registrationVars,...passwords});
            // let result = await test_register();
            // console.log(result)
            // console.log(regToken)
        } catch (error) {
            console.log(error)
            setError("Something went wrong.");
        }
        // console.log(registrationVars)
        console.log("Submitted the form")

    }
    
    const handleChange = handleInput(registrationVars, setRVars)
    const handlePasswords = handleInput(passwords,setPasswords)
    useEffect(()=>{
        
        // history.push("/admin");
        // queryClient();
    },[]);
    //fills page with api results
    const registrationForm = (
        <form onSubmit={registration}>
            <label>
                Username: <input type="text" name="username" onChange={handleChange}/>
            </label>
            <p/>
            <label> 
                Email Address: <input type="email" name="email" onChange={handleChange}/>
            </label>
            <p/>
            <label>
                {/* TODO: Encrypt password before sending to database */}
                Password: <input type="password" name="password1" onChange={handlePasswords}/>
            </label>
            <p/>
            <label>
                {/* TODO: Encrypt password before sending to database */}
                Repeat your Password: <input type="password" name="password2" onChange={handlePasswords}/>
            </label>
            <p/>
            <input type="submit" value="Submit"/>
        </form>
    )

    return (
        <div >
            {history.push("/login")}
            <h1> Please fill out your information </h1>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (registrationForm)
                }
            </div>
            
        </div>
    )

};

export default Login;