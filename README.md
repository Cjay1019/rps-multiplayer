# Multiplayer Rock Paper Scissors

This game was made to demonstrate how Firebase can be used to facilitate dynamic and live updating content across multiple DOM's simultaneously. As players play the game, data is stored and referenced from Firebase, to make the game functional, as well as displaying the appropriate information to both players.

## How the game is played

On page load, the user sees a lunch screen with some information, as well as a join button. Upon clicking said button, the player receives a alert. If 2 players are already connected, the user is alerted that the game is full. If not, the user receives a prompt asking for a username. If the player doesn't answer or provides a blank name, they receive the prompt again. Once a name is entered, the game screen is displayed. If the user is the first to join, they are assigned player 1 and they're name is displayed on the screen.

Th user is shown a screen that displays player names, scores, a chat box, and 3 large avatars of the classic rock paper scissors choices. If one player has already joined, the same applies, except this user is assigned player 2. Once 2 players are connected, the game begins. Prompts are displayed telling player 1 they must choose first, and player 2 that they must wait. Once Player 1 clicks a choice, the prompts switch and reflect that it is now player 2's turn. Once both players have chosen an outcome is decided and displayed, and the scores below are updated, then the game restarts after 3 seconds. If at any point one of the players disconnects, they're name and scores are removed from the screen, and the remaining player is notified that they must wait for a new opponent.

The chat box at the bottom of the screen functions as a communication tool between the players. It can be collapsed and expanded with the button labeled chat. Anytime a player connects or disconnects, all active players are notified. Any player can type a message into the chat box, then press enter or submit. The messages content is then displayed in the chat box, with a label showing who sent the message.

## How it Works

This game predominantly functions through javascript communicating with firebase. When a user tries to join the game, the logic checks to see if player 1 and/or player 2 exists, and then assigns them to the accordingly variable if applicable. As with most of the functions within this application, first the data is stored to firebase, and then is pulled back and stored in the local instance with event listeners. This process applies to joining the game, making a choice in game, automatic chat alerts, updating scores, and player entered chat messages. When user choices have been sent to firebase and then pulled and stored locally, a switch statement is passed in the answers to calculate the outcome of the game. It's that simple: user input -> send to firebase -> pull and store locally -> run logic/print information accordingly -> rinse and repeat!
