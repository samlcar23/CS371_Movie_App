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
  var update = userRef.update({
    uid: user.uid,
    name: user.displayName,
    rentals: []
  });
  
  update.then(snapshot => {location.reload()});

}

export function addRent(movieID, uid) {
  let rentedRef = db.ref().child("users/" + uid + "/rentals/" + movieID);
  rentedRef.once("value", function(snapshot) {
    if (snapshot.exists()) {
      var startDate = new Date(snapshot.toJSON().start);
      var currentDate = new Date();
      var checkDate = startDate;
      checkDate.setHours(startDate.getHours() + 24);
      if (currentDate > checkDate) {
        rentedRef.update({ start: new Date() });
      }
    } else {
      rentedRef.update({ start: new Date() });
    }
  });
}

export function updatePayment(num, csv, date, uid) {
  let paymentRef = db
    .ref()
    .child("users/" + uid + "/paymentMethod/creditCard/");
  paymentRef.update({ number: num });
  paymentRef.update({ csv: csv });
  paymentRef.update({ date: date });
}

export function deletePayment(uid) {
  let paymentRef = db.ref().child("users/" + uid + "/paymentMethod/");
  paymentRef.remove();
}

export function classifyRentals(uid) {
  let rentedRef = db.ref().child("users/" + uid + "/rentals");
  var active = [];
  var past = [];
  rentedRef.once("value", function(snapshot) {
    if (snapshot.exists()) {
      var jsonObj = snapshot.toJSON();
      var currentDate = new Date();
      Object.keys(jsonObj).forEach(function(key) {
        var startDate = new Date(jsonObj[key].start);
        var checkDate = startDate;
        checkDate.setHours(startDate.getHours() + 24);
        if (currentDate <= checkDate) {
          active.push(parseInt(key));
        } else {
          past.push(parseInt(key));
        }
      });
    }
  });
  return [active, past];
}
