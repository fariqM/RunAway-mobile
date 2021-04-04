import { combineReducers } from 'redux'

// 1. Import Reducers here
// import exampleReducer from './exampleReducer'
import endRunReducer from './endRunReducer'
import SettingsReducer from './SettingsReducer'
import PersonalInfoReducer from './PersonalInfoReducer'
import RunLogReducer from './RunLogReducer'

export default combineReducers({
    RunLogReducer,
    endRunReducer,
    SettingsReducer,
    PersonalInfoReducer,
})