var myId = 1356;

// показать сообщение в div#subscribe
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

$(document).ready(function(){
	$('#sendButton').hide();

	var host = location.origin.replace(/^http/, 'ws')
	var socket = new WebSocket(host);
	socket.onopen = function() { 
		$('#sendButton').show();
	};
	
	socket.onclose = function() { 
		setTimeout(function(){
			location.reload();
		}, 3000);
	};

	socket.onmessage = function(event) {
		var incomingMessage = JSON.parse(event.data);
		showMessage(incomingMessage);
	};
	
	$('#sendButton').click(function(){
		window.webkitNotifications.requestPermission();
		var outgoingMessage = document.getElementById('message').value;
		socket.send(outgoingMessage);
	});
});
