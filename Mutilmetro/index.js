/*
	Arquivo principal

	Programa o arduino para ler as entradas analógicas e
	recebe os dados do arduino, para então enviar eles para o socket
*/

'use strict';

/* Importando módulos */
const server = require('./webserver.js')();	// Retorna um servidor web simples
const io = require('socket.io')(server);	// Biblioteca para comunicação com o websocket
const five = require('johnny-five');		// Biblioteca de robótica para comunicação com arduino


// Inicializa o servidor na porta passada pelos argumentos da linha de comandos ou a porta padrão de http
let port = process.argv[2]? process.argv[2]: 80;
server.listen(port, () => {
	console.log('listening on port %d...', port);
});

// Armazena o inteval, criado por setInterval, que faz medições a cada delta t milisegundos
let measureInterval;
const measureDeltaTime = 500;
// Objeto que armazena os valores medidos
let measured = {
	v: 0,
	r: 0,
	i: 0
};

// Armazena o id do socket mestre, aquele que seleciona as escalas
let masterSocketId = '';

let arduino = new five.Board();

// Quando o arduino conectar
arduino.on('ready', () => {
	const vReadPin = 'A0';
	const rReadPin = 'A1';
	const iReadPin = 'A2';

	/* 
		Objetos sensores analógicas, cada um no respectivo pino
		e com uma taxa de atualização de 200ms
	*/
	let voltimeter = five.Sensor({
		pin: vReadPin,
		freq: 200
	});

	let ohmmeter = five.Sensor({
		pin: rReadPin,
		freq: 200
	});	

	let ampmeter = five.Sensor({
		pin: iReadPin,
		freq: 200
	});

	// Quando valor medido em qualquer um mudar: Atualize o objeto measured
	voltimeter.on('change', function(e) {
		measured.v = this.fscaleTo(0, 5);
	});
	ohmmeter.on('change', function(e) {
		measured.r = this.fscaleTo(0, 5);
	});
	ampmeter.on('change', function(e) {
		measured.i = this.fscaleTo(0, 5);
	});
});


// Quando o websocket se conectar
io.on('connection', function(socket) {
	console.log('New conection: ' + socket.id);
	
	// Se não exister um socket mestre ainda, faça deste o mestre
	if (masterSocketId === '') {
		masterSocketId = socket.id;
	}

	// Quando o usuário solicitar uma mudança de escala
	socket.on('scale-change', (data) => {
		// Se não for o mestre, avise ele
		if (socket.id !== masterSocketId) {
			socket.emit('alert', 'You have no power here!');
			return;
		}

		const unit = data[0];	// Recebido do usuário, v | i | r
		const scale = data[1];	// Recebido do usuário, 0 | 1 | 2 | 3
		let real;				// O valor real medido, sem contar a atenuação devido as diferentes escalas
		let fractionDigits = 5; // Numero de casas decimais do resultado

		//Limpe o interval, se existir
		clearInterval(measureInterval);

		//Inicie um novo interval
		measureInterval = setInterval(function () {
			if (unit === 'v') {
				let multiple = scale == '0'? 1:
					scale == '1'? 10:
					scale == '2'? 100:
					scale == '3'? 1000: -1;

				real = (measured.v * multiple - (measured.v > 0.5? 0.1: 0)).toFixed(fractionDigits) + ' V';
			}
			else if (unit === 'r') {
				let multiple =  scale == '0'? 100:
					scale == '1'? 1E3:
					scale == '2'? 10E3:
					scale == '3'? 100E3: -1;

				real = (measured.r * multiple/(5 - measured.r)).toFixed(fractionDigits) + ' Ω';
			}
			else if (unit === 'i') {
				let multiple = scale == '0'? 10:
					scale == '1'? 100:
					scale == '2'? 1E3:
					scale == '3'? 10E3: -1;

				real = (measured.i / (multiple)).toFixed(fractionDigits) +' A';
			}

			//Envia o valor real para todos
			io.emit('measure', real);
		}, measureDeltaTime);
	});

	socket.on('disconnect', () => {
		if (socket.id === masterSocketId) {
			masterSocketId = '';
		}
	});
});