import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig'
import { connect } from 'react-redux'

//Firebase initialzation 
firebaseConfig

export class ForgotPassword extends Component {
    state = {
        email:null,
        emailValid:false,

    }

    sendResetEmail = () => {
        // Steps: Send reset email
        if (this.state.emailValid) {
            // ERROR IN DOCUMENTATION: THIS METHOD IS SUPPOSED TO SEND A RESET CODE TO THE PROVIDED EMAIL,
            // BUT INSTEAD SENDS A LINK FROM WHICH THE USER CAN CHANGE THEIR PASSWORD... WORKS BUT NOT AS EXPECTED.

            firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert("A link to reset your password was sent to the email you provided.")
                this.props.navigation.navigate("Login")
            })
            .catch((error) => {
                console.log(error)
                Alert.alert(error.message)
            })
        }
    }

    updateEmail = (text) => {
        if (text.length >= 8) {
            this.setState({email:text, emailValid:true})
        } else {
            this.setState({email:text, emailValid:false})
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

                    <View style={{justifyContent:'center', alignItems:'center', height:75, paddingHorizontal:20}}>

                        <Text style={{fontSize:18, textAlign:'center'}}>Enter the email you use for your Simply Run account.</Text>

                        </View>
                        {/*TextInput for email address OR reset code*/}
                        <TextInput
                            placeholder="Email"
                            value={this.state.email}
                            onChangeText={(text) => this.updateEmail(text.trim())}
                            autoCapitalize='none'
                            returnKeyType={"done"}
                            keyboardType='email-address'
                            style={styles.textInput}
                        />

                        {/*Button entering for sending OR verifying the reset code */}
                        <TouchableOpacity 
                            onPress={() => this.sendResetEmail()}
                            disabled={(this.state.emailValid ? false : true)}>
                            <View style={{
                                height:50,
                                backgroundColor: (this.state.emailValid  ? "lightblue" : "lightgray"),
                                justifyContent:'center',
                                alignItems:'center',
                                paddingHorizontal:15}}>
                                <Text style={{fontSize:20,color:'black'}}>Send Reset Email</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

export default connect()(ForgotPassword)

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