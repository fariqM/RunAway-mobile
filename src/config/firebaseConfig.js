import * as firebase from 'firebase';
import '@firebase/firestore';

/*
 * FIREBASE CONFIGURATION
 * This file is used for connecting the app to the firebase database using the API provided by firebase.
 */

const firebaseConfig = {
    apiKey: "AIzaSyCaEci1Cne4c4X2JIIulil6HfkkmXz-tag",
    authDomain: "simplyrun-11ef9.firebaseapp.com",
    databaseURL: "https://simplyrun-11ef9.firebaseio.com",
    projectId: "simplyrun-11ef9",
    storageBucket: "simplyrun-11ef9.appspot.com",
    messagingSenderId: "496070112811",
    appId: "1:496070112811:web:2640fe91afc42c8caa1c6e",
    measurementId: "G-VKENEKYQB4"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);