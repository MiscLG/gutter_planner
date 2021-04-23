
import React, {useState, useEffect} from "react";
import {useScript} from "./utilities"
import Autocomplete from "react-google-autocomplete";


function PlacesAutocompleteBar(){
    useScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`)

    return (
        <div>
            <script
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCLA9YKhLkIhpHCdEq5JOcucx2NX89pGGg&libraries=places"
            ></script>
            <Autocomplete
            apiKey={process.env.GOOGLE_API_KEY}
            style={{ width: "90%" }}
            onPlaceSelected={(place) => {
            console.log(place);
            }}
            options={{
            types: ["(regions)"],
            componentRestrictions: { country: "us" },
            }}
            defaultValue="San"
        />
        </div>
    
    )

};

export default PlacesAutocompleteBar;