const initialState = {
    googleAuth:{},
    loggedIn:false,
    username:"",
    email:"",
    isStaff:"",
    selectedJob:""
}
export default function loginReducer(state=initialState,action){
    switch(action.type){
        case 'usedGoogleAuth':
            return {
                ...state,
                googleAuth: action.payload
            }
        case 'loggedIn/registered':
            return {
                ...state,
                ...action.payload,
                loggedIn:true,
            }
        case 'signedOut':
            return  initialState
        
        case 'selectedJob':
            return {
                ...state,
                selectedJob: action.payload["selectedJob"]
            }
        default:
            return state
        
    }
}