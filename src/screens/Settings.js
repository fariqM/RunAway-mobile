import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig';
import { connect } from 'react-redux';
import {convertInchesToCentimeters, convertPoundsToKilograms} from '../constants/ConversionFunctions';
import {resetAllAction} from '../actions/PersonalInfoAction';
import {resetRunsAction} from '../actions/RunLogAction';
import {resetAllSettingsAction} from '../actions/SettingsAction';

//References to the root of the firestore database
const firestore = firebase.firestore();
//Firebase initialzation 
firebaseConfig

export class Settings extends Component {
    state = {
        visible: false,
        password: "",
    };

    _showDialog = () => this.setState({ visible: true });

    _hideDialog = () => this.setState({ visible: false, password: "" });

    render() {
        return (
            <Provider>
                <ScrollView>
                    <View>
                        <Text style = {styles.title}>My Profile</Text>
                        <Text style = {styles.text}> Name: {this.props.name}</Text>
                        <Text style = {styles.text}> Email: {this.props.email}</Text>
                        <Text style = {styles.text}> Height: {(this.props.metric ? 
                            (Math.floor(this.props.height / 100) + "m " + Math.round(this.props.height % 100) 
                            + "cm") : (Math.floor(this.props.height / 12) + "' ") + Math.round(this.props.height % 12) 
                            + '"')}</Text>
                        <Text style = {styles.text}> Weight: {this.props.weight} {(this.props.metric ? "kg" : "lbs")}</Text>
                        <Text style = {styles.text}> Sex: {this.props.sex}</Text>
                        <Text style = {styles.text}> Age: {this.props.age}</Text>
                        <Text> </Text>
                        <Text style = {styles.title}>Settings</Text>
                        <Text style = {styles.text}> Unit: {(this.props.metric ? "Metric" : "Imperial")} </Text>
                        <Text style = {styles.text}> Stats Displayed: {this.props.stats_to_display} </Text>
                        {/* <Text style = {styles.text}> Audio Updates: {(this.props.update_frequency ? "On" : "Off")} </Text> */}
                        {/* Button to update email address and/or password */}
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={() => {
                                this.props.navigation.navigate("EMAILPASSWORD");
                                }
                            }>
                            <Text style={styles.buttonText}>Update Email/Password</Text>
                        </TouchableOpacity>
                        {/* Button to edit non-email/password portions of profile */}
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                this.props.navigation.navigate("EDIT");
                                }
                            }>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        {/* Logout button. Redirects to login screen. */}
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => {
                                this.props.dispatch(resetAllAction());
                                this.props.dispatch(resetRunsAction());
                                this.props.dispatch(resetAllSettingsAction());
                                firebase.auth().signOut().then(() => {
                                    console.log("Logout successful");
                                    this.props.navigation.navigate("Login");
                                }).catch(() => {
                                    console.log("ERROR: problem logging user out");
                                })
                                }
                            }>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                        {/* Allows user to delete their account. Requires re-authentication. Redirects to login screen once user provides password
                        and confirms via dialog box. */}
                        <View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={this._showDialog}>
                                <Text style={styles.buttonText}>Delete Account</Text>
                            </TouchableOpacity>
                            <Portal>
                                <Dialog
                                    visible={this.state.visible}
                                    onDismiss={this._hideDialog}>
                                    <Dialog.Title>Delete Account</Dialog.Title>
                                    <Dialog.Content>
                                        <Paragraph>This action requires enhanced security. Please provide your password:</Paragraph>
                                        <TextInput
                                        placeholder="Password" 
                                        value={this.state.password}
                                        onChangeText={(text) => this.setState({password: text})}
                                        textContentType='oneTimeCode'
                                        secureTextEntry
                                        autoCapitalize='none'
                                        returnKeyType={'next'}
                                        ref={(input) => { this.passwordInput = input; }}
                                        onSubmitEditing={() => {this.confirm.focus()}}
                                        keyboardType='email-address'
                                        style={styles.textInput}
                                        />
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={() => {
                                            var credential = firebase.auth.EmailAuthProvider.credential(
                                                this.props.email,
                                                this.state.password
                                            );
                                            firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
                                                Alert.alert(
                                                    'Warning',
                                                    'Are you sure you want to delete your account? This cannot be undone.',
                                                    [
                                                        {
                                                            text: "Yes", onPress: () => {
                                                                var user = firebase.auth().currentUser;
                                                                var uid = user.uid;
                                                                // deletes firestore entry, then deletes firebase auth object
                                                                firestore.collection('users').doc(uid).delete().then(() => {
                                                                    console.log("Account " + this.props.name + " removed from firestore");
                                                                    user.delete().then(() => {
                                                                        console.log("Account " + this.props.name + " from firebase auth.");
                                                                    }).catch(() => {
                                                                        console.log("ERROR: problem deleting user from firebase auth");
                                                                        this._hideDialog;
                                                                    })
                                                                    this.props.navigation.navigate('Login');
                                                                }).catch(() => {
                                                                    console.log("ERROR: problem deleting user from firestore.");
                                                                    this._hideDialog;
                                                                })
                                                            }
                                                        },
                                                        {text: 'No', style: 'cancel'}
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }).catch((error) => {
                                                console.log("DeleteAccount: An error occurred while reauthenticating");
                                                Alert.alert("An error occurred while reauthenticating");
                                            });
                                            }}>Confirm</Button>
                                        <Button onPress={this._hideDialog}>Cancel</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>
                    </View>
                </ScrollView>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        height:50,
        maxHeight:50,
        justifyContent:'center',
        padding:5,
        margin: 5
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        padding: 5
    },
    text: {
        textAlign: "center",
        padding: 2
    },
    editButton: {
        marginLeft: 104,
        marginRight: 104,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#A44CA0',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
      updateButton: {
        marginLeft: 104,
        marginRight: 104,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#C44CA0',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
    buttonText: {
        color:'#fff',
        textAlign:'center',
        paddingLeft : 25,
        paddingRight : 25
      },
    deleteButton: {
        marginLeft: 104,
        marginRight: 104,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#F05353',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
    logoutButton: {
        marginLeft: 104,
        marginRight: 104,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#4dff4d',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      }
});

function mapStateToProps(state) {
    return {
        // all local states based on global props so that when editSettings changes them, they are updated here
        name: state.PersonalInfoReducer.name,
        email: state.PersonalInfoReducer.email,
        age: Math.floor(((Math.round(new Date().getTime()/1000)) - state.PersonalInfoReducer.birthday)/(3600*24*365)),
        height: ((state.SettingsReducer.metric) ?  (convertInchesToCentimeters(state.PersonalInfoReducer.height)) : 
            state.PersonalInfoReducer.height),
        weight: ((state.SettingsReducer.metric) ? (convertPoundsToKilograms(state.PersonalInfoReducer.weight)) :
            state.PersonalInfoReducer.weight),
        sex: state.PersonalInfoReducer.sex,

        stats_to_display: ("" + ((state.SettingsReducer.display_time) ? "Time, " : "")
            + ((state.SettingsReducer.display_pace) ? "Pace, " : "")
            + ((state.SettingsReducer.display_distance) ? "Distance, " : "")
            + ((state.SettingsReducer.display_calories) ? "Calories, " : "")).slice(0, -2),
        display_calories: state.SettingsReducer.display_calories,
        display_distance: state.SettingsReducer.display_distance,
        display_pace: state.SettingsReducer.display_pace,
        display_time: state.SettingsReducer.display_time,
        metric: state.SettingsReducer.metric,
        update_frequency: state.SettingsReducer.update_frequency,
    }
}

export default connect(mapStateToProps)(Settings);