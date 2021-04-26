const initialState = {
    address:{
        isGated:false,
        addressLine2:""
    },
    job:{
        depositPaid:false,
    },
    estimate :{
        roofType:"Shingle",
        roofInclination:"L",
        spaciousGround:false,
        numFloors: 1,
        notes:"",
    },
    finished: false,
    estimated_value: 0.0

}

export default function estimateReducer(state=initialState,action){
    switch(action.type){
        case 'updateAddress':
            return {
                ...state,
                address:{
                    ...state.address,
                    ...action.payload,
                },
                finished:('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate)
            }
        case 'updateJob':
            return {
                ...state,
                job:{
                    ...state.job,
                    ...action.payload,
                },
                finished:('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate)
            }
        case 'updateEstimate':
            return {
                ...state,
                estimate:{
                    ...state.estimate,
                    ...action.payload,
                },
                finished:('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate)
            }
        case 'checkFinished':
            return {
                ...state,
                finished:('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate)
            }
        
        case 'resetEstimate':
            return initialState
        default:
            return state
        
    }
}