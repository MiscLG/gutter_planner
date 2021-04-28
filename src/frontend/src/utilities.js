import { useEffect } from 'react';

const handleInput = (hook,callback) => {
    return (event) => {
    // console.log(hook)
    callback({
        ...hook,
        [event.target.name] : event.target.type==="number"? parseInt(event.target.value) :event.target.value 
    }) 
  }
}

const handleReduxInput = (action,dispatch)=>{
return (event)=>{
  // console.log(event.target.)
  let eventValue;
  if (event.target.type==="checkbox"){
     eventValue = event.target.checked
  } else {
      eventValue = event.target.type==="number"? parseInt(event.target.value) :event.target.value 
  }
  dispatch({type:action,payload:{[event.target.name]:eventValue}})
}
}

const updateArrayHook = (hook, callback,) => (item) => callback([...hook,item])



const useScript = (url,onloadCallback=null) => {
  //Script taken from 
  //https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    script.onload = onloadCallback? onloadCallback: console.log(`Loaded ${url}`)

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};
const MILLISECONDS_PER_UNIT = {
  "year":365*24*60*60*1000,
  "week":7*24*60*60*1000,
  "day": 24*60*60*1000,
  "hour": 60*60*1000,
  "minute": 60*1000,
  "second": 1000,
}

//TODO:make this function a class for custom DS
const find_open_time_for = (event, schedule) => {
  //based on https://stackoverflow.com/questions/1050720/adding-hours-to-javascript-date-object
  let addTime = (num,unit,date)=> new Date(date.getTime() + (num*MILLISECONDS_PER_UNIT[unit]));
  
  const WORK_INTERVAL ={
    //maps to 7:00 am and 3:00pm in PDT respectively * 60 minutes / 15 min intervals
    start:7,
    end:15,
    slot_size:4, //fit in one hour
    slot_len:15, //minutes
  }
  let daySlots = new Array(32).fill(true)
  let openSlots = {}


  const addOpenSlots = (date)=>{
    let first_open = daySlots.findIndex((e)=>e&&true)
    // console.log(daySlots[first_open],first_open)
    //reduces to indexes of true
    const indices = daySlots.reduce(
      (out, bool, index) => bool ? out.concat(index) : out, 
      []
    )
    // console.log("Indexes"+indices)
    let event_starts = []
    let slots_for_duration= WORK_INTERVAL*event.duration_in_hours
    for(let i=0;i<indices.length;i++){
      // console.log("starts"+indices[i])
      let free = true
      let j=0
      for(j;j<slots_for_duration-1;j++){
        free =j+i<indices.length-1 && free && (indices[i]+j === indices[i+j])
        if(!free){console.log(indices[i+j]);break;}
      } 
      if(free){
        // console.log("valid"+ indices[j+i])
        event_starts.push(indices[i])
      }
      //this update tells where the indexes are no longer
      //consecutive, so we can start there next
      i+=j;
    }
    console.log(event_starts)
    event_starts.map((first_open)=>{
      let start = new Date(date)
      //console.log(start)
      start.setHours(0,0,0,0)
      let minutes_per_slot = (60/WORK_INTERVAL.slot_size)
      let minutes_till_slot = (first_open*minutes_per_slot)
      // console.log(minutes_till_slot/60)
      //console.log(minutes_till_start,minutes_till_start/60)
      start = addTime(WORK_INTERVAL.start,"hour",start)
      start = addTime(minutes_till_slot,"minute",start);
      //console.log(start)
      let end = addTime(event.duration_in_hours,"hour",start)
      // console.log(start)
      // console.log(end)
      const slot_obj = {
        start: (start),//.toISOString(),
        end:(addTime(event.duration_in_hours,"hour",start))//.toISOString()
      }
      const date_id = start.toDateString()
      let date_list = date_id in openSlots? openSlots[date_id]:[]
      date_list.push(slot_obj)
      openSlots = {
        ...openSlots,
        [date_id]:date_list
      }
    })
    daySlots.fill(true)
  }

  const getTimeMins = (date)=> (date.getHours()*60 + date.getMinutes())
  const stringToDate = (str)=> (new Date(str))

  const change_slot_vals = (tIn,tOut,val)=>{
    let start_dead_slots = (WORK_INTERVAL.start*60)/WORK_INTERVAL.slot_len
    console.log(start_dead_slots)
    let first_slot = (getTimeMins(tIn)/WORK_INTERVAL.slot_len) - start_dead_slots
    let last_slot = (getTimeMins(tOut)/WORK_INTERVAL.slot_len) - start_dead_slots
    console.log(`Added ${val} from ${first_slot} to ${last_slot} slots`)
    for (let ix=first_slot; ix<=last_slot;ix++){
      daySlots[ix] = val
    }
    // console.log(daySlots)
    console.log(`Slots changed to this: ${daySlots}`)
  }
  
  let event_start = new Date(event.min_start);
  if(0===schedule.length){
    addOpenSlots(event_start)
    return openSlots
  }
  let last_busy = new Date(schedule[schedule.length-1].start);
  console.log(last_busy)
  let days_between = parseInt((last_busy-event_start)/MILLISECONDS_PER_UNIT["day"])+1;
  console.log(schedule,days_between);
  let ix = 0;
  for (let day=1;day<=days_between && ix<schedule.length;day++){
    // console.log(`Day ${day}`);
    let busy_date_start = stringToDate(schedule[ix].start)
    let busy_date_end = stringToDate(schedule[ix].end)
    while(event_start.toDateString() === busy_date_start.toDateString()){
      change_slot_vals(busy_date_start,busy_date_end,false);
      ix++;
      if(ix>=schedule.length){break;}
      busy_date_start = stringToDate(schedule[ix].start)
      busy_date_end = stringToDate(schedule[ix].end)
    }
    addOpenSlots(event_start)
    event_start = addTime(1,"day",event_start);
    event_start.setHours(WORK_INTERVAL.start);
  }
  console.log(openSlots)
  return openSlots
}
export {handleInput,handleReduxInput,useScript,updateArrayHook,find_open_time_for}