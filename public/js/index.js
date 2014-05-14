$(document).ready(function(){
	wsInit();
	$('#message').keydown(function(eventObject){
		if(eventObject.which == 13)
		{
			MessageSend($('#message').val());
		}
	});
	if(window.webkitNotifications)
	{
		//Click по кнопке Авторизоваться
		$('#btn-login-popup').click(function(event) {
			window.webkitNotifications.requestPermission();
		});
	}
	//Клик по кнопке Войти в popUp
	$('#btn-login').click(function(){
		if(ws != null)
		{
			var nick = $('#login-nick').val();
			if(nick!='')
			{
				ws.send(JSON.stringify({event: 'authorize', nick: nick}));
			}
			else
			{
				$("#error-popup").html("<b>Ошибка!</b> Логин не может быть пустым.").fadeIn(200);
			}
		}
		else
		{
			$("#error-popup").html("<b>Ошибка!</b> Пользователь с данным логином не найден.").fadeIn(200);
		}
	});
	MessageSend = function(msg){
		console.log(msg);
		ws.send(JSON.stringify({event: 'chat', nick: $('#login-nick').val(), text: $('#message').val()}));
	}
	ScrollToBottom = function(idElement){
		var d = $('#'+idElement);
		d.scrollTop(d.prop("scrollHeight"));
	}
});