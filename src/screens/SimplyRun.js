import React, { Component, } from 'react';
import { Text, View, Alert } from 'react-native';
import firebaseConfig from '../config/firebaseConfig'
import { connect } from 'react-redux'
import StartButton from "../runbutton/StartButton"
import StopRunButton from "../runbutton/StopRunButton"
import MapView, { Polyline } from 'react-native-maps';
import * as firebase from 'firebase';
import '@firebase/firestore';
import calculateCalories from '../calories/CalculateCalories'

import { END_RUN, } from '../actions/EndRunAction'
//Firebase initialzation 
firebaseConfig

const haversine = require('haversine');

export class SimplyRun extends Component {

    state = {
        stats: "",
        current: "",
        displayStat: true,
        startRun: true,
        paused: false,
        button: false,
        stopButton: false,
        coordinates: [],
        distance: 0,
        previousPosition: {},
        ms: 0,
        secs: 0,
        mins: 0,
        hrs: 0,
        startTime: "",
        route: "",
        pace: 0,
        calories: 0
    }

    componentDidUpdate(prevProps) {
        //If user changes setting change display
        if (this.props.metric !== prevProps.metric || this.props.display_distance !== prevProps.display_distance
            || this.props.display_pace !== prevProps.display_pace || this.props.display_time !== prevProps.display_time ||
            this.props.display_calories !== prevProps.display_calories) {
            this.formatStats()
        }

    }


    formatStats = () => {
        var formatSec = "" + this.state.sec; formatSec = formatSec.padStart(2, '0');

        var formatMin = "" + this.state.min; formatMin = formatMin.padStart(2, '0')

        var formatHour = "" + this.state.hour; formatHour = formatHour.padStart(2, '0')

        var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);

        if (this.state.distance !== 0) {
            var pace = (totalTimeSecs / 60) / this.state.distance
            this.setState({ pace: pace })

        }


        if (!this.props.metric) {
            if (this.props.display_distance) {
                if (this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//ALL Displayed
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Pace: " + this.state.pace.toFixed(2) +
                            " mins/mile" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//D P T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/mile"
                    })

                } else if (this.props.display_pace
                    && !this.display_time && this.props.display_calories) {//D P C
                    this.setState({
                        stats: "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Pace: " + this.state.pace.toFixed(2) +
                            " mins/mile" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//D T C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n" +
                            "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//D C
                    this.setState({
                        stats: "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && !this.props.display_time && !this.props.display_calories) {//D P 
                    this.setState({
                        stats: "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/miles"
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//D T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles"
                    })
                } else {//D
                    this.setState({
                        stats: "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles"
                    })
                }
            } else if (!this.display_distance) {
                if (this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//T  P C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n"
                            + "Pace: " + this.state.pace.toFixed(2) + " mins/mile" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//T P
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/mile"
                    })

                } else if (this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//P C
                    this.setState({
                        stats: "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/mile" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//T C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//C
                    this.setState({
                        stats: "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && !this.props.display_time && !this.props.display_calories) {// P 
                    this.setState({
                        stats: "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/miles"
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec"
                    })
                } else {
                    this.setState({
                        stats: ""
                    })
                }
            }

        } else {
            if (this.props.display_distance) {
                if (this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//ALL Displayed
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Pace: " + (this.state.pace * .621).toFixed(2)
                            + " mins/km" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//D P T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Pace: " + (this.state.pace * .621).toFixed(2) +
                            " mins/km"
                    })

                } else if (this.props.display_pace
                    && !this.display_time && this.props.display_calories) {//D P C
                    this.setState({
                        stats: "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Pace: " + (this.state.pace * .621).toFixed(2)
                            + " mins/km" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//D T C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n" +
                            "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//D C
                    this.setState({
                        stats: "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && !this.props.display_time && !this.props.display_calories) {//D P 
                    this.setState({
                        stats: "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km" + "\n" + "Pace: " + this.state.pace.toFixed(2) + " mins/km"
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//D T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km"
                    })
                } else {//D
                    this.setState({
                        stats: "\n" + "Distance: " + (this.state.distance * 1.609).toFixed(2) + " km"
                    })
                }
            } else if (!this.display_distance) {
                if (this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//T  P C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n"
                            + "Pace: " + (this.state.pace * .621).toFixed(2) + " mins/km" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//T P
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                            "\n" + "Pace: " + (this.state.pace * .621).toFixed(2) + " mins/km"
                    })

                } else if (this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//P C
                    this.setState({
                        stats: "\n" + "Pace: " + (this.state.pace * .621).toFixed(2) + " mins/km" + "\n" + "Calories: " + this.state.calories.toFixed(0)
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && this.props.display_calories) {//T C
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" + "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (!this.props.display_pace
                    && !this.props.display_time && this.props.display_calories) {//C
                    this.setState({
                        stats: "\n" + "Calories: " + this.state.calories.toFixed(0),
                    })
                } else if (this.props.display_pace
                    && !this.props.display_time && !this.props.display_calories) {// P 
                    this.setState({
                        stats: "\n" + "Pace: " + (this.state.pace * .621).toFixed(2) + " mins/km"
                    })
                } else if (!this.props.display_pace
                    && this.props.display_time && !this.props.display_calories) {//T
                    this.setState({
                        stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec"
                    })
                } else {
                    this.setState({
                        stats: ""
                    })
                }
            }
        }
    }

    endRun = () => {
        this.setState({ stopButton: false })
        this.setState({ current: "" })
        this.props.navigation.navigate('EndRun');
        var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);

        if (this.state.distance !== 0) {
            var pace = (totalTimeSecs / 60) / this.state.distance
            this.setState({ pace: pace })
        }
        //Using Redux to pass info to the EndRun Screen
        time = this.props.sendRunStats(totalTimeSecs, this.state.distance,
            this.state.pace, this.state.calories, this.state.startTime, new Date(), this.state.route, this.state.hour,
            this.state.min, this.state.sec, this.state.coordinates)
        this.setState({ hour: 0, min: 0, sec: 0, mili: 0, distance: 0, pace: 0, calories: 0, coordinates: [] })
        //this.formatStats()
        this.setState({ stats: "" })
        this.setState({ endRun: false })
    }

    endRunButton = () => {
        Alert.alert(
            'Confirm End Run',
            'Would you like to end your run?',
            [
                { text: 'Yes', onPress: () => { this.endRun() } },
                {
                    text: 'No',
                    style: 'cancel'
                }
            ],
            { cancelable: false },
        );

    }

    start = () => {
        //Get Inital start of run time 

        var startTime = new Date().getTime()


        if (!this.state.startRun & this.state.paused) {
            this.setState({ paused: false })
        }
        //Run has not started yet
        if (this.state.startRun) {
            this.setState({ startTime: new Date() })
            this.startTracking()
            this.setState({ current: "Tracking Run" })
            this.setState({ button: true, stopButton: true, startRun: false })

            setTimeout(() => this.intervalID = setInterval(() => {
                var diff = startTime - new Date().getTime();
                var hr = Math.floor(-diff / 3600000)
                var mili = -diff - 3600000 * hr
                var min = Math.floor(mili / 60000);
                mili = mili - 60000 * min;
                var sec = mili / 1000;
                mili = mili - 1000 & sec;
                min = min.toFixed(0);
                sec = sec.toFixed(0);
                this.setState({ hour: parseInt(hr), min: parseInt(min), sec: parseInt(sec), mili: parseInt(mili) })
                this.formatStats()
            }, 500), 1000 / 60);

        } else {
            if (this.state.paused) {
                this.setState({ current: "Tracking Run" })
                navigator.geolocation.getCurrentPosition(
                    position => {
                        var currentPosition = position.coords;
                        this.setState({ previousPosition: currentPosition })
                    }
                )
                this.startTracking()
                var pauseSec = this.state.sec;
                var pauseMin = this.state.min;
                var pauseHour = this.state.hour;

                setTimeout(() => this.intervalID = setInterval(() => {
                    this.setState({ button: true })
                    var diff = startTime - new Date().getTime();
                    var hr = Math.floor(-diff / 3600000)
                    var mili = -diff - 3600000 * hr
                    var min = Math.floor(mili / 60000);
                    mili = mili - 60000 * min;
                    var sec = mili / 1000;
                    mili = mili - 1000 & sec;
                    min = min.toFixed(0);
                    sec = sec.toFixed(0);
                    //Add new time differnce to old time differnce 

                    var newSec = pauseSec + parseInt(sec)
                    var newMin = pauseMin + parseInt(min)
                    var newHour = pauseHour + parseInt(hr)

                    while (newSec >= 60) {
                        newSec = newSec - 60;
                        newMin = newMin + 1;
                    }
                    while (newMin >= 60) {
                        newMin = newMin - 60;
                        newHour = newHour + 1;
                    }
                    this.setState({ hour: newHour, min: newMin, sec: newSec, mili: parseInt(mili) });
                    this.formatStats()
                }, 500), 1000 / 60);


            } else {
                this.setState({ current: "Run Paused" })
                this.setState({ button: false })
                this.setState({ stopButton: true })
                this.setState({ paused: true })

                clearInterval(this.intervalID);
                clearInterval(this.intervalTrackingID)
            }
        }
    }




    startTracking = () => {
        setTimeout(() => this.intervalTrackingID = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    var currentPosition = position.coords;

                    this.setState({ coordinates: this.state.coordinates.concat([currentPosition]) })
                    this.setState({ distance: this.state.distance + this.coordDistance(currentPosition) })
                    this.setState({ previousPosition: currentPosition })
                    geopoint = new firebase.firestore.GeoPoint(currentPosition.latitude, currentPosition.longitude)
                    this.setState(prevState => ({
                        route: [...prevState.route, geopoint]
                    }))
                }

            )

            if (this.state.distance !== 0) {
                var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);
                let kmPerHour = ((this.state.distance * 1.609)) / ((totalTimeSecs / 60) / 60)
                let cal = calculateCalories((this.props.weight * .435), kmPerHour, (totalTimeSecs / 60))
                this.setState({ calories: cal })
            }

        }, 10000), 1000);
    }

    coordDistance = (position) => {
        return haversine(this.state.previousPosition, position, { unit: 'mile' }) || 0;
    }

    componentWillUnmount = () => {

        clearInterval(this.intervalId, this.intervalTrackingID);
    }

    render() {
        return (
            <View style={{ flex: 1, }}>


                {!this.state.button && this.state.stopButton || !this.state.button ?
                    <MapView
                        showsUserLocation={true}
                        style={{ flex: 2 }}
                        followsUserLocation={true}
                    >

                        <Polyline coordinates={this.state.coordinates} strokeWidth={5} />


                    </MapView> : null
                }


                <View style={{
                    alignItems: 'center', justifyContent: "center", flex: 1.5, backgroundColor: '#A44CA0',
                }}>
                    <Text style={{ fontSize: 15 }}> {this.state.current}</Text>

                    {
                        this.state.displayStat ? < Text style={{
                            paddingBottom: 10, fontSize: 15
                        }}> {this.state.stats}</Text> : null
                    }

                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10
                    }}>
                        {
                            this.state.button ? < StartButton onPress={this.start} pauseButton={true} /> :
                                < StartButton onPress={this.start} pauseButton={false} />

                        }
                        <Text>  </Text>
                        {
                            !this.state.button && this.state.stopButton ?
                                <StopRunButton style={{ fontSize: 20 }} onLongPress={this.endRunButton} title={'STOP'} /> : null
                        }

                    </View>
                </View>
            </View>

        );
    }
}
//Getting the states from the store and mapping it to props in the Login
function mapStateToProps(state) {
    return {
        time: state.endRunReducer.time,
        distance: state.endRunReducer.distance,
        pace: state.endRunReducer.pace,
        calories: state.endRunReducer.calories,
        startTime: state.endRunReducer.startTime,
        endTime: state.endRunReducer.endTime,
        route: state.endRunReducer.route,
        hours: state.endRunReducer.hours,
        mins: state.endRunReducer.mins,
        secs: state.endRunReducer.secs,
        polyline: state.endRunReducer.polyline,
        display_calories: state.SettingsReducer.display_calories,
        display_distance: state.SettingsReducer.display_distance,
        display_pace: state.SettingsReducer.display_pace,
        display_time: state.SettingsReducer.display_time,
        metric: state.SettingsReducer.metric,
        update_frequency: state.SettingsReducer.update_frequency,
        weight: state.PersonalInfoReducer.weight
    }
}
//Sends actions to the reducer in the App.js file 
function mapDispatchtoProps(dispatch) {
    return {
        sendRunStats: (time, distance, pace, calories, startTime, endTime, route, hours, mins, secs, polyline) => dispatch({
            type: END_RUN, time, distance,
            pace, calories, startTime, endTime,
            route, hours, mins, secs, polyline
        }),

    }
}

//Connecting the react components to the store in App.js 
export default connect(mapStateToProps, mapDispatchtoProps)(SimplyRun);