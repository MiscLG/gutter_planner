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
    estimated_value: 0.0,

}
const checkFinished =(state)=>{
    return ('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate)
}
const calcCost = (state)=>{
    if ('ftGutter' in state.estimate && 'qtyDownspout' in state.estimate){
        return state.estimate.ftGutter*9.0 + state.estimate.qtyDownspout*(state.estimate.numFloors*1.4*80.0)
    }
    console.log(state)
    return 0.0
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
            let val= {
                ...state,
                estimate:{
                    ...state.estimate,
                    ...action.payload,
                },
                finished:('addressLine1' in state.address && 'ftGutter'in state.estimate && 'qtyDownspout' in state.estimate),
                // estimated_value:100.0,
                
            };
            val.estimated_value = calcCost(val)
            return val
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