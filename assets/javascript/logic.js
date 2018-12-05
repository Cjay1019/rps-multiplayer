// Initialize Firebase
var config = {
  apiKey: "AIzaSyB1PfwyPzlpdag3n_roSKD2ToFBW-Yz1cI",
  authDomain: "rps-multiplayer-67213.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-67213.firebaseio.com",
  projectId: "rps-multiplayer-67213",
  storageBucket: "",
  messagingSenderId: "299883516541"
};
firebase.initializeApp(config);

// Initialize animations
new WOW().init();

$("#game-content").hide();
// Database Reference
var database = firebase.database();
var snapshot;
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  connectionsRef.numChildren();
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

database.ref().on("value", function(snap) {});

connectionsRef.on("value", function(snap) {
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});

$("#join").on("click", function() {
  $("#intro-content").hide();
  $("#game-content").show();
});
