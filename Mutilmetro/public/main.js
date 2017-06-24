'use strict';

$(document).ready(function() {
	let socket = io();

	$('.scale-btn').click(function(e) {
		//Return v0, v1, i2, r3...
		let nextScale = e.target.className.split(' ')[1];
		socket.emit('scale-change', nextScale);
	});

	socket.on('connection', () => {
		console.log('Socket connected!');
	});

	socket.on('measure', (data) => {
		$('.measure').text(data);
	});

	socket.on('alert', (data) => {
		alert(data);
	});

	socket.on('disconnect', () => {
		alert('Connection lost!');
	});
});