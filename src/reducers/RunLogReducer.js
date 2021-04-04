import {ADD_RUN,
        DELETE_RUN,
        RESET_RUNS} from '../actions/RunLogAction'

//Initial state of the store 
const initialState = {
    runs:[],
    total_time:0,
    total_distance:0,
    total_calories:0,
    // average_pace:0,
}

//Modfies the store depending on actions 
const RunLogReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RUN:
            console.log("RunLogReducer: ( ADD_RUN ): adding run with id =", action.id, "to store")
            return {...state, 
                runs: [...state.runs, {
                    id: action.id,
                    note: action.note,
                    time: action.time,
                    distance: action.distance,
                    pace: action.pace,
                    calories: action.calories,
                    start_time: action.start_time,
                    end_time: action.end_time,
                    route: action.route,
                    lat: action.lat,
                    long: action.long,
                }],
                total_time: state.total_time + action.time,
                total_distance: state.total_distance + action.distance,
                total_calories: state.total_calories + action.calories,
                //average_pace: ((state.total_time)/60)/(state.total_distance)
            }
            

        case DELETE_RUN:
            console.log("RunLogReducer: ( DELETE_RUN ): deleting run with id =", action.id, "from store")
            for (i = 0; i < state.runs.length; i++) {
                terminal = state.runs[i]
                if (terminal.id == action.id){
                    break
                } else {
                    terminal = null
                }
            }
            if (terminal == null) {
                console.log("RunLogReducer: ( DELETE_RUN ): no entry found for id =", action.id)
                return state
            } else {
                return {...state, 
                    runs: state.runs.filter(run => run.id !== action.id),
                    total_time: state.total_time - terminal.time,
                    total_distance: state.total_distance - terminal.distance,
                    total_calories: state.total_calories - terminal.calories,
                    // average_pace: ((state.total_time - action.time)/60)/(state.total_distance - action.distance)
                }
            }

        case RESET_RUNS:
            console.log("RunLogReducer: ( RESET_RUNS ): resetting runs in store.")
            return {...state, 
                runs:[],
                total_time:0,
                total_distance:0,
                total_calories:0,
                // average_pace:0,
            }

        default:
            console.log("RunLogReducer (",action.type,"): default case (no change to state)")
            return state
    }
}

export default RunLogReducer;