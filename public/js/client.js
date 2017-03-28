var socket = io.connect('http://localhost:1234');

$(window).ready(function(){

	socket.on("refresh-lobby", function(room){

		showPage('lobby');

		$(".main-lobby").empty();
		$(".main-lobby").append("<p class='info-lobby'>Nom du salon : <b>" + room.id + "</b>");
		$(".main-lobby").append("<ul class='list-lobby'>");

		for (var i = 0; i < room.players.length; i++) {
			$(".list-lobby").append("<li>" + room.players[i].pseudo + "</li>");
		}

	});

});

function showPage(page){

    $(".main>div>div").hide();
    $(".main-" + page).show();

}