var myId = -1;
var nickUser = 'none';
showMessage = function(nick, text) {
	$("#messages").append('<p><b>'+nick+':</b> '+text+'</p>');
	ScrollToBottom('messages');
	$('#message').val('');	
};

showNotification = function(sender, text) {
	if(window.webkitNotifications) {
		if (window.webkitNotifications.checkPermission() == 0) {
			var noty = window.webkitNotifications.createNotification('avatars/'+sender+'.jpg', 'Сообщение от ' + sender, text);
			noty.show();
			setTimeout(function(){
				noty.cancel();
			}, 5000);
		}
		else
		{
			window.webkitNotifications.requestPermission();
		}
	}
};

var ws = null;

wsInit = function() {
	var host = location.origin.replace(/^http/, 'ws')
	ws = new WebSocket(host);
	ws.onopen = function() {
	};

	ws.onclose = function() { 
		setTimeout(function(){
			location.reload();
		}, 5000);
	};

	ws.onmessage = function(event) {
		console.log(event.data);
		var inMsg = JSON.parse(event.data);
		if(inMsg.event == 'authorize')
		{
			myId = inMsg.id;
			$('#message').removeAttr('disabled');
			$('#myModal').modal('hide');
			$("#btn-login-popup").hide();
		}
		if(inMsg.event == 'authorizefail')
		{
			myId = -2;
			$("#error-popup").html("<b>Ошибка!</b> Пользователь с таким Логином не найден.").fadeIn(200);
			$('#message').attr('disabled','disabled');
		}
		if (inMsg.event == 'chat'||inMsg.event == 'systemchat') 
		{
			showMessage(inMsg.nick || 'system', inMsg.text);
		}
		if(inMsg.event === 'chat' && myId != inMsg.id){
			showNotification(inMsg.nick, inMsg.text);
		}
	};
};