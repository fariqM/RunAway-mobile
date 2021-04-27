import React from 'react'
import { View, Text } from 'react-native'
import firebase from 'firebase';
import firebaseConfig from '../config/firebaseConfig'


firebaseConfig
const user = firebase.auth().currentUser;


const SuccessLogin = () => {
    
    return (
        
        <View>
            <Text>login berhasil</Text>
        </View>
    )
}

export default SuccessLogin
