//var app = require('http').createServer(handler),
var express = require('express'),
     fs = require('fs'),
     five = require('johnny-five');
var  app = express();   
var server = require('http').Server(app);
var io = require('socket.io')(server);
     //io = require('socket.io').listen(app);
app.use(express.static(__dirname + '/mrdoob'));
//app.listen(8080);
server.listen(8080);
/*
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  //fs.readFile(__dirname + '/mrdoob/examples/webgl.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading *index.html: ' + err);
    }

    res.writeHead(200);
    res.end(data);
  });
}
*/


board = new five.Board();

board.on("ready", function() {
  led = new five.Led(13);
  pott = new five.Sensor({
      pin: "A2",
      freq: 250
    });
  dial = new five.Sensor({
      pin: "A0",
      freq: 250
  });
  board.repl.inject({
    pot: pott,
    pot: dial
  });

  io.sockets.on('connection', function (socket) {
        pott.on("data", function() {
            //console.log(this.value, this.raw);
            socket.emit('message', this.value);
            //document.getElementById("square").style.color = "500";
        });
        dial.on("data", function() {
            socket.emit('dial', this.value);
        });
    socket.on('click', function () {
      led.toggle();
    });
  }); 
});
