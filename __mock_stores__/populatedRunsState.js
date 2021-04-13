import firebase from 'firebase';

export default {
    UserAuthenticationReducer: {
        signedIn:false,
        user:null,
    },

    PersonalInfoReducer: {
        name:null,
        email: null,
        birthday: null,
        height: null,
        weight:100,
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
        runs:[
            {
                id: "testID",
                note: "well done Jon",
                time: 720,
                distance: 2.1,
                pace: 5.71428571,
                calories: 0,
                start_time: new Date("2020-03-22T12:48:54Z"),
                end_time: new Date("2020-03-22T13:00:54Z"),
                route: [new firebase.firestore.GeoPoint(43.073051,-89.40123), new firebase.firestore.GeoPoint(43.073451,-89.40123)],
            }
        ],
        total_time:0,
        total_distance:0,
        total_calories:0,
    }
}




