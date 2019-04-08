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
var guid;

function dateToday(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '/' + mm + '/' + dd;
  //console.log(today);
  return today;
}
function dateFuture(numDays){
  var future = new Date();
  future.setDate(future.getDate() + numDays);
  var ddF = String(future.getDate()).padStart(2, '0');
  var mmF = String(future.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyyF = future.getFullYear();
  future = yyyyF + '/' + mmF + '/' + ddF;
  //console.log(future);
  return future;
}

function addUser(userName){
    let userRef = db.ref().child("users");
    let jsonObj;
    let exist = false;
    //addRented(4312,"test");
    //deleteRent(4312);
    //addRent();
    dateTest();
    userRef.once("value", function(snapshot) {
      jsonObj = snapshot.toJSON();
      console.log(jsonObj);
      for(let i in jsonObj){
        if (i == guid) {
          exist = true;
        }
      }
      if(exist){
        console.log("exists");
        return;
      }
      else{
        console.log("doesn't exists");
        userRef = db.ref().child("users/"+guid);
        userRef.update({
          googleUID: guid,
          name: userName,
          //movies: {foo:{counter:1}}
          currentRentals: ["start"],
          pastRentals: ["start"]
          
        });
      }
    });
    
  }
  //Add movie to the users rental
export function addRent(movieID){
    let rentedRef = db.ref().child("users/"+guid+"/currentRentals");
    let jsonObj;
    let duplicate = false;
    let array;
    let newKey;

		rentedRef.once("value", function(snapshot) {
			jsonObj = snapshot.toJSON();
      //console.log(jsonObj);
      Object.keys(jsonObj).forEach(function(key,index) {
        if(jsonObj[key].mID == movieID){
          //console.log("duplicate found");
          duplicate = true;
        }
        newKey = parseInt(key,10) + 1;
      });
      
      if(duplicate){
        console.log("Already rented");
        return;
      }
      else{
        array = jsonObj;
        newKey = newKey.toString();
        array[newKey] = {mID:movieID,start:dateToday(),end:dateFuture(30)};
        db.ref("users/"+guid+"/currentRentals").update(array);
      }
		});
		
  }
  //Delete a movie for current logged in user
export function deleteRent(movieID){
    let deleteRef = db.ref().child("users/"+guid+"/currentRentals");
    let jsonObj;
    let removed = false;
    deleteRef.once("value", function(snapshot) {
			jsonObj = snapshot.toJSON();
      //console.log(jsonObj);
      Object.keys(jsonObj).forEach(function(key,index) {
        if(jsonObj[key] == movieID){
          console.log("target found");
          removed = true;
          db.ref("users/"+guid+"/currentRentals/"+key).remove();
        }
      });
      
      if(removed){
        console.log("deleted");
        return;
      }
      else{
        console.log("wasn't deleted. Perhaps doesnt exists?");
      }
		});
  }
  //get the current users rented movies in a json object
  export function getUserRented(){
    let getMoviesRef = db.ref().child("users/"+guid+"/currentRentals");
    let jsonObj;

    getMoviesRef.once("value", function(snapshot) {
			jsonObj = snapshot.toJSON();
      //console.log(jsonObj);
      return jsonObj;
      });
  }
//Get total movies rented out for all users
  export function getRentedOut(){
    let getRented = db.ref().child("users");
    let jsonObj;
    let movieCounter = 0;
    let size;
    let userCounter = 0;
    //change to on?
    getRented.once("value", function(snapshot){
      jsonObj = snapshot.toJSON();
      //console.log(jsonObj);
      Object.keys(jsonObj).forEach(function(key,index) {
        //console.log(jsonObj[key].rented);
        Object.keys(jsonObj[key].currentRentals).forEach(function(key2,index2) {
          console.log(jsonObj[key].currentRentals[key2]);
          movieCounter = movieCounter + 1;
        });
        size = Object.keys(jsonObj).length;
        userCounter = userCounter + 1;
        if (userCounter == size) {
          movieCounter = movieCounter - userCounter;
          console.log("Total rented out: " + movieCounter);
          return movieCounter;
        }
      });
    })
    
  }

  export function login(){
    var provider = new firebase.auth.GoogleAuthProvider();
  
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      console.log("UID: " + user.uid);
      guid = user.uid;
      addUser(user.displayName);
      
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log("error code: " + errorCode);
      var errorMessage = error.message;
      console.log("error Message: " + errorMessage);
      // The email of the user's account used.
      var email = error.email;
      console.log("The email used: " + email);
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("The firebase.auth.AuthCredential type used: " + credential);
      // ...
    });
  
  
  }

