
import {React,useState} from "react";
import {useScript,handleInput} from "./utilities"
import Autocomplete from "react-google-autocomplete"
import {Input,TextField} from "@material-ui/core"
import {useSelector,useDispatch} from 'react-redux'


function PlacesAutocompleteBar(props){
    const dispatch = useDispatch()
    const [location,setLocation] = useState("Street Address")
    const addressVars = useSelector(state => state.estimate.address)
    // const [addressVars, setAddressVars] = useState({})
    
    const organizePlaceData = (place) => {
        let data = place.address_components
        console.log(data)
        try{
            let addressData = {
                addressLine1: `${data[0].long_name} ${data[1].long_name}`.toUpperCase(),
                city: `${data[3].long_name}`.toUpperCase(),
                zipCode:`${data[7].long_name}`
            }
            dispatch({type:"updateAddress",payload:addressData})
            setLocation(place.formatted_address)
            console.log(location)
        } catch{
            console.log("addressIs not formatted correctly")
        } 
    }
    return (
            <Input
            fullWidth
            placeholder={location}
            inputComponent={
                ({inputRef, onFocus,onBlur, ...props}) =>(
                <Autocomplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    onPlaceSelected={(place) => organizePlaceData(place)}
                    options={{
                        types: ["address"],
                        fields: "formatted_address",
                    }}
                    {...props}
                />)
            }/>
    )

};

export default PlacesAutocompleteBar