import firebase from "firebase";

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

export function login() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

export function addUser(user) {
  let userRef = db.ref().child("users/" + user.uid);
  userRef.update({
    uid: user.uid,
    name: user.displayName,
    rentals: []
  });
}

export function addRent(movieID, uid) {
  let rentedRef = db.ref().child("users/" + uid + "/rentals/" + movieID);
  rentedRef.once("value", function(snapshot) {
    if (snapshot.exists()) {
      var startDate = new Date(snapshot.toJSON().start);
      var currentDate = new Date();
      var checkDate = startDate;
      checkDate.setHours(startDate.getHours() + 24);
      if (currentDate <= checkDate) {
        console.log("within rental period");
      } else {
        console.log("after rental date");
        rentedRef.update({ start: new Date() });
      }
    } else {
      console.log("path doesn't exist");
      rentedRef.update({ start: new Date() });
    }
  });
}

export function classifyRentals(uid) {
  let rentedRef = db.ref().child("users/" + uid + "/rentals");
  var active = [];
  var past = [];
  rentedRef.once("value", function(snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot);
      var jsonObj = snapshot.toJSON();
      console.log("classify rentals");
      console.log(jsonObj);
      var currentDate = new Date();
      Object.keys(jsonObj).forEach(function(key) {
        var startDate = new Date(jsonObj[key].start);
        var checkDate = startDate;
        checkDate.setHours(startDate.getHours() + 24);
        if (currentDate <= checkDate) {
          active.push(parseInt(key));
        }
        else{
          past.push(parseInt(key));
        }
      });
    }
  });
  return [active, past];
}
