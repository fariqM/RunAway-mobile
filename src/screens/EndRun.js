import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import firebaseConfig from '../config/firebaseConfig'
import * as firebase from 'firebase';
import '@firebase/firestore';
import { connect } from 'react-redux'
import MapView, { Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {addRunAction} from '../actions/RunLogAction'

//Initialize firebase
firebaseConfig
const Firestore = firebase.firestore();

class EndRun extends Component {

    state = {
        notes: "",
        distance: 0,
        pace: 0,
        timeToDisplay: ""
    }



    writeNote = (note) => {
        this.setState({ notes: note })
    }
    sendToFirebase = () => {
        Firestore.collection('users').doc(firebase.auth().currentUser.uid).collection("RunLog").add({
            calories: this.props.calories,
            distance: this.props.distance,
            end_time: this.props.endTime,
            note: this.state.notes,
            route: this.props.route,
            start_time: this.props.startTime,
            time: this.props.time,
            pace: this.props.pace
        }).then((doc) => {
            const run = {
                id: doc.id,
                calories: this.props.calories,
                distance: this.props.distance,
                end_time: this.props.endTime,
                note: this.state.notes,
                route: this.props.route,
                start_time: this.props.startTime,
                time: this.props.time,
                pace: this.props.pace
            }
            this.props.addRun(run)
        })
    }


    saveRun = () => {
        Alert.alert("Run Saved")
        this.sendToFirebase();
        this.props.clearRun();
        this.props.navigation.navigate('SimplyRun');
    }

    dontSave = () => {
        this.props.clearRun();
        this.props.navigation.navigate('SimplyRun')
    }

    discardRun = () => {
        Alert.alert(
            'Are you sure you want to discard this run?',
            'This cannot be undone',
            [
                { text: 'Yes', onPress: () => { this.dontSave() } },
                {
                    text: 'No',
                    style: 'cancel',
                }
            ],
            { cancelable: false },
        );
    }
    render() {

        return (

            <View style={{ flex: 1, }}>
                <MapView
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    followsUserLocation={true}

                >
                    <Polyline coordinates={this.props.polyline} strokeWidth={5} />
                </MapView>

                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset='100' style={{ alignItems: 'center', backgroundColor: '#A44CA0' }}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#A44CA0' }}  >


                        <Text style={{ fontSize: 20, }} > {"Run Complete"} </Text>
                        {this.props.display_time ?< Text > {
                            "Time: " + ("" + this.props.hours).padStart(2, "0") + ":" + ("" + this.props.mins).padStart(2, "0") + ":"
                            + ("" + this.props.secs).padStart(2, "0") + " hr:min:sec"} </Text>: null}
                        {!this.props.metric && this.props.display_distance ? < Text style={{ left: 10 }}>{"Distance: " + this.props.distance.toFixed(2) + " miles"} </Text> : null}
                        {this.props.metric && this.props.display_distance ? <Text style={{ left: 10 }}>{"Distance: " + (this.props.distance * 1.609).toFixed(2) + " km"} </Text> : null}
                        {!this.props.metric && this.props.display_pace ? <Text style={{ left: 14 }}>{"Pace: " + (this.props.pace).toFixed(2) + " mins/mile"} </Text> : null}
                        {this.props.metric && this.props.display_pace ? <Text style={{ left: 14 }}>{"Pace: " + (this.props.pace * .621).toFixed(2) + " mins/km"} </Text>: null}

                        {this.props.display_calories? < Text style={{ left: 14, paddingBottom: 10 }}>{"Calories: " + this.props.calories.toFixed(0) + " cals"} </Text>: null}



                        <TextInput style={{ paddingLeft: 7, borderWidth: 5, borderColor: 'black', right: 0, width: 200 }}
                            placeholder="Notes     "
                            autoCapitalize="none"
                            onChangeText={note => this.writeNote(note)}
                            value={this.state.notes}
                            multiline
                            blurOnSubmit={true}
                        />

                        <View style={{ paddingTop: 30, flexDirection: 'row', alignContent: 'space-between' }}>

                            <TouchableOpacity style={{
                                right: 20,
                                width: 90,
                                height: 90,
                                backgroundColor: '#FFD700',
                                borderRadius: 200 / 2,
                                alignItems: 'center'
                            }} onPress={() => this.saveRun()}>

                                <MaterialCommunityIcons name="check" size={50} style={{ paddingTop: 5 }} color={"#5018D9"} />

                                <Text style={{ paddingBottom: 0, color: "#5018D9" }}>Save Run </Text>

                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                left: 20,
                                width: 90,
                                height: 90,
                                backgroundColor: 'darkorange',
                                borderRadius: 200 / 2,
                                alignItems: 'center'
                            }} onPress={() => this.discardRun()}>

                                <MaterialCommunityIcons name="trash-can-outline" size={50} style={{ paddingTop: 5 }} color={"#5018D9"} />

                                <Text style={{ paddingVertical: 0, color: "#5018D9" }}>Discard</Text>

                            </TouchableOpacity>
                        </View>

                    </View>

                </KeyboardAvoidingView >
            </View>


        );
    }

}

class Circle extends Component {

    render() {
        return (
            <View style={{
                width: 75,
                height: 75,
                backgroundColor: 'darkcyan',
                borderRadius: 200 / 2
            }} />
        )
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

    }
}
//Sends actions to the reducer in the App.js file 
function mapDispatchtoProps(dispatch) {
    return {
        sendTime: (time) => dispatch({ type: "ENDRUN", time }),
        clearRun: () => dispatch({ type: "CLEARRUN" }),
        addRun: (run) => dispatch(addRunAction(run))
    }
}

//Connecting the react components to the store in App.js 
export default connect(mapStateToProps, mapDispatchtoProps)(EndRun);