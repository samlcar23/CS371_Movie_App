import firebase from 'firebase'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCKyXxK_2worZ-8lVvyhTH8O-s8eu8ZCaQ",
    authDomain: "movieapp-6402e.firebaseapp.com",
    databaseURL: "https://movieapp-6402e.firebaseio.com",
    projectId: "movieapp-6402e",
    storageBucket: "movieapp-6402e.appspot.com",
    messagingSenderId: "1010297229821"
};
firebase.initializeApp(config);
export const db = firebase.database();