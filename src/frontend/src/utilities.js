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

export {handleInput,handleReduxInput,useScript,updateArrayHook}