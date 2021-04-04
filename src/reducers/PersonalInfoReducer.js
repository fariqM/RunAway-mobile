import {UPDATE_NAME,
    UPDATE_BIRTH,
    UPDATE_HEIGHT,
    UPDATE_WEIGHT,
    UPDATE_SEX,
    UPDATE_EMAIL,
    UPDATE_ALL_PERSONAL_INFO,
    RESET_ALL} from '../actions/PersonalInfoAction'


//Initial state of the store 
const initialState = {
    name:null,
    email: null,
    birthday: null,
    height: null,
    weight:null,
    sex:"male",
}

//Modfies the store depending on actions 
const PersonalInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_NAME:
            console.log("PersonalInfoReducer (",action.type,"): updating name from",state.name,"to",action.name)
            return {...state, name: action.name}

        case UPDATE_BIRTH:
            console.log("PersonalInfoReducer (",action.type,"): updating birthday from",state.birthday,"to",action.birthday)
            return {...state, birthday: action.birthday}

        case UPDATE_HEIGHT:
            console.log("PersonalInfoReducer (",action.type,"): updating height from",state.height,"to",action.height)
            return {...state, height: action.height}
            
        case UPDATE_WEIGHT:
            console.log("PersonalInfoReducer (",action.type,"): updating weight from",state.weight,"to",action.weight)
            return {...state, weight: action.weight}

        case UPDATE_SEX:
            console.log("PersonalInfoReducer (",action.type,"): updating sex from",state.sex,"to",action.sex)
            return {...state, sex: action.sex}

        case UPDATE_EMAIL:
            console.log("PersonalInfoReducer (",action.type,"): updating email from",state.email,"to",action.email)
            return {...state, email: action.email}

        case UPDATE_ALL_PERSONAL_INFO:
            console.log("PersonalInfoReducer ( UPDATE_ALL_PERSONAL_INFO ) updating all personal info fields")
            return { ...state,
                name:action.name,
                email:action.email,
                birthday:action.birthday,
                height:action.height,
                weight:action.weight,
                sex:action.sex}

        case RESET_ALL:
            console.log("PersonalInfoReducer ( RESET_ALL ) resetting all personal info fields to initial values")
            return { ...state,
                name:null,
                email: null,
                birthday: null,
                height: null,
                weight:null,
                sex:"male",}

        default:
            console.log("PersonalInfoReducer (",action.type,"): default case (no change to state)")
            return state
    }
}

export default PersonalInfoReducer;