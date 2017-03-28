var express = require('express');
var http = require('http');

var c = require('./config');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var rooms = [];
var words = ['chat', 'camion', 'manger', 'appartenance', 'azerty', 'magique', 'kazakhstan', 'stylo', 'drogue', 'amour', 'gloire', 'beaute', 'television', 'anticonstitutionnellement']

//Middleware
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("index.ejs");
})

io.sockets.on('connection', function (socket) {

	socket.inGame = false;

	socket.on("user-join", function(user){

		socket.data = user;

		if(typeof rooms[user.room] == "undefined"){
			var room = {
				id:user.room,
				players: []
			}
			room.players.push(user);
			rooms[user.room] = room;
			socket.join(user.room);
			socket.inGame = true;
			io.to(user.room).emit("refresh-lobby", rooms[user.room]);
		}
		else{
			socket.emit("ask-join");
		}

	});

	socket.on("reponse-join", function(confirm){

		if(confirm){
			console.log(rooms[socket.data.room].players);
			if(rooms[socket.data.room].players.length < c.max_players){
				var user = {
					pseudo: socket.data.pseudo,
					room: socket.data.room
				}
				rooms[socket.data.room].players.push(user);
				socket.join(user.room);
				socket.inGame = true;
				io.to(user.room).emit("refresh-lobby", rooms[user.room]);
				if(rooms[socket.data.room].players.length == c.max_players){
					io.to(user.room).emit("start-lobby-timer", 5);
					setTimeout(function(){
						io.to(socket.data.room).emit("start-game", rooms[socket.data.room]);
						rooms[socket.data.room].current_word = words[c.random(0, words.length-1)];
						io.to(socket.data.room).emit("send-word", rooms[socket.data.room].current_word);
					}, 5000);
				}
			}
			else{
				delete socket.data;
				socket.emit("return-join", "Quelqu'un vous a volé la place !");
			}
		}
		else{
			delete socket.data;
			socket.emit("return-join");
		}

	});

	socket.on("disconnect", function(){

		if(socket.inGame){
			io.to(socket.data.room).emit("return-join", "L'autre joueur a quitté la partie ");
			delete rooms[socket.data.room];
		}

	});

});

server.listen(1234);
