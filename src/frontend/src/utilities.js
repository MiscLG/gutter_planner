const handleInput = (hook,callback) => {
    return (event) => 
    callback({
        ...hook,
        [event.target.name] : event.target.value
    }) 
}


export {handleInput}