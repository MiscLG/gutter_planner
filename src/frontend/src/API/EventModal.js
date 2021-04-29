import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getUser, getUsers,getUserItems} from "../API"
import GoogleCalendarLoader from "./GoogleCalendarLoader"
import {useSelector,useDispatch} from "react-redux";
import {Button,Checkbox,TextField,Select,Typography,Modal,Fade,CssBaseline,Paper} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardTimePicker} from '@material-ui/pickers'
import { DataGrid } from '@material-ui/data-grid';
import {addEvent,getOpenSlots,handleClientLoad} from './CalendarAPI'




const EventModal = (props)=>{
    const [openSlots,setOpenSlots] = useState({})
    const [selectedDate, setSelectedDate] = React.useState(new Date(Date.now()))
    const [options, setOptions] = React.useState([])
    const [calLink,setCalLink] = React.useState(null)
    const address = useSelector(state=>state.estimate.address)
    // const [address,setAddress] = useState('800 Howard St., San Francisco, CA 94103')

    const handleDateChange = async (event) => {
        setSelectedDate(event.target.valueAsDate); 
        let res =await getOpenSlots(selectedDate)
        setOpenSlots(res)
    };
    
    const submitDate = (e)=>{
        e.preventDefault()
        let suggestions = []
        // console.log(openSlots)
        for (const [key, value] of Object.entries(openSlots)) {
            console.log(Object.entries(openSlots).length)
            suggestions.push(value[value.length-1])
            console.log(suggestions.length)
            if(suggestions.length>3){
                console.log("Got here")
                break;
            }
        }
        setOptions(suggestions)
    }
    const handleEventButton = async(e) =>{
        console.log(e.target.id)
        let start_date = options[e.target.id].start
        let end_date = options[e.target.id].end
        var event = {
            'summary': `Estimate:`,
            'location': `${address.addressLine1} ${address.addressLine2}`,
            'description': ``,
            'start': {
                'dateTime': `${start_date.toISOString()}`,
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': `${end_date.toISOString()}`,
                'timeZone': 'America/Los_Angeles'
            },
        };
        console.log(event)
        let res = await addEvent(event)
        setCalLink(res)
        console.log(res)

    }
    //calls the api on load
    useEffect(()=>{
        handleClientLoad()
    },[]);
      
    return (
        <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        > 
        <Fade in={props.open}>
            <Paper>
            {/* <CssBaseline/> */}
            <Typography>We will try to find a time that's close to what you ask.</Typography>
            <form onSubmit={submitDate}>
            <TextField
                id="date"
                label="Estimate Date"
                type="date"
                defaultValue={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                shrink: true,
                }}
             />
            {/* <TextField
                id="time"
                label="Estimate Time"
                type="time"
                defaultValue={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                shrink: true,
                }}
                inputProps={{
                step: 300, // 5 min
                }}
            /> */}
             <Button type="submit">
                Check Availability
             </Button>
             </form>
             {options &&
             options.map((date,ix)=>(
                <Button
                onClick={handleEventButton}
                id={ix}
                >
                From: {date.start.toLocaleString()}, To: {date.end.toLocaleString()}
                </Button>
                )
             )   
             }
            {calLink && 
            (<Typography variant="h1">
                {calLink}
            </Typography>)}
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date picker dialog"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
            <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change time',
            }}
            />
            </MuiPickersUtilsProvider> */}
            </Paper>
        </Fade>
        </Modal>
    )
};

export {EventModal};