import * as firebase from 'firebase';
import '@firebase/firestore';

/*
 * FIREBASE CONFIGURATION
 * This file is used for connecting the app to the firebase database using the API provided by firebase.
 */

const firebaseConfig = {
    apiKey: "AIzaSyBXrcR8_NanTt4FBBvuVWhOolHqMB9TSEY",
  authDomain: "runaway-fa0af.firebaseapp.com",
  databaseURL: "https://runaway-fa0af-default-rtdb.firebaseio.com",
  projectId: "runaway-fa0af",
  storageBucket: "runaway-fa0af.appspot.com",
  messagingSenderId: "918071183240",
  appId: "1:918071183240:web:125218a49ebbf3df355c3d"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);