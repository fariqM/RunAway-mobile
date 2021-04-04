import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig'
import { connect } from 'react-redux'
import {addRunAction} from '../actions/RunLogAction'
import {updateAllPersonalInfoAction} from '../actions/PersonalInfoAction'
import {updateAllSettingsAction} from '../actions/SettingsAction'


//References to the root of the firestore database
const firestore = firebase.firestore();
//Firebase initialzation 
firebaseConfig

export class Launch extends Component {
    constructor(props){
        super(props)
        
        const user = firebase.auth().currentUser
        if (user) {
            console.log("Launch: Attempting to fetch user data for user with uid=", user.uid)
            let userData = firestore.collection('users').doc(user.uid)
            let runData = userData.collection('RunLog')

            // Fetch User Data from firestore database
            userData.get().then((doc) => {
                console.log("Launch: Successfully fetched user data for user with uid=", user.uid)
                let userData = doc.data()

                // Update all personal info in store
                this.props.dispatch(updateAllPersonalInfoAction(userData.personal))
                // Update all settings info in store 
                this.props.dispatch(updateAllSettingsAction(userData.settings))

                // ***** Fetch Run Log from firestore database *****
                runData.get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const run = {
                            id: doc.id,
                            note: doc.get("note"),
                            time: doc.get("time"),
                            distance: doc.get("distance"),
                            pace: doc.get("pace"),
                            calories: doc.get("calories"),
                            start_time: doc.get("start_time").toDate(),
                            end_time: doc.get("end_time").toDate(),
                            route: doc.get("route"),
                        }
                        this.props.dispatch(addRunAction(run))
                    })
                }).catch((error) => {
                    console.log("Launch: Error fetching run data:", error.message)
                    Alert.alert(error.message)
                })

                // Navigate to main
                this.props.navigation.navigate("Main")
            })
            .catch((error) => {
                console.log("Launch: Error fetching user data:", error.message)
                Alert.alert(error.message)
                firebase.auth().signOut();
                this.props.navigation.navigate("Login")
            })
        } else {
            console.log("Launch: No current user is signed in.")
            this.props.navigation.navigate("Login")
        }
    }

    
    render() {
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View  style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.titleText}>Simply Run</Text>
                </View>
                <View  style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                    <Image
                        style={styles.runnerImage}
                        source={require('../../assets/images/simple_runner.png')}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default connect()(Launch)

const styles = StyleSheet.create({
    runnerImage:{
        width:200,
        height:250,
        resizeMode:'stretch',
    },
    titleText: {
        fontSize:40,
        fontWeight:'bold',
        fontStyle:'italic',
    }
  });