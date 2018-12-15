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
var outcomeRef = database.ref("/outcome");
var chatRef = database.ref("/chat");

// Game Variables
var player1 = null;
var player2 = null;
var player1UID = "Player 1";
var player2UID = "Player 2";
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
    player1UID = player1.name;
    $("#player-1-label").text(player1UID);
    $("#player-2-status").text("");
  } else {
    player1 = null;
    player1UID = "Player 1";
    $("#player-1-label").text(player1UID);
    $("#player-2-status").text("Waiting for an Opponent");
  }
  if (snap.child("player2").exists()) {
    player2 = snap.val().player2;
    player2UID = player2.name;
    $("#player-2-label").text(player2UID);
    $("#player-1-status").text("");
  } else {
    player2 = null;
    player2UID = "Player 2";
    $("#player-2-label").text(player2UID);
    $("#player-1-status").text("Waiting for an Opponent");
  }
  if (snap.child("player1").exists() && snap.child("player2").exists()) {
    $("#player1-wins").text("Wins: " + player1.wins);
    $("#player1-losses").text("Losses: " + player1.losses);
    $("#player1-ties").text("Ties: " + player1.ties);
    $("#player2-wins").text("Wins: " + player2.wins);
    $("#player2-losses").text("Losses: " + player2.losses);
    $("#player2-ties").text("Ties: " + player2.ties);
  }
  if (
    snap.child("player1").exists() &&
    snap.child("player2").exists() &&
    turn === 1
  ) {
    $("#player-1-status").text("Choose your weapon!");
    $("#player-2-status").text(player1UID + " is choosing");
  }
  if (!player1 && !player2) {
    database.ref("/chat/").remove();
    $("#chat-content").empty();
  }
});

playersRef.on("child_removed", function(snap) {
  var msg = snap.val().name + " has left the game.";
  chatRef.set(msg);
});

playersRef.on("child_added", function(snap) {
  var msg = snap.val().name + " has joined the game.";
  chatRef.set(msg);
});

chatRef.on("value", function(snap) {
  msg = $("<p>").text(snap.val());
  $("#chat-content").append(msg);
});

// Event listener updating turn variable
turnRef.on("value", function(snap) {
  if (snap.val() === 1) {
    turn = 1;
  } else if (snap.val() === 2) {
    turn = 2;
    $("#player-2-status").text("Choose your weapon!");
    $("#player-1-status").text(player2UID + " is choosing");
  }
});

outcomeRef.on("value", function(snap) {
  if (snap.val() === "") {
    return;
  } else if (snap.val() === "rockWin") {
    $("#player-1-status").text(player1UID + " chose rock and won!");
    $("#player-2-status").text(player2UID + " chose scissors and lost!");
  } else if (snap.val() === "rockLoss") {
    $("#player-1-status").text(player1UID + " chose rock and lost!");
    $("#player-2-status").text(player2UID + " chose paper and won!");
  } else if (snap.val() === "rockTie") {
    $("#player-1-status").text(player1UID + " chose rock and tied!");
    $("#player-2-status").text(player2UID + " chose rock and tied!");
  } else if (snap.val() === "paperWin") {
    $("#player-1-status").text(player1UID + " chose paper and won!");
    $("#player-2-status").text(player2UID + " chose rock and lost!");
  } else if (snap.val() === "paperLoss") {
    $("#player-1-status").text(player1UID + " chose paper and lost!");
    $("#player-2-status").text(player2UID + " chose scissors and won!");
  } else if (snap.val() === "paperTie") {
    $("#player-1-status").text(player1UID + " chose paper and tied!");
    $("#player-2-status").text(player2UID + " chose paper and tied!");
  } else if (snap.val() === "scissorsWin") {
    $("#player-1-status").text(player1UID + " chose scissor and won!");
    $("#player-2-status").text(player2UID + " chose paper and lost!");
  } else if (snap.val() === "scissorsLoss") {
    $("#player-1-status").text(player1UID + " chose scissors and lost!");
    $("#player-2-status").text(player2UID + " chose rock and won!");
  } else if (snap.val() === "scissorsTie") {
    $("#player-1-status").text(player1UID + " chose scissors and tied!");
    $("#player-2-status").text(player2UID + " chose scissors and tied!");
  }
  outcomeRef.set("");
  setTimeout(function() {
    turnRef.set(1);
    $("#player-1-status").text("Choose your weapon!");
    $("#player-2-status").text(player1UID + " is choosing");
  }, 3000);
});

// Prompt user to enter name, dictates which player they will be assigned, and fills in game variables accordingly
function join() {
  if (player1 && player2) {
    alert("Game is full!");
  } else {
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
}

function winCheck() {
  switch (player1.choice) {
    case "rock":
      switch (player2.choice) {
        case "rock":
          playersRef.child("/player1/ties").set(player1.ties + 1);
          playersRef.child("/player2/ties").set(player2.ties + 1);
          outcomeRef.set("rockTie");
          return;
        case "paper":
          playersRef.child("/player1/losses").set(player1.losses + 1);
          playersRef.child("/player2/wins").set(player2.wins + 1);
          outcomeRef.set("rockLoss");
          return;
        case "scissors":
          playersRef.child("/player1/wins").set(player1.wins + 1);
          playersRef.child("/player2/losses").set(player2.losses + 1);
          outcomeRef.set("rockWin");
          return;
      }
    case "paper":
      switch (player2.choice) {
        case "rock":
          playersRef.child("/player1/wins").set(player1.wins + 1);
          playersRef.child("/player2/losses").set(player2.losses + 1);
          outcomeRef.set("paperWin");
          return;
        case "paper":
          playersRef.child("/player1/ties").set(player1.ties + 1);
          playersRef.child("/player2/ties").set(player2.ties + 1);
          outcomeRef.set("paperTie");
          return;
        case "scissors":
          playersRef.child("/player1/losses").set(player1.losses + 1);
          playersRef.child("/player2/wins").set(player2.wins + 1);
          outcomeRef.set("paperLoss");
          return;
      }
    case "scissors":
      switch (player2.choice) {
        case "rock":
          playersRef.child("/player1/losses").set(player1.losses + 1);
          playersRef.child("/player2/wins").set(player2.wins + 1);
          outcomeRef.set("scissorsLoss");
          return;
        case "paper":
          playersRef.child("/player1/wins").set(player1.wins + 1);
          playersRef.child("/player2/losses").set(player2.losses + 1);
          outcomeRef.set("scissorsWin");
          return;
        case "scissors":
          playersRef.child("/player1/ties").set(player1.ties + 1);
          playersRef.child("/player2/ties").set(player2.ties + 1);
          outcomeRef.set("scissorsTie");
          return;
      }
  }
}
