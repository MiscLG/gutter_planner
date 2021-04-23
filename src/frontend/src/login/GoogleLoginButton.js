import React, {useState} from 'react';
import GoogleLogin from 'react-google-login';
import {social_auth} from '../API'

const GoogleSocialAuth = () => {
    const [error,setError] = useState(null);
    const googleResponse = async (response) => {
        // console.log(response.accessToken);
        try{
          let backend_auth =  await social_auth({provider:"google-oauth2", accessToken: response.accessToken});
          // console.log(backend_auth)
        } catch (error) {
          //  console.log(error)
           setError("Authentication Failed")
        }
      }

  return (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT}
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={googleResponse}
          onFailure={googleResponse}
          isSignedIn={true}
        />
  )
};

export default GoogleSocialAuth;