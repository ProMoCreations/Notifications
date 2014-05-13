var myId = 1356;

showMessage = function(data) {
	var chatWindow = $('#chatWindow');
	chatWindow.append($('<div>').text(data.text));
	if(data.id !== myId) {
		showNotification(data.nick, data.text);		
	}
};

showNotification = function(sender, text) {
	if (window.webkitNotifications.checkPermission() == 0) {
		var noty = window.webkitNotifications.createNotification('icon.png', 'Сообщение от ' + sender, text);
		noty.show();
		setTimeout(function(){
			noty.cancel();
		}, 3000);
	}
	else
	{
		window.webkitNotifications.requestPermission();
	}
};

var ws = null;

wsInit = function() {
	var host = location.origin.replace(/^http/, 'ws')
	ws = new WebSocket(host);
	ws.onopen = function() { 
		$('#sendButton').show();
	};
	
	ws.onclose = function() { 
		setTimeout(function(){
			location.reload();
		}, 3000);
	};

	ws.onmessage = function(event) {
		var incomingMessage = JSON.parse(event.data);
		showMessage(incomingMessage);
	};
};

$(document).ready(function(){
	$('#sendButton').hide();

	wsInit();
	
	$('#sendButton').click(function(){
		window.webkitNotifications.requestPermission();
		var outgoingMessage = document.getElementById('message').value;
		ws.send(outgoingMessage);
	});
});
