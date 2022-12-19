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
    temp = String(data).split(","); //formatted the data so it only has the numbers of the temperature
    temp = temp[1].split("").splice(2 - 1 , 4);
    temp = Number(temp.join(""));
    console.log(temp);
    io.emit('data', temp);
});
 //Bind socket.io to our express server.

app.use(express.static('public')); //Send index.html page on GET /
