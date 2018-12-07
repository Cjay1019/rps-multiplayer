// Initialize Firebase
var config = {
  apiKey: "AIzaSyAP5EtaIRUYO8N3R6tQtDtUalKxHGESQiI",
  authDomain: "rps-multiplayer-c9b04.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-c9b04.firebaseio.com",
  projectId: "rps-multiplayer-c9b04",
  storageBucket: "rps-multiplayer-c9b04.appspot.com",
  messagingSenderId: "586233932884"
};
firebase.initializeApp(config);

// Initialize animations and launch page
new WOW().init();
$("#game-content").hide();

// Database reference
var database = firebase.database();
var usersRef = database.ref("/users");

var currentPlayer = 0;
var activeUsers = 0;

// Click handlers
$("#join").on("click", join);

function join() {
  var playerName = prompt("Enter your name");
  if (playerName == null || playerName == "") {
    return;
  } else {
    $("#intro-content").hide();
    $("#game-content").show();
    activeUsers++;
    usersRef.once("value").then(function(snap) {
      if (snap.numChildren() == 0) {
        usersRef.update({ player1: playerName });
      } else if (snap.child("player1").exists()) {
        usersRef.update({ player2: playerName });
      }
    });
  }
}
