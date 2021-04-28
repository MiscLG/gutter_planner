import React, {useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {useSelector,useDispatch} from 'react-redux'
import {social_auth,getUser} from '../API'

const GoogleSocialAuth = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [error,setError] = useState(null);
    const [userVars, setUserVars] = useState({});
    const googleResponse = async (response) => {
      if(user.loggedIn){
        // console.log(response)
        //The User does not sign out of Google Scope
        console.log("The user has signed out")
        dispatch({type:'signedOut'})
        dispatch({type:'resetEstimate'})
      }else{
        try{
          let backend_auth =  await social_auth({provider:"google-oauth2", accessToken: response.accessToken});
          let res = await getUser({email:response.profileObj.email})
          console.log(res)
          dispatch({type:'loggedIn/registered', payload:res.data.user})
        } catch (error) {
            console.log(error)
            setError("Authentication Failed")
        }
      }
    }
  
  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT}
      buttonText={user.loggedIn?"LOGOUT":"LOGIN WITH GOOGLE"}
      onSuccess={googleResponse}
      onFailure={googleResponse}
      autoLoad={false}
      cookiePolicy={'single_host_origin'}
      isSignedIn={user.loggedIn}
      scope={"https://www.googleapis.com/auth/calendar.readonly"}
      discoveryDocs={[["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]]}
    />
  )
};

export default GoogleSocialAuth;