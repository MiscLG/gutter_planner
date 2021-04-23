import { useEffect } from 'react';

const handleInput = (hook,callback) => {
    return (event) => 
    callback({
        ...hook,
        [event.target.name] : event.target.value
    }) 
}


const useScript = url => {
  //Script taken from 
  //https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

export {handleInput,useScript}