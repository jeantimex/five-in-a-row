var express = require('express');
var app = express();

app.use(express.static('./public'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var connections = [];
var title = 'Untitled Presentation';

io.sockets.on('connect', function (socket) {

    socket.once('disconnect', function () {
        console.log('Disconnected: %s', socket.id);
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log('%s sockets remaining', connections.length);
    });

    socket.on('join', function (payload) {
        console.log('%s joined', payload.name);
    });

    socket.emit('welcome', {
        title: title
    });

    console.log('Connected: %s', socket.id);
    connections.push(socket);
    console.log('%s sockets connected', connections.length);

});

console.log('Server is running at http://localhost:3000');