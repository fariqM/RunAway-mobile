import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import {addRunAction} from '../actions/RunLogAction'
import {updateAllPersonalInfoAction} from '../actions/PersonalInfoAction'
import {updateAllSettingsAction} from '../actions/SettingsAction'

//References to the root of the firestore database
const firestore = firebase.firestore();
//Firebase initialzation 
firebaseConfig

export class Login extends Component {
    state = {
        email:null,
        password:null,
        emailValid:false,
        passwordValid:false,
    }

    // Function to navigate to the CreateAcount Screen
    goToCreateAccount = () => {
        this.props.navigation.navigate('CreateAccount');
    }

    // Function to navigate to the CreateAcount Screen
    gotToForgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword');
    }

    signIn = () => {
        console.log("Login: Attempting to sign in existing user")
        let e = this.state.email
        let p = this.state.password

        // Login existing user with given username and password
        if (e != null && p != null && e.trim() != "" && p != "") {
            firebase
                .auth()
                .signInWithEmailAndPassword(e, p)
                .then(() => {
                    console.log("Login: Successfully signed in existing user!")
                    let user = firebase.auth().currentUser

                    console.log("Login: Attempting to fetch user data for user with uid=", user.uid)
                    let userRef = firestore.collection('users').doc(user.uid)

                    // Fetch User Data from firestore database
                    userRef.get().then((doc) => {
                        console.log("Login: Successfully fetched user data for user with uid=", user.uid)
                        let userData = doc.data()

                        // Update all personal info in store
                        this.props.dispatch(updateAllPersonalInfoAction(userData.personal))
                        // Update all settings info in store 
                        this.props.dispatch(updateAllSettingsAction(userData.settings))


                        // ***** Fetch RunLog from firestore database *****
                        userRef.collection("RunLog").get()
                        .then((querySnapshot) => {
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
                            console.log("Login: Error fetching run data:", error.message)
                            Alert.alert(error.message)
                        })

                        // Navigate to main
                        this.props.navigation.navigate("Main")
                    })
                    .catch((error) => {
                        console.log("Login: Error fetching user data:", error.message)
                        Alert.alert(error.message)
                        firebase.auth().signOut();
                    })

                    
                })
                .catch((error) => {
                    console.log("Login: Error signing in user:", error.message)
                    Alert.alert(error.message)
                    return
                });

                // Reset Login's state
                this.setState({email:null, password:null, emailValid:false, passwordValid:false})


        } else {
            console.log("Login: One of the fields (email, password) is empty")
            Alert.alert("Please provide a email address and password")
            return
        }
    }

    updateEmail = (text) => {
        if (text.length >= 8) {
            this.setState({email:text, emailValid:true})
        } else {
            this.setState({email:text, emailValid:false})
        }
    }

    updatePassword = (text) => {
        if (text.length >= 8) {
            this.setState({password:text, passwordValid:true})
        } else {
            this.setState({password:text, passwordValid:false})
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                <KeyboardAvoidingView style={{flex:1, marginHorizontal:20}} behavior='padding'>
                    {/*SIMPLY RUN*/}
                    <View  style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.titleText}>Simply Run</Text>
                    </View>

                    <View style={{flex:2}}>
                    
                        {/*TextInput for email address*/}
                        <TextInput
                            placeholder="Email"
                            value={this.state.email}
                            onChangeText={(text) => this.updateEmail(text)}
                            autoCapitalize='none'
                            returnKeyType={"next"}
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
                            keyboardType='email-address'
                            style={styles.textInput}
                        />


                        {/*TextInput for password*/}
                        <TextInput
                            placeholder="Password" 
                            value={this.state.password}
                            onChangeText={(text) => this.updatePassword(text)}
                            autoCapitalize='none'
                            returnKeyType={'done'}
                            ref={(input) => { this.passwordInput = input; }}
                            onSubmitEditing={() => {this.signIn()}}
                            keyboardType='email-address'
                            secureTextEntry
                            style={styles.textInput}
                        />


                        {/*Button for signing user*/}
                        <TouchableOpacity 
                            onPress={() => this.signIn()}
                            disabled={(this.state.emailValid && this.state.passwordValid ? false : true)}>
                            <View style={{
                                height:50,
                                backgroundColor: (this.state.emailValid && this.state.passwordValid ? "lightblue" : "lightgray"),
                                justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal:15,}}>
                                <Text style={{fontSize:20,color:'black'}}>Sign In!</Text>
                            </View>
                        </TouchableOpacity>


                        {/*Button for changing to the CreateAccount screen*/}
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:75}}>
                            <Text style={{fontSize:18}}>Don't have an account?</Text>
                            <Text style={{fontSize:18, color:'#076fd9', paddingLeft:10}} onPress={this.goToCreateAccount}>Sign Up!</Text>
                        </View>

                        {/*Button for resetting forgotten password*/}
                        <View style={{justifyContent:'center', alignItems:'center', height:25}}>
                            <Text style={{fontSize:18, color:'#076fd9'}} onPress={this.gotToForgotPassword}>Forgot Password?</Text>
                        </View>


                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

export default connect()(Login)

const styles = StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: 'lightgrey',
      height:50,
      maxHeight:50,
      justifyContent:'center',
      padding:8,
    },
    titleText: {
        fontSize:40,
        fontWeight:'bold',
        fontStyle:'italic',
    }
  });