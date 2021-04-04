import {UPDATE_ALL_SETTINGS,} from '../actions/SettingsAction'
import {RESET_ALL_SETTINGS,} from '../actions/SettingsAction'

//Initial state of the store 
const initialState = {
    display_calories:false,
    display_distance: false,
    display_pace: false,
    display_time:false,
    metric:false,
    update_frequency:false,
}

//Modfies the store depending on actions 
const SettingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ALL_SETTINGS:
            console.log("SettingsReducer ( UPDATE_ALL_SETTINGS ): updating all settings fields")
            return { ...state,
                display_calories: action.display_calories,
                display_distance: action.display_distance,
                display_pace: action.display_pace,
                display_time: action.display_time,
                metric: action.metric,
                update_frequency: action.update_frequency,
            }

        case RESET_ALL_SETTINGS:
            console.log("SettingsReducer ( RESET_ALL_SETTINGS ): resetting all settings fields")
            return { ...state,
                display_calories:false,
                display_distance: false,
                display_pace: false,
                display_time:false,
                metric:false,
                update_frequency:false,
            }

        default:
            console.log("SettingsReducer (",action.type,"): default case (no change to state)")
            return state
    }
}

export default SettingsReducer;