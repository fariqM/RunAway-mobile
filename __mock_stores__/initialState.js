export default {
    UserAuthenticationReducer: {
        signedIn:false,
        user:null,
    },

    PersonalInfoReducer: {
        name:null,
        email: null,
        birthday: 0,
        height: 0,
        weight: 0,
        sex:"male",
    },

    SettingsReducer: {
        display_calories:false,
        display_distance: false,
        display_pace: false,
        display_time:false,
        metric:false,
        update_frequency:false,
    },

    endRunReducer: {
        time: 0,
        distance: 0,
        pace: 0,
        calories: 0,
        startTime: "",
        endTime: "",
        route: [],
        hours: 0,
        mins: 0,
        secs: 0
    },

    RunLogReducer: {
        runs:[],
        total_time:0,
        total_distance:0,
        total_calories:0,
    }
}