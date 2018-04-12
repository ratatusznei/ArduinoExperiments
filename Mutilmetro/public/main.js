/*
	Script que controla o socket. É executado no navegador
*/

'use strict';

// '$'' faz parte da biblioteca JQuery, utilizada para a manipulação dos objetos no documento html
$(document).ready(function() {
	// Código executado após o carregamento da página

	let socket = io();

	$('.scale-btn').click(function(e) {
		// Retorna v0, v1, i2, r3...
		let nextScale = e.target.className.split(' ')[1];
		// Envia para o server
		socket.emit('scale-change', nextScale);
	});

	socket.on('connection', () => {
		// Quando o socket se conecta
		// Mensagem de debug
		console.log('Socket connected!');
	});

	socket.on('measure', (data) => {
		// Quando o socket receber o evento 'measure'
		// Envia os dados para a caixa da medida (a div com class="measure")
		$('.measure').text(data);
	});

	socket.on('alert', (data) => {
		// Quando o socket recebe o evento 'alert'
		alert(data);
	});

	socket.on('disconnect', () => {
		// Quando o socket se desconecta
		// Mensagem de debug
		alert('Connection lost!');
	});
});