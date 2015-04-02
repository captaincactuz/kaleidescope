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
  var controlpins = {
  };
  pott = new five.Sensor({
      pin: "A2",
      freq: 250
    });
  A0 = new five.Sensor({
      pin: "A0",
      freq: 250 
  });
  A1 = new five.Sensor({
      pin: "A1",
      freq: 250
  });
  board.repl.inject({
    pot: A1,
    pot: A0
  });

  io.sockets.on('connection', function (socket) {
	var i = 0;
//	while(true) {
//	    A0.on("data", function() {
//		//       	    	socket.emit('A0', this.value);
 //           });
	    //controlpins[0].write(i & 1 ? 1 : 0);
	    //controlpins[1].write(i & 1 ? 1 : 0);
	    //controlpins[2].write(i & 1 ? 1 : 0);
	    
//	}
        pott.on("data", function() {
            //console.log(this.value, this.raw);
            socket.emit('message', this.value);
        });
        A0.on("data", function() {

	ctrlA.write(i & 1 );
	ctrlB.write((i>>1) & 1 );
	ctrlC.write((i>>2) & 1 );
	    if (i++ == 7) {
		i = 0;
	    }
		console.log('A0.pin: ', i, ': ',  this.value);
		ctrlB.query(function(state) {
//			console.log(state);
		});	
            socket.emit('A0', this.value);
        });
	A1.on("data", function() {
//		console.log('A1: ', this.value);
		socket.emit('message2', this.value);
	});
    socket.on('click', function () {
      led.toggle();
    });
  }); 
});
