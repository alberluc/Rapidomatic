$(window).ready(function(){

	$(".form-join").submit(function(e){

		e.preventDefault();
		var user = {
			pseudo: $("#user-pseudo").val(),
			room: $("#user-room").val()
		};

		socket.emit("user-join", user);
		showPage("lobby");

	});

	$("#ok").click(function(){
		socket.emit("reponse-join", true);
		$("#ask-dialog").hide();
	});

	$("#cancel").click(function(){
		socket.emit("reponse-join", false);
		$("#ask-dialog").hide();
	});

	socket.on("ask-join", function(){

		$("#ask-dialog").show();

	});

	socket.on("return-join", function(message=null){

		showPage("");
		if(message!=null){
			$("main>div").append("<div class='box-message'>");
			$(".box-message").append("<p class='message'>" + message + " ");
			setInterval(function(){
					$(".message").append(".");
			}, 450);
			setTimeout(function(){
				$(".box-message").remove();
				showPage('join');
			}, 1500);
		}
		else{
			showPage('join');
		}

	});

	socket.on("start-lobby-timer", function(sec){

		$(".main-lobby").append("<div class='lobby-decompte'>");
		$(".lobby-decompte").text(sec);
		var timer = setInterval(function(){
			sec--;
			$(".lobby-decompte").text(sec);
			if(sec == 0)
				clearInterval(timer);
		}, 1000);

	});

	socket.on("start-game", function(room){

		showPage('game');
		$(".players-infos").empty();
		$(".players-infos").append("<div class='players-name'>");
		for (var i = 0; i < room.players.length; i++) {
			$(".players-name").append("<p class='player-name'>" + room.players[i].pseudo);
		}
		
	});

	socket.on("send-word", function(word){

		$("#show-word").val(word);
		
	});

});