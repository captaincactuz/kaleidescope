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
        pin: "A0",
        freq: 55
      });
      dial = new five.Sensor({
        pin: "A1",
        freq: 55 
      });

      var lightButton1 = new five.Button(9);
      var lightButton2 = new five.Button(10);
      var ledSwitch = new five.Switch(7);
      var blackButton = new five.Switch(8);

      var button1 = new five.Switch(6);
      var button2 = new five.Switch(4);
      var tmiddleswitch = new five.Switch(5);
      var tblack = new five.Switch(2);
      var bblack = new five.Switch(3);

      /*var knob1 = new five.Sensor({
        pin: "A3",
        freq: 35 
      });
      var knob2 = new five.Sensor({
        pin: "A4",
        freq: 35 
      });
      var knob3 = new five.Sensor({
        pin: "A5",
        freq: 35 
      });*/

      board.repl.inject({
        pott: pott,
        dial: dial,
        lightButton1: lightButton1,
        lightButton2: lightButton2,
        ledSwitch: ledSwitch,
        blackButton: blackButton,
        button1: button1,
        button2: button2,
        tmiddleswitch: tmiddleswitch,
        tblack: tblack,
        bblack: bblack,
        //knob1: knob1,
        //knob2: knob2,
        //knob3: knob3
      });

      io.sockets.on('connection', function (socket) {
       console.log("SOCKET");
       var i = 0;
       var j = 0;
       var thisval;
       var prevValue = [0,0,0,0,0,0,0]; 
       var newValue = [0,0,0,0,0,0,0];
       var triggers = [
        /*'1':*/ 'zoom',
        /*'8':*/ '',
        /*'9':*/ '',
        /*'10':*/ '',
        /*'7':*/ '',
        /*'3':*/ 'animSpeed',
        /*'6':*/ 'obScale',
        /*'2':*/ 'rotate'
      ];
      var triggers2 = [
        /*'top knob':*/ 'shader2knob',  
        /*'4':*/ 'obRot',
        /*'clicky':*/ 'textureSelect',  
        /*'turny':*/ 'turny',           
        /*'5':*/ 'obSpeed',  
        /*'middle knob':*/ 'shader1knob',            
        /*'middle metal lever':*/ 'muxBlackLever',
        /*'bottom knob':*/ 'hue'         
      ];

var string;
      dial.on("data", function() {
        
        var alpha = 0.5;
        if (this.value - prevValue[i] > 450) {
          alpha = .1;
        }
	      //newValue[i] = lerp(prevValue[i], this.value, alpha);
        //console.log(i + '-' + triggers[i] + ": " + this.value + ', ' + newValue[i]);
        prevValue[i] = newValue[i];
        socket.emit(triggers[i], this.value);

        ctrlA.write(i & 0x01);
        ctrlB.write((i >> 1) & 0x01);
        ctrlC.write((i>>2) & 0x01);

        
        
        i++;
       
	//if (i == 1) {
		//string += this.value + ", ";
		///console.log(this.value);
       // }
        if (i == 8) {
          //console.log(string);
          string="";
           i = 0;
        }
     });
      pott.on("data", function() {
         string+= this.value;
        string+= ", ";
        socket.emit(triggers2[i], this.value);
	});
      lightButton1.on("up", function() {
        socket.emit('lightButton1', 0);
      });
      lightButton1.on("down", function() {
        socket.emit('lightButton1', 1);
        console.log("lightButton1");
      });
      lightButton2.on("up", function() {
        socket.emit('lightButton2', 0);
      });
      lightButton2.on("down", function() {
        socket.emit('lightButton2', 1);
        console.log("lightButton2");
      });
      ledSwitch.on("open", function() {
        socket.emit('ledSwitch', 0);
      });
      ledSwitch.on("close", function() {
        socket.emit('ledSwitch', 1);
        console.log("ledSwitch");
      });
      blackButton.on("open", function() {
        socket.emit('blackButton', 0);
      });
      blackButton.on("close", function() {
        socket.emit('blackButton', 1);
        console.log("blackButton");
      });

      button1.on("open", function() {
        socket.emit('button1', 0);
      });
      button1.on("close", function() {
        socket.emit('button1', 1);
        console.log("button1");
      });

      //button 2 middle metal switch backwards
      button2.on("open", function() {
        socket.emit('button2', 1);
        console.log("button2");
      });
      button2.on("close", function() {
        socket.emit('button2', 0);
      });

      //top middle metal switch
      tmiddleswitch.on("open", function() {
        socket.emit('tmiddleswitch', 0);
      });
      tmiddleswitch.on("close", function() {
        socket.emit('tmiddleswitch', 1);
        console.log("tmiddleswitch");
      });

      tblack.on("open", function() {
        socket.emit('tblack', 1);
        console.log("tblack");
      });
      tblack.on("close", function() {
        socket.emit('tblack', 0);
       
      });

      //left middle black switch
      bblack.on("open", function() {
        socket.emit('bblack', 0);
      });
      bblack.on("close", function() {
        socket.emit('bblack', 1);
        console.log("bblack");
      });

      /*knob1.on("data", function() {
        socket.emit('knob1', this.value);
        //console.log("Data: ", this.value);
      });
      knob2.on("data", function() {
        socket.emit('knob2', this.value);
        //console.log("Data: ", this.value);
      });
      knob3.on("data", function() {
        socket.emit('knob3', this.value);
        //console.log("Data: ", this.value);
      });*/

    });


   });


function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}
