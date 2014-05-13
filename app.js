//requires
var ws = require('ws');
var express = require('express');

//global variables
var clients = {};
var clientId = 0;

//Static server
var app = new express();
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Static server has started');

//WebSocket server
var webSocketServer = new ws.Server({server: app});
webSocketServer.on('connection', function(ws) {
	var userId = clientId;
	clientId++;
	clients[userId] = ws;
	console.log("new connection " + userId);
	
	ws.on('message', function(data) {
		console.log('OnMessage: ' + data);
		for(var key in clients) {
			clients[key].send(JSON.stringify({id: userId, text: data, nick: 'adminko'}));
		}
	});

	ws.on('close', function() {
		console.log('connection close ' + userId);
		delete clients[userId];
	});
});
console.log('WebSocket server has started');
