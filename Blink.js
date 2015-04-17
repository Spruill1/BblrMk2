var express = require('express.io')
  , fs = require('fs')
  , SerialPort = require('serialport').SerialPort;
/*
  SerialPort.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });
*/
var app = express().http().io();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
});
//app.use(express.static(__dirname + '/tabmenu'));

app.listen(80);

var sp = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600
});

sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + (new Uint8Array(data))[0].toString());
  });
});


app.io.sockets.on('connection',function(socket){
  console.log('connection established');

  socket.on('message',function(data){
    var t = new UInt8Array(data);
    console.log('text received: '+t[0]);
    sp.write(data);
  });

  socket.on('Rled',function(data){
    console.log('command received: blink');
    sp.write('a');
  });
  socket.on('Gled',function(data){
    console.log('command received: blink');
    sp.write('b');
  });
  socket.on('Bled',function(data){
    console.log('command received: blink');
    sp.write('c');
  });
  
  var ave_player=8; //the bits storing where the player is... default is in the middle 0b001000=8
  var ave_score=0;
  var cut = new Uint8Array(1); //since js is stupid and soooo weakly typed I need this to cut down the variable size to a byte - all other numbers are stored as 64-bit floats
  
  socket.on('ave_start',function(){
	console.log('Starting Avalanche');
	sp.write('A');
	cut[0]=(ave_player & 0xFF);//write the one byte of player output - this is where modification to multiple arduino slaves will happen
	sp.write(cut); 
  });
  socket.on('ave_exit',function(){
	console.log('Ending Avalanche');
	sp.write('a');
  });
  socket.on('ave_left',function(){
	console.log('Avalanche: Move Left');  
	ave_player /=2; if(ave_player<1){ave_player=1;}
	cut[0]=(ave_player & 0xFF);//write the one byte of player output - this is where modification to multiple arduino slaves will happen
	sp.write(cut); 
  });
  socket.on('ave_right',function(){
	console.log('Avalanche: Move Right');
	ave_player *=2; if(ave_player>32){ave_player=32;}
	cut[0]=(ave_player & 0xFF);//write the one byte of player output - this is where modification to multiple arduino slaves will happen
	sp.write(cut); 
  });
  
  
  socket.on('game1_control',function(data){
    //send the command to the game's js file
    console.log("game1_control = " + data.value)
    sp.write(0x50,function() {
	sp.write(data.value,function() {
    		sp.write(0x60)
	});
    });
    
  });
});
