# Gomoku (Five in a Row)
**Gomoku** is an abstract strategy board game. Also called **Omok** or **Five in a Row**, it is said to have originated in China with the name Wu Zi Qi (五子棋). It is traditionally played with Go pieces (black and white stones) on a go board with 15x15 intersections; however, because once placed, pieces are not moved or removed from the board; gomoku may also be played as a paper and pencil game. This game is known in several countries under different names.

Black plays first if white did not just win, and players alternate in placing a stone of their color on an empty intersection. The winner is the first player to get an unbroken row of five stones horizontally, vertically, or diagonally.

#### Screenshot

![Game Page](http://jinandsu.net/download/gomoku/gomoku.png)

#### Architecture

This is application is built with the following libraries/frameworks:

###### Server Side
* Node.js
* Express
* Webpack
* Socket.io

###### Client Side
* React
* React Router
* Material UI

Since it's a turn-based game, we don't want to store the game state on the client side, the idea is simple, let the server side manages the game state and push it down to all the clients, and the clients are simply presentational components which only render UI with the data received from server.

![Work Flow](http://jinandsu.net/download/gomoku/workflow.png)

#### Install
Clone or download the project to your local computer, run
```
$npm install
$npm start
```
open browser and go to http://localhost:3000 and have fun!
