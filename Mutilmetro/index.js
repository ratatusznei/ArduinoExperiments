'use strict';

const server = require('./webserver.js')();
const io = require('socket.io')(server);
const five = require('johnny-five');

let port = process.argv[2]? process.argv[2]: 80;
server.listen(port, () => {
	console.log('listening on port %d...', port);
});

let arduino = new five.Board();

arduino.on('ready', () => {
	console.log('Arduino ready!');
});