import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core";
import { handleReduxInput } from "../utilities";
import {addAddress, addJob, addEstimate } from "../API";
import PlacesAutocompleteBar from "../PlacesAutocompleteBar"


function AddressInputForm(props){
    let useAutofill = props.useAutofill || false;
    const dispatch = useDispatch()
    const user = useSelector(state=>state.user)
    const address = useSelector(state=>state.estimate.address)
    
    const handleSubmit =(event)=>{
        event.preventDefault()
    }


    const handleInput = handleReduxInput("updateAddress",dispatch);
    // =>{
    //     // console.log(event.target.)
    //     let eventValue;
    //     if (event.target.type==="checkbox"){
    //        eventValue = event.target.checked
    //     } else {
    //         eventValue = event.target.type==="number"? parseInt(event.target.value) :event.target.value 
    //     }
    //     dispatch({type:"updateAddress",payload:{[event.target.name]:eventValue}})
    // }
    return (
        <div >
            <form onSubmit={handleSubmit}> 
                <Typography variant="h4" margin="auto">
                    Please enter your address: 
                </Typography>
                {useAutofill && 
                <div>
                    <PlacesAutocompleteBar/>
                    <TextField 
                    label="Apartment, unit, suite, or floor #"
                    fullWidth
                    // variant="filled"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleInput}
                    />
                    <p/>
                    <FormControlLabel 
                    label="Will we need an access code to enter? "
                    labelPlacement="start"
                    control={<Checkbox color="primary" name="isGated" checked={address.isGated} onChange={handleInput} />}
                    /> 
                    <p/>
                </div>
                }

                {!useAutofill && 
                <div>
                <TextField 
                required
                type="search"
                label="Address Line 1:"
                fullWidth
                // variant="filled"
                name="addressLine1"
                onChange={handleInput}
                />
                <p/>
                <TextField 
                label="Apartment, unit, suite, or floor #"
                fullWidth
                // variant="filled"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleInput}
                />
                <p/>
                <TextField 
                label="City:"
                name="city"
                onChange={handleInput}
                />
                <TextField 
                required
                label="Zip Code:"
                name="zipCode"
                onChange={handleInput}
                /> 
                <p/>
                <FormControlLabel 
                label="Will we need an access code to enter? "
                labelPlacement="start"
                control={<Checkbox name="isGated" checked={address.isGated} onChange={handleInput} />}
                /> 
                <p/>
                <input type="submit" value="Submit"/>
                </div>
            }
            </form>     
        </div>
        
    )

};

export default AddressInputForm;