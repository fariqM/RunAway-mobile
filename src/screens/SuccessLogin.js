import React from 'react'
import { View, Text } from 'react-native'
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig'


firebaseConfig
const user = firebase.auth().currentUser;


const SuccessLogin = () => {
    const user = firebase.auth().currentUser;
    return (
        
        <View>
            <Text>{{ user }}</Text>
        </View>
    )
}

export default SuccessLogin
