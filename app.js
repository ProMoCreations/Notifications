var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

//global variables
var clients = {};
var clientId = 0;

//http server
var server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);

//WebSocket server
var webSocketServer = new WebSocketServer({server: server});
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
