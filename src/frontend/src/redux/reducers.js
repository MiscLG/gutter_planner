import { combineReducers } from 'redux'

import loginReducer from "../login/LoginReducer"

const rootReducer = combineReducers({
  user: loginReducer
  
})

export default rootReducer