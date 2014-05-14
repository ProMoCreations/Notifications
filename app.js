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
	clients[userId] = {};
	clients[userId].ws = ws;
	clients[userId].id = userId;
	clients[userId].nick = '';
	clients[userId].isAuthorize = false;
	console.log("new connection " + userId);
	
	broadcastSend({event: 'systemchat', date: 'TODO', text: 'Подключился новый пользователь' });
	
	ws.on('message', function(data) {
		var data = JSON.parse(data);
		
		console.log('[' + userId + '] ' + JSON.stringify(data));
		if(data.event === 'chat' && clients[userId].isAuthorize)
			broadcastSend({event: 'chat', date: 'TODO', nick: clients[userId].nick, id: userId, text: data.text, icon: 'icon.png' });
		if(data.event === 'authorize' && !clients[userId].isAuthorize) {
			if(data.nick === 'admin' || data.nick === 'evgwed' || data.nick === 'elvis' || data.nick === 'formoses') {
				clients[userId].isAuthorize = true;
				clients[userId].nick = data.nick;
				userSend(userId, {event: 'authorize', id: userId, nick: data.nick});
			} else {
				userSend(userId, {event: 'authorizefail'});
			}
		}
	});

	ws.on('close', function() {
		console.log('connection close ' + userId);
		delete clients[userId];
		broadcastSend({event: 'systemchat', date: 'TODO', text: 'Пользователь отключился' });
	});
});

//отправляет сообщение всем пользователям
broadcastSend = function(message) {
	for(var key in clients) {
		if(clients[key].isAuthorize)
			userSend(key, message);
	}
};

//отправляет сообщение конкретному пользователю
userSend = function(userId, message) {
	clients[userId].ws.send(JSON.stringify(message));
}

console.log('WebSocket server has started');