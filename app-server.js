var express = require('express');
var app = express();

app.use(express.static('./public'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var title = 'Untitled Presentation';

// -----------------------------------
//  Game Server Data
// -----------------------------------

function GameServer() {
    this.connections = [];
}

GameServer.prototype = {
    
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
    }
};

var game = new GameServer();

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
    });

    // -----------------------------------
    //   Dispatch to Single Client
    // -----------------------------------

    socket.emit('updateConnection', game.getConnections());

});

console.log('Server is running at http://localhost:3000');