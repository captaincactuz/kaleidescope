var express = require('express'),
fs = require('fs'),
five = require('johnny-five');
var  app = express();   
var server = require('http').Server(app);
var io = require('socket.io')(server);
     //io = require('socket.io').listen(app);
     app.use(express.static(__dirname + '/mrdoob'));
     server.listen(8080);

     board = new five.Board();
     board.on("ready", function() {

      var ctrlA =	new five.Pin(13),
      ctrlB =	new five.Pin(12),
      ctrlC = new five.Pin(11);
      pott = new five.Sensor({
        pin: "A2",
        freq: 250
      });
      dial = new five.Sensor({
        pin: "A0",
        freq: 25
      });
      board.repl.inject({
        pot: pott,
        pot: dial
      });

      io.sockets.on('connection', function (socket) {
       console.log("SOCKET");
       var i = 0;
       var thisval;
       var prevValue = [0,0,0,0,0,0,0]; 
       var newValue = [0,0,0,0,0,0,0];
       var triggers = [
        /*'0':*/ 't0',
        /*'1':*/ 'zoom',
        /*'2':*/ 't2',
        /*'3':*/ 't3',
        /*'4':*/ 't4',
        /*'5':*/ 't5',
        /*'6':*/ 'opacity',
        /*'7':*/ 't7'
      ];

      dial.on("data", function() {
        var alpha = 0.5;
        var sockvar = '';
        if (this.value - prevValue[i] > 450) {
          alpha = .1;
        }
	      newValue[i] = lerp(prevValue[i], this.value, alpha);
        console.log(i + '-' + triggers[i] + ": " + this.value + ', ' + newValue[i]);
        prevValue[i] = newValue[i];
        socket.emit(triggers[i], newValue[i]);

        ctrlA.write(i & 0x01);
        ctrlB.write((i >> 1) & 0x01);
        ctrlC.write((i>>2) & 0x01);
        if (i++ == 7) {
         i = 0;
       }
     });
      pott.on("data", function() {
            //console.log(this.value, this.raw);
            socket.emit('message', this.value);
          });
      dial.on("data", function() {
        socket.emit('dial', this.value);
      });
    });

   });


function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t
}
