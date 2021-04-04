import React, { Component } from 'react';
import { Text, View, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase'
import firebaseConfig from '../config/firebaseConfig'
import '@firebase/firestore';
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

//Firebase initialization 
firebaseConfig


export class CreateAccount extends Component {

    state = {
        email:null,
        password:null,
        confirmPassword:null,
        emailValid:false,
        passwordValid:false,
        confirmValid:false,
    }

    signUp = () => {
        console.log("CreateAccount: Attempting to sign in a new user")
        let e = this.state.email;
        let p = this.state.password;
        let p2 = this.state.confirmPassword;
        // Create new user with given username and password
        if (e != null && e.trim() != "" && p != null && p.trim() != "" && p2 != null && p2.trim() != "") {
            if (p === p2) {
                firebase
                .auth()
                .createUserWithEmailAndPassword(e, p)
                .then(() => {
                    console.log("CreateAccount: Successfully signed up new user!")
                    // Reset CreateAccount's state
                    this.setState({email:null,password:null,confirmPassword:null,emailValid:false,passwordValid:false, confirmValid:false})
                    // Navigate to 'Main'
                    this.props.navigation.navigate("InputPersonalInfo")
                })
                .catch((error) => {
                    Alert.alert(error.message)
                    return
                });

            } else {
                console.log("CreateAccount: password and confirmPassword do not match")
                Alert.alert("Passwords do not match")
                return
            }
        } else {
            console.log("CreateAccount: One of the fields (email, password, confirmPassword) is empty")
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

    updateConfirm = (text) => {
        if (text.length >= 8) {
            this.setState({confirmPassword:text, confirmValid:true})
        } else {
            this.setState({confirmPassword:text, confirmValid:false})
        }
    }

    render () {
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                <KeyboardAvoidingView style={{flex:1, marginHorizontal:20}} behavior='padding'>
                    {/*SIMPLY RUN*/}
                    <View  style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.titleText}>Simply Run</Text>
                    </View>

                    <View style={{flex:2}}>

                        {/*TextInput for email*/}
                        <TextInput
                            placeholder="Email"
                            value={this.state.email}
                            onChangeText={(text) => this.updateEmail(text)}
                            autoCapitalize='none'
                            returnKeyType={'next'}
                            onSubmitEditing={() => { this.passwordInput.focus(); }}
                            keyboardType='email-address'
                            style={styles.textInput}
                        />


                        {/*TextInput for password*/}
                        <TextInput
                            placeholder="Password" 
                            value={this.state.password}
                            onChangeText={(text) => this.updatePassword(text)}
                            secureTextEntry
                            autoCapitalize='none'
                            returnKeyType={'next'}
                            ref={(input) => { this.passwordInput = input; }}
                            onSubmitEditing={() => {this.confirm.focus()}}
                            keyboardType='email-address'
                            style={styles.textInput}
                        />


                        {/*TextInput for confirmPassword*/}
                        <TextInput
                            placeholder="Confirm Password" 
                            value={this.state.confirmPassword}
                            onChangeText={(text) => this.updateConfirm(text)}
                            secureTextEntry
                            autoCapitalize='none'
                            returnKeyType={'done'}
                            ref={(input) => { this.confirm = input; }}
                            onSubmitEditing={() => {this.signUp()}}
                            keyboardType='email-address'
                            style={styles.textInput}
                        />

                        {/*Button for signing up user*/}
                        <TouchableOpacity 
                            onPress={() => this.signUp()}
                            disabled={(this.state.emailValid && this.state.passwordValid && this.state.confirmValid ? false : true)}>
                            <View style={{
                                height:50,
                                backgroundColor: (this.state.emailValid && this.state.passwordValid && this.state.confirmValid  ? "lightblue" : "lightgray"),
                                justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal:15,}}>
                                <Text style={{fontSize:20,color:'black'}}>Sign Up!</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

export default connect()(CreateAccount);

const styles = StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: 'lightgrey',
      height:50,
      maxHeight:50,
      justifyContent:'center',
      padding:5,
    },
    titleText: {
        fontSize:40,
        fontWeight:'bold',
        fontStyle:'italic',
    }
  });