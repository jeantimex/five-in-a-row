var express = require('express');
var app = express();

app.use(express.static('./public'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var title = 'Untitled Presentation';

// -----------------------------------
//  Game Server Data
// -----------------------------------

var BOARD_SIZE = 15;

function GameServer() {
    this.connections = [];
    this.board = [];
    this.currentColor = 0;
}

GameServer.prototype = {

    init: function() {
        this.board = [];

        for (var i = 0; i < BOARD_SIZE; i++) {
            this.board.push([]);

            for (var j = 0; j < BOARD_SIZE; j++) {
                this.board[i].push(-1);
            }
        }
    },

    move: function(row, col, color) {
        this.board[row][col] = color;
        this.currentColor = 1 - this.currentColor;
    },
    
    addConnection: function(connection) {
        console.log('add connection: %s', connection.socket.id);
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === connection.socket.id });

        if (idx === -1) {
            this.connections.push(connection);
        } else {
            this.connections[idx] = connection;
        }
    },

    removeConnection: function(id) {
        console.log('remove connection: %s', id);
        var idx = this.connections.findIndex(function (conn) { return conn.socket.id === id });

        if (idx > -1) {
            this.connections[idx].socket.disconnect();
            this.connections.splice(idx, 1);
        }
    },

    isColorPicked: function(color) {
        return this.connections.findIndex(function (conn) { return conn.color === color }) >= 0;
    },

    getPlayers: function() {
        var arr = [];
        for (var i = 0; i < this.connections.length; i++) {
            var conn = this.connections[i];
            if (conn.color >= 0) {
                arr.push({ id: conn.socket.id.substr(2), color: conn.color, name: conn.name });
            }
        }
        return arr;
    },

    getWatchers: function() {
        var arr = [];
        for (var i = 0; i < this.connections.length; i++) {
            var conn = this.connections[i];
            if (conn.color < 0) {
                arr.push({ id: conn.socket.id.substr(2), color: conn.color, name: conn.name });
            }
        }
        return arr;
    },

    getConnections: function() {
        return {
            players: this.getPlayers(),
            watchers: this.getWatchers()
        };
    },

    getGameData: function() {
        return {
            board: this.board,
            currentColor: this.currentColor
        };
    }
};

var game = new GameServer();
game.init();

// -----------------------------------
//  Socket.io
// -----------------------------------

io.sockets.on('connect', function (socket) {

    // -----------------------------------
    //  Events from Clients 
    // -----------------------------------

    socket.once('disconnect', function () {
        game.removeConnection(socket.id);

        io.sockets.emit('updateConnection', game.getConnections());
    });

    socket.on('join', function (payload) {
        var color = payload.color;
        var name = payload.name;

        // Sanity check
        if (color > -1 && game.isColorPicked(color)) {
            socket.emit('throw', { message: (color ? 'White' : 'Black') + ' is picked' });
            return;
        }

        game.addConnection({ socket: socket, color: color, name: name });

        io.sockets.emit('updateConnection', game.getConnections());
        io.sockets.emit('updateGame', game.getGameData());
    });

    socket.on('move', function (payload) {
        game.move(payload.row, payload.col, payload.color);

        io.sockets.emit('updateGame', game.getGameData());
    });

    // -----------------------------------
    //   Dispatch to Single Client
    // -----------------------------------

    socket.emit('updateConnection', game.getConnections());

});

console.log('Server is running at http://localhost:3000');