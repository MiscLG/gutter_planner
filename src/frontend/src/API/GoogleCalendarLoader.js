import React, {useEffect, useState} from "react";
import { useSelector } from 'react-redux'
import {useScript,updateArrayHook} from '../utilities'
import Button from '@material-ui/core/Button'
import {getCalendar} from './CalendarAPI'


const GoogleCalendarLoader = () => {
  const gapi = window.gapi
  const loggedIn = useSelector(state=> state.user.loggedIn)
  const [messages,setMessages]= useState([])
  const pushMessage = updateArrayHook(messages,setMessages)

  let CAL_DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  let CAL_SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

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
    pushMessage(message);
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

  useEffect(()=>{
    handleClientLoad()
  },[]);
 
  const addEvent =() => {

  }
  
  return (
    <div>
      <iframe src="https://calendar.google.com/calendar/embed?src=pkqt33e9pru34l7m52ieg0p6ik%40group.calendar.google.com&ctz=America%2FLos_Angeles"  width="800" height="600" frameborder="0" scrolling="no"></iframe>
      <Button variant="contained" color="primary" onClick={handleAuthClick}>Calendar Events</Button>
      <Button variant="contained" color="primary" onClick={listUpcomingEvents}>Calendar Events</Button>
      {messages.map((x)=><p>{x}</p>)}
    </div>
  );
}

export default GoogleCalendarLoader
