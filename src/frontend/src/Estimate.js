import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

import {Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core"
import { handleInput } from "./utilities";


function Estimate(){
    const [error, setError] = useState(null);
    const [AddressVars, setAddressVars] = useState({})
    const [estimateVars, setEstimateVars] = useState({})
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const submitEstimate = async ()=> {
        //Call API iwth Address Field
        console.log("Submitted the form")
    }

    const handleAddressInput = handleInput(AddressVars,setAddressVars)
    const handleEstimateInput = handleInput(AddressVars,setAddressVars)
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
            control={<Checkbox name="spaciousGround" />}
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
                >
                    <option value="Shigle">Shingle</option>
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
                name="qtyDownspouts"
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
            <Typography variant="h4" margin="auto" >
                Please enter your address: 
            </Typography>
            <TextField 
            required
            type="search"
            label="Address Line 1:"
            fullWidth
            // variant="filled"
            name="addressLine1"
            />
            <p/>
            <TextField 
            label="Address Line 2:"
            fullWidth
            // variant="filled"
            name="addressLine2"
            />
            <p/>
            <TextField 
            label="City:"
            name="city"
            />
            <TextField 
            required
            label="Zip Code:"
            name="zipCode"
            />
            <p/>
            <FormControlLabel 
            label="Will we need an access code to enter? "
            labelPlacement="start"
            control={<Checkbox name="isGated" />}
            />
            <p/>
            <div>
                {
                    error ? (<div className="error">{error}</div>):  (EstimateForm)
                }
            </div>
            
        </div>
    )

};

export default Estimate;