var app = require('http').createServer(handler),
     io = require('socket.io').listen(app),
     fs = require('fs'),
   five = require('johnny-five');

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

board = new five.Board();

board.on("ready", function() {
  led = new five.Led(13);
  pot = new five.Sensor({
      pin: "A2",
      freq: 250
    });
  board.repl.inject({
    pot: pot
  });

  io.sockets.on('connection', function (socket) {
        pot.on("data", function() {
      //console.log(this.value, this.raw);
      socket.emit('message', this.value);
      //document.getElementById("square").style.color = "500";
        });
    socket.on('click', function () {
      led.toggle();
    });
  }); 
});
