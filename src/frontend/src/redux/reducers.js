import { combineReducers } from 'redux'

import loginReducer from "../login/LoginReducer"
import estimateReducer from "../Estimate/EstimateReducer"

const rootReducer = combineReducers({
  user: loginReducer,
  estimate: estimateReducer
})

export default rootReducer