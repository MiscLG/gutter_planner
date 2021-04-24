import React, {useState} from 'react';
import GoogleLogin from 'react-google-login';
import {useSelector,useDispatch} from 'react-redux'
import {social_auth,getUser} from '../API'

const GoogleSocialAuth = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [error,setError] = useState(null);
    const [userVars, setUserVars] = useState({});
    const googleResponse = async (response) => {
        // console.log(response)
        
        // console.log(userVars)
        // console.log(response.accessToken);
        try{
          let backend_auth =  await social_auth({provider:"google-oauth2", accessToken: response.accessToken});
          let res = await getUser({email:response.profileObj.email})
          setUserVars({
            ...userVars,
            ...res.data.user
          })
          console.log(userVars)
          dispatch({type:'loggedIn/registered', payload:userVars})
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