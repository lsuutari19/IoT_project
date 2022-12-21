var express = require('express');
require('dotenv').config()
console.log(process.env.API_KEY);
var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var app = express();

var server = app.listen(4000, () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port 4000...");
})

var port = new SerialPort('COM3',{ 
    baudRate: 115200,
    dataBits: 8,

});

port.pipe(parser);
app.get('/', function(req, res) {
    res.sendFile('index.html', { root: 'public'});
})

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    
    console.log('Node is listening to port');
    
});

parser.on('data', function(data) {
    temps = String(data).split(",");    //Got rid of the humidity
    temps = temps[1].split("").splice(2 - 1 , 6);
    temps = temps.join("");
    console.log(temps);
    io.emit('data', temps);
});
 //Bind socket.io to our express server.

app.use(express.static('public')); //Send index.html page on GET /
