import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core";
import { handleInput } from "./utilities";
import {addAddress, addJob, addEstimate } from "./API";
import PlacesAutocompleteBar from "./PlacesAutocompleteBar"


function Estimate(){
    const user = useSelector(state=>state.user)
    const [error, setError] = useState(null);
    const [addressVars, setAddressVars] = useState({
        isGated:false,
        addressLine2:"",
    })
    const [jobVars,setJobVars] = useState({})
    const [estimateVars, setEstimateVars] = useState({
        roofType:"Shingle",
        roofInclination:"L",
        spaciousGround:false,
        numFloors: 1,
        notes:"",
    })
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const submitAddress = async (event)=> {
        event.preventDefault()
        //Call API iwth Address Field
        console.log(user)
        console.log(addressVars)
        console.log({...addressVars, username:user.username})
        try{
            let result = await addAddress({...addressVars,username:user.username})
            let job = await addJob({email:user.email,username:user.username})
            console.log(job)
            setJobVars(job.data.createJob.job)
        }catch(error){
            console.log(error)
            setError("Something went wrong.");
        }
        console.log("Submitted the form")
    }
    const submitEstimate = async (event)=> {
        event.preventDefault()
        //Call API iwth Address Field
        console.log(user)
        console.log(estimateVars)
        console.log({...estimateVars,addressLine1:addressVars.addressLine1,jid:jobVars.jid,uid:user.uid})

        try{
            let result = await addEstimate({...estimateVars,addressLine1:addressVars.addressLine1,jid:jobVars.jid,uid:user.uid})
            console.log(result)
        }catch(error){
            console.log(error)
            // setError("Something went wrong.");
        }
        console.log("Submitted the form")
    }

    const handleAddressInput = handleInput(addressVars,setAddressVars)
    const handleEstimateInput = handleInput(estimateVars,setEstimateVars)
    const handleChecked = (event) => setAddressVars({...addressVars, [event.target.name]:event.target.checked})
    const handleEstimateChecked = (event) => setEstimateVars({...estimateVars, [event.target.name]:event.target.checked})
    //fills page with api results
    const EstimateForm = (
        <form onSubmit={submitEstimate}>
            <Typography variant="subtitle" component="h3">
                Please provide the following information
            </Typography>
            <p/>
            <FormControlLabel 
            label="Is there ample floor space to place ladders, materials, and any removed metal?"
            labelPlacement="start"
            control={<Checkbox checked={estimateVars.spaciousGround} name="spaciousGround" onChange={handleEstimateChecked}/>}
            />
            <p/>
            <FormControlLabel
            required
            label="What kind of roof do you have?"
            labelPlacement="start"
            control={
                <Select
                native
                variant="standard"
                name="roofType"
                onChange={handleEstimateInput}
                >
                    <option value="Shingle">Shingle</option>
                    <option value="Tile">Tile</option>
                    <option value="Other">Other</option>
                </Select>
            }/>
            <p/>
            <FormControlLabel
            label="Which of these inclinations best describes your roof?"
            labelPlacement="start"
            control={
                <Select
                required
                native
                variant="standard"
                name="roofInclination"
                onChange={handleEstimateInput}
                >
                    <option value="L">Low (&lt;15 degrees)</option>
                    <option value="C">Conventional (15-30 degrees)</option>
                    <option value="S">Steep (&gt;30 degrees)</option>
                </Select>
            }/>
            <p/>
            <FormControlLabel
            label="About how many feet of gutters do you need?"
            labelPlacement="start"
            control={
                <TextField 
                required
                type="number"
                label="Approx. total length"
                name="ftGutter"
                onChange={handleEstimateInput}
                inputProps={{
                    min:"0",
                    step:"10"
                }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">Ft.</InputAdornment>,
                }}
                />
            }/>
            <p/>
            <FormControlLabel
            label="How many downspouts do you need?"
            labelPlacement="start"
            control={
                <TextField 
                required
                type="number"
                label="Qty."
                name="qtyDownspout"
                onChange={handleEstimateInput}
                inputProps={{
                    min:"0",
                    step:"1"
                }}
                />
            }/>
            <p/>
            <FormControlLabel
            label="How many storeys does this property have?"
            labelPlacement="start"
            control={
                <TextField 
                type="number"
                label="Storeys"
                name="numFloors"
                onChange={handleEstimateInput}
                inputProps={{
                    min:"1",
                    step:"1"
                }}
                />
            }/>
            <p/>
            <p/>
            <FormControlLabel
            label="Is there anything else we should know? (e.g. pets, noise)"
            labelPlacement="top"
            control={
                <TextField 
                multiline
                fullWidth
                rows="5"
                variant="outlined"
                label="Additional Information:"
                name="notes"
                onChange={handleEstimateInput}
                />
            }/>
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
            <form onSubmit={submitAddress}>
                <Typography variant="h4" margin="auto">
                    Please enter your address: 
                </Typography>
                {/* <PlacesAutocompleteBar/> */}
                <TextField 
                required
                type="search"
                label="Address Line 1:"
                fullWidth
                // variant="filled"
                name="addressLine1"
                onChange={handleAddressInput}
                />
                <p/>
                <TextField 
                label="Address Line 2:"
                fullWidth
                // variant="filled"
                name="addressLine2"
                onChange={handleAddressInput}
                />
                <p/>
                <TextField 
                label="City:"
                name="city"
                onChange={handleAddressInput}
                />
                <TextField 
                required
                label="Zip Code:"
                name="zipCode"
                onChange={handleAddressInput}
                />
                <p/>
                <FormControlLabel 
                label="Will we need an access code to enter? "
                labelPlacement="start"
                control={<Checkbox name="isGated" checked={addressVars.isGated} onChange={handleChecked} />}
                /> 
                <p/>
                <input type="submit" value="Submit"/>
            </form>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (EstimateForm)
                }
            </div>
                
        </div>
        
    )

};

export default Estimate;