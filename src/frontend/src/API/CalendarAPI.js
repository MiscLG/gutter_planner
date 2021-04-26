import axios from 'axios';
import {callAPI} from '../API'

const calendar_url = `https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}`
const getCalendar = async ()=>{
    let options = {
        headers: {"Content-Type": "application/json", Accept: "application/json"},
    }
    let response = await axios.get(calendar_url,options);
    console.log(response)
    return response
}


export {getCalendar}