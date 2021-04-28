import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {Button,Checkbox,FormControlLabel,InputAdornment, TextField,Select,Typography} from "@material-ui/core";
import { handleInput,handleReduxInput } from "./utilities";
import {addAddress, addJob, addEstimate } from "./API";
import PlacesAutocompleteBar from "./PlacesAutocompleteBar"
import AddressInputForm from "./userData/addressInputForm"


function Estimate(){
    const user = useSelector(state=>state.user)
    const estimateData = useSelector(state=>state.estimate)
    const dispatch = useDispatch()
    const estimateVars = useSelector(state=> state.estimate.estimate)
    let history = useHistory();

    const commit = async() => {
        if (estimateData.finished){
            let address = await addAddress({...estimateData.address,...user})
            address = address.data.createAddress.address
            let job = await addJob({...estimateData.job,...user})
            job = job.data.createJob.job
            // let information = {...estimateVars,...address,...job,...user}
            let estimate = await addEstimate({...estimateVars,...address,...job,...user})
            console.log(estimate.data.createEstimate.estimate)
        } else {
            dispatch({type:"checkFinished"})
            console.log("Try again in a moment")
        }
    }
    const submitForm= async (event)=> {
        event.preventDefault()
        await dispatch({type:"updateEstimate", payload:estimateVars})
        commit()
    }
    
    const handleEstimateInput = handleReduxInput("updateEstimate",dispatch)

    const EstimateForm = (
        <form onSubmit={submitForm}>
            <Typography variant="subtitle1" component="h3">
                Please provide the following information
            </Typography>
            <p/>
            <FormControlLabel 
            label="Is there ample floor space to place ladders, materials, and any removed metal?"
            labelPlacement="start"
            control={<Checkbox checked={estimateVars.spaciousGround} name="spaciousGround" onChange={handleEstimateInput}/>}
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
            <Button
            type="submit"
            disabled={!user.loggedIn} 
            color="primary"
            variant="contained"
            >
                Submit
            </Button>
        </form>
    )
    

    return (
        <div >
            {history.push("/estimate")}
            <AddressInputForm 
            useAutofill={true}
            />
            <div>
                 {EstimateForm}
            </div>   
        </div>
        
    )

};

export default Estimate;