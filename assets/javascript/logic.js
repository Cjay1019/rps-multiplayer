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
var playersRef = database.ref("/players");
var turnRef = database.ref("/turn");

// Game Variables
var player1 = null;
var player2 = null;
var player1UID = "";
var player2UID = "";
var currentUID = "";
var player1Choice = "";
var player2Choice = "";
var turn = 1;

// Click Handlers
$("#join").on("click", join);
$(".rps-images-1").on("click", function() {
  if (player1 && player2 && currentUID === player1.name && turn === 1) {
    var choice = $(this).attr("data-value");
    player1Choice = choice;
    playersRef.child("/player1/choice").set(choice);
    turn = 2;
    database
      .ref()
      .child("/turn")
      .set(2);
  }
});
$(".rps-images-2").on("click", function() {
  if (player1 && player2 && currentUID === player2.name && turn === 2) {
    var choice = $(this).attr("data-value");
    player2Choice = choice;
    playersRef.child("/player2/choice").set(choice);
    winCheck();
  }
});

// Event listener that sends game variable to the database, or resets them on disconnect
playersRef.on("value", function(snap) {
  if (snap.child("player1").exists()) {
    player1 = snap.val().player1;
    player1UID = player1.UID;
  } else {
    player1 = null;
    player1UID = "";
  }
  if (snap.child("player2").exists()) {
    player2 = snap.val().player2;
    player2UID = player2.UID;
  } else {
    player2 = null;
    player2UID = "";
  }
});

// Event listener updating turn variable
turnRef.on("value", function(snap) {
  if (snap.val() === 1) {
    turn = 1;
  } else if (snap.val() === 2) {
    turn = 2;
  }
});

// Prompt user to enter name, dictates which player they will be assigned, and fills in game variables accordingly
function join() {
  var yourName = prompt("Enter your name");
  if (yourName == null || yourName == "") {
    alert("You must enter a name");
    join();
  } else {
    $("#intro-content").hide();
    $("#game-content").show();
    if (player1 === null) {
      currentUID = yourName;
      player1 = {
        name: currentUID,
        wins: 0,
        losses: 0,
        ties: 0,
        choice: ""
      };
      playersRef.child("/player1").set(player1);
      database
        .ref()
        .child("/turn")
        .set(1);
      database
        .ref("/players/player1")
        .onDisconnect()
        .remove();
    } else if (player1 !== null && player2 === null) {
      currentUID = yourName;
      player2 = {
        name: currentUID,
        wins: 0,
        losses: 0,
        ties: 0,
        choice: ""
      };
      playersRef.child("/player2").set(player2);
      database
        .ref("/players/player2")
        .onDisconnect()
        .remove();
    }
  }
}

function winCheck() {
  switch (player1.choice) {
    case "rock":
      switch (player2.choice) {
        case "rock":
          console.log("tie");
          return;
        case "paper":
          console.log("player2 wins");
          return;
        case "scissors":
          console.log("player1 wins");
          return;
      }
    case "paper":
      switch (player2.choice) {
        case "rock":
          console.log("player1 wins");
          return;
        case "paper":
          console.log("tie");
          return;
        case "scissors":
          console.log("player2 wins");
          return;
      }
    case "scissors":
      switch (player2.choice) {
        case "rock":
          console.log("player2 wins");
          return;
        case "paper":
          console.log("player1 wins");
          return;
        case "scissors":
          console.log("tie");
          return;
      }
  }
}
