import axios from 'axios';
import {callAPI} from '../API'

import React, {useEffect, useState} from "react";
import { useSelector } from 'react-redux'
import {useScript,updateArrayHook,find_open_time_for} from '../utilities'
import Button from '@material-ui/core/Button'
import {getCalendar} from './CalendarAPI'

const gapi = window.gapi
// const loggedIn = useSelector(state=> state.user.loggedIn)
// const [messages,setMessages]= useState([])
// const pushMessage = updateArrayHook(messages,setMessages)
// const [openSlots,setOpenSlots] = useState({})
// const [avalability,setAvailability] = useState({})

let CAL_DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
let CAL_SCOPES = "https://www.googleapis.com/auth/calendar";

let today = new Date()
today.setHours(7,0,0,0)
let tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate()+1)
let nextWeek = new Date(tomorrow)
nextWeek.setDate(nextWeek.getDate()+7)
nextWeek.setHours(15,0,0,0)

const getOpenSlots = async (min_start=tomorrow,duration=0.5)=>{
    let event=Object;
    event.min_start = min_start;
    event.duration_in_hours=duration;
    let schedule = await freeBusy()
    return find_open_time_for(event,schedule);
}

console.log(gapi)
/**
     *  On load, called to load the auth2 library and API client library.
     */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
/**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
function initClient() {
    gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT,
        discoveryDocs: CAL_DISCOVERY_DOCS,
        scope: CAL_SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        // authorizeButton.onclick = handleAuthClick;
        // signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
/**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
    listUpcomingEvents();
    }
}
/**
     *  Sign in the user upon button click.
     */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
/**
     *  Sign out the user upon button click.
     */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}
/**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
function appendPre(message) {
    console.log("appended smth");
}
/**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
function listUpcomingEvents() {
    console.log(process.env.REACT_APP_CALENDAR_ID)
    gapi.client.calendar.events.list({
    'calendarId': process.env.REACT_APP_CALENDAR_ID,
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
    }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
        for (let i = 0; i < events.length; i++) { 
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
            when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
        }
    } else {
        appendPre('No upcoming events found.');
    }
    });
}
const freeBusy = async ()=>{

    console.log(gapi.client.calendar)
    let res = await gapi.client.calendar.freebusy.query({
    "timeMin": tomorrow.toISOString(),
    "timeMax": nextWeek.toISOString(),
    "timeZone": "PDT",
    "groupExpansionMax": 3,
    "calendarExpansionMax": 5,
    "items": [
        {
        "id": process.env.REACT_APP_CALENDAR_ID
        }
    ]
    })
    return res.result.calendars[process.env.REACT_APP_CALENDAR_ID].busy

}
function addEvent(event){
    var def_event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
        'dateTime': '2015-05-28T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2015-05-28T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
        {'email': 'lpage@example.com'},
        {'email': 'sbrin@example.com'}
    ],
    'reminders': {
        'useDefault': false,
        'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
        ]
    }
    };
    
    var request = gapi.client.calendar.events.insert({
    'calendarId': process.env.REACT_APP_CALENDAR_ID,
    'resource': event
    });
    
    return request.execute(function(event) {
    return ('Event created: ' + event.htmlLink);
    });
}

// const testingComp =()=>(
// <div>
//     <iframe src="https://calendar.google.com/calendar/embed?src=pkqt33e9pru34l7m52ieg0p6ik%40group.calendar.google.com&ctz=America%2FLos_Angeles"  width="800" height="600" frameborder="0" scrolling="no"></iframe>
//     <Button variant="contained" color="primary" onClick={freeBusy}>freeBusy</Button>
//     <Button variant="contained" color="primary" onClick={getOpenSlots}>Calendar Events</Button>
//     <Button variant="contained" color="primary" onClick={addEvent}>addEvent</Button>
//     {messages.map((x)=><p>{x}</p>)}
//     {Object.keys(openSlots).map((x)=>{
//     return (
//     <ul>
//     {x}
//     {openSlots[x].map((y)=>(<li>From: {y.start.toLocaleTimeString()} To:{y.end.toLocaleTimeString()}</li>))}
//     </ul>)
// })}
// </div>
// );


export {addEvent,freeBusy,getOpenSlots,handleClientLoad}

