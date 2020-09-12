
var client = {};

(function ($) {

	// Creation du uid
	client.uid= genuid(3);
	client.passwd = genuid(30);
	client.username = client.uid;
	client.autoscroll = true;
	client.noReadMsg = 0;


	//	On verifie que l'on a pas de session
	if (getCookie("client_uid")!=null && getCookie("client_uid")!="") {
		let uid = getCookie("client_uid");
		let username = getCookie("client_username");
		let passwd = getCookie("client_passwd");
		client.uid = uid;
		client.username = username;
		client.passwd = passwd;
	}else{
		setCookie("client_uid", client.uid, 5);
		setCookie("client_username", client.username, 5);
		setCookie("client_passwd", client.passwd, 5);

	}
	console.log("COOKIE :");
	console.log(getCookie("client_uid"));
	console.log(getCookie("client_username"));



	$("#uid").text("UID : "+client.uid);
	$("#name_input").val(client.username);

	//	Room name start
	$("#room_name").text("Room : noroom");

	//	Connection au serveur
	var socket = io.connect('http://localhost:9888');
	

	//	On s'enregistre au pret du serveur
	socket.emit('register',{
		uid:client.uid,
		username:client.username,
		passwd:client.passwd
	});

	socket.on('register',function(status) {
		console.log("register : "+status);
		
		if (status) {

			//	On change le mot de passe
			client.passwd = genuid(30);
			setCookie("client_uid", client.uid, 5);
			setCookie("client_username", client.username, 5);
			setCookie("client_passwd", client.passwd, 5);

			//	On fait la maj
	    	let maj={
	    		uid:client.uid,
	    		username:client.username,
	    		passwd:client.passwd,
				publicKey:client.publicKey
	    	};

	    	//	Trigger event
			let event_changePasswd = new CustomEvent('updateMe',{"detail":maj});
			console.log("event_changePasswd "+maj+" --> trigger");
			document.dispatchEvent(event_changePasswd);

		}else{
			//	Pour que ça soit faut il faut que l'utilisateur essaye de se re-egister
			//	Donc on supprime les cookies qui sont errone et on refresh
			setCookie("client_uid", "", -5);
			setCookie("client_username","", -5);
			setCookie("client_passwd", "", -5);
			location.reload();
		}
	});

	//	update
	socket.on('update', function (update) {
		//console.log("update : ");
		//console.log(update);

		client.lastupdate = update;

		client.me = update.me;

		//	Update room list
		let roomlist = update.roomlist;

		roomlist.forEach(room => {
			screen_room_add(room);

			if (room.name==client.me.activeroom) {
				screen_message(room.messages);
			}
		});
		screen_room_clear_older(roomlist);

		//	Si on est dans aucune room
		if (client.me.activeroom==null || client.me.activeroom=="") {
			join(null,roomlist.slice(0, 1)[0].uid);

			let client_banned = getCookie("client_banned");
			if (client_banned!=null && client_banned) {

				openView(null,"SERVER_ALERT_TMP_BAN");

			}
		}
		
	});

	socket.on('SERVER_ALERT_TMP_BAN_START',function(data) {
		setCookie("client_banned", true, 5);
		openView(null,"SERVER_ALERT_TMP_BAN");
		$('#SERVER_ALERT_TMP_BAN_MESSAGE').html(data.message);
		$('footer').addClass("hide");		
	});

	socket.on('SERVER_ALERT_TMP_BAN_END',function(data) {
		setCookie("client_banned", false, -100);
		openView(null,"SERVER_ALERT_UNBAN");		
		$('#SERVER_ALERT_UNBAN_MESSAGE').html(data.message);
		$('footer').removeClass("hide");

		//on raffraichi la page
		setTimeout(function() {			
			location.reload();
		},10000);		
	});

	socket.on('join',function(room) {
		console.log("room : ");
		console.log(room);

			console.log("SET ROOM NAME");
			console.log(room);


		if (room!=false && room!=null) {
			//	Clear screen
			$("#screen_message").empty();
			$("#screen_message").removeClass();
			$("#screen_message").addClass("hideScrollBar");
			$("#room_name").text("Room : "+room.name);

			

			console.log($(".room"));
			let r = $(".room");
			for (var i = 0; i < r.length; i++) {
				let elem = r[i];
				$(elem).removeClass("activeroom");
				if (("room_"+room.uid)==$(elem).attr("id")) {
					$(elem).addClass("activeroom");
				}
			}
		}
	});

	document.addEventListener('join', function(e){

		console.log("join "+e.detail+" --> sent");
		socket.emit('join',{
			room_name:e.detail
		});

	}, false);


	document.addEventListener('create', function(e){

		console.log("create "+e.detail+" --> sent");
		socket.emit('create',{
			room_name:e.detail
		});

	}, false);

	document.addEventListener('updateMe', function(e){

		console.log("updateMe "+e.detail+" --> sent");
		socket.emit("me",{
	    		uid:e.detail.uid,
	    		username:e.detail.username,
	    		passwd:e.detail.passwd,
				publicKey:e.detail.publicKey
	    	});

	}, false);


	document.addEventListener('share', function(e){

		console.log("share "+e.detail.protocole+" --> sent");
		socket.emit(e.detail.protocole,{
			room_name:client.me.activeroom, 
			sender:client.me,
			url:e.detail.url,
			type:e.detail.type
		});

	}, false);

	//	Envoi des messages

	$('#message').keypress(function(e){

		let text = $('#message').val();
	    if( e.which == 13 && text!=null && text.trim()!="" && client.me.activeroom!=null){

        	if (!event.shiftKey){

        		socket.emit('message',{
		        	room_name:client.me.activeroom,
		        	sender:client.me,
		        	text:text
		        });
		        $('#message').val('');
        	}else{        		
		        $('#message').val($('#message').val()+"<br>");
        	}
	        
	    }
	});

	//	On set le username
	$("#name_input").keypress(function(e){

		let text = $('#name_input').val();

		if (!$('#name_input').hasClass("name_Notvalide")) {
	    	$('#name_input').removeClass("name_valide");
			$('#name_input').addClass("name_notValide");			
		}

	    if( e.which == 13 && text!=null && text!="" ){	 

			client.username = text;
			client.me.username = text;

			setCookie("client_uid", client.uid, 5);
			setCookie("client_username", text, 5);

			let maj={
	    		uid:client.uid,
	    		username:client.username,
	    		passwd:client.passwd,
				publicKey:client.publicKey
	    	};

	    	//	Trigger event
			let event_changeName = new CustomEvent('updateMe',{"detail":maj});
			console.log("event_changeName "+maj+" --> trigger");
			document.dispatchEvent(event_changeName);

	    	$('#name_input').removeClass("name_notValide");
	    	$('#name_input').addClass("name_valide");
	    }

	});



	//	La fenetre se ferme
	window.addEventListener('beforeunload', (event) => {

		//	on deconnecte
		socket.emit('disconnect',true);
	});


	// on gere l'autoscroll
	$( "#screen_message" ).scroll(function() {

		//console.log("H : "+$("#screen_message")[0].scrollHeight+" T : "+$("#screen_message").scrollTop()+" Size : "+($("#screen_message")[0].scrollHeight-$("#screen_message").scrollTop()));

		if (($("#screen_message")[0].scrollHeight-$("#screen_message").scrollTop())<700) {
			client.autoscroll = true;
		}else{
			client.autoscroll = false;
		}
	});


})(jQuery);


function genuid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var charactersLength = characters.length;


   	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + ""
	                + currentdate.getHours() + ""  
	                + currentdate.getMinutes();


	for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return datetime+result;
}


function screen_room_add(room) {
	let screen_room = $("#screen_room");
	if (!screen_room.hasClass(room.uid)) {
		screen_room.addClass(room.uid);
		screen_room.append("<button id='room_"+room.uid+"' class='room' onclick='join(event,\""+room.uid+"\")'>"+room.name+"<i class='id'>["+room.uid+"]</i></button>");
	}
}

function screen_room_clear_older(roomlist) {

	let screen_room = $("#screen_room");

	let classList = screen_room.attr('class').split(/\s+/);

	classList.forEach(classe => {
		if (roomlist.find(room => room.uid == classe)==undefined && !(classe=="side_screenContent" || classe=="hideScrollBar" || classe=="tabcontent" || classe=="show")) {
			screen_room.removeClass(classe);
			$("#room_"+classe).remove();
		}
	});


}

function screen_message(messages) {

	let screen_message = $("#screen_message");
	
	messages.forEach(message =>{

		if (!screen_message.hasClass(message.uid)) {
			screen_message.addClass(message.uid);

			if (message.sender.uid==client.uid) {
				screen_message.append("<div id='message_"+message.uid+"' class='message message_me'><b>"+message.sender.username+"</b><i class='id noblock'>("+message.sender.uid+")</i><p>"+message.text+"</p></div>");
			}else{
				screen_message.append("<div id='message_"+message.uid+"' class='message'><b>"+message.sender.username+"</b><i class='id noblock'>("+message.sender.uid+")</i><p>"+message.text+"</p></div>");
			}

			//	on scrool
			if (client.autoscroll) {
				$("#screen_message").scrollTop($("#screen_message")[0].scrollHeight);
				console.log("SCROLL");
			}else{
				client.noReadMsg++;
			}

			
			
		}
	});
}

function join(e,room_name){


	//	Trigger event
	let event = new CustomEvent('join',{"detail":room_name});
	console.log("join "+room_name+" --> trigger");
	document.dispatchEvent(event);
}

function createRoom(event){

	let room_name = $('#room_name_input').val();
	//	Trigger event
	let event_createRoom = new CustomEvent('create',{"detail":room_name});
	console.log("create "+room_name+" --> trigger");
	document.dispatchEvent(event_createRoom);
}