var http = require("http");
var fs = require("fs");


//server is what happens when someone loads up the page in a browser.  server is listening below for http traffic at port xxxx.
var server = http.createServer(function(req, res){
	console.log('someone connected via http');
	fs.readFile('index.html', 'utf-8', function(error, data){
		// console.log(error);
		// console.log(data);
		if(error){
			res.writeHead(500, {'content-type': 'text/html'});
			res.end(error);
		}else{
			res.writeHead(200, {'content-type': 'text/html'});
			res.end(data);
		}
		
	});
});

//include the socketio module
var socketIo = require('socket.io');
//listen to the server which is listening on port XXXX
var io = socketIo.listen(server);
var socketUsers = [];
//we need to deal with a new socket connection
io.sockets.on('connect', function(socket){
	socketUsers.push(socket);
	console.log('someone connected via socket');
	socket.on('message_to_server', function(data){
		io.sockets.emit('message_to_client', {
			message: data.message,
			name: data.name,
			date: data.date
		});
	});
	socket.on('message_to_server2', function(data){
		io.sockets.emit('message_to_client2', {
			name: data.name,
		});
	});
	socket.on('disconnect', function(){
		console.log('a user has dissconnected');
		var user = socketUsers.indexOf(socket);
		socketUsers.splice(user,1);
	});
});

server.listen(8080);
console.log("Listening on port 8080");

