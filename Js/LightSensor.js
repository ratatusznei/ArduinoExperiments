var five = require('johnny-five');
var board = new five.Board();

//Variaveis globais, desculpe
var led, ldr;

//Tolerância do sensor
const LDRTOL = 54;
//Pinos
const LEDPIN = 11;
const LDRPIN = 'A5'
//Resistor em série
const RES = 10e3;

board.on('ready', function () {
    //Debug
    console.log('Olá, Arduino!');

    //Inicializa o led e o sensor
    led = new five.Led(LEDPIN);
    ldr = new five.Sensor({
        pin: LDRPIN,
        freq: 250//Leia a cada .25s
    });

    //Armazane a luz ambiente do dia, não Inicializada
    var dayLight = -1;

    ldr.on('change', function () {
        //Inicializa dayLight
        if (dayLight === -1) dayLight = this.value + LDRTOL;

        //Debug
        let vldr = this.fscaleTo(0, 5);
        console.log('Vldr = ' + vldr.toPrecision(3) + ' V');
        console.log('Rldr = ' + (vldr / ((5 - vldr) / RES)).toPrecision(3) + ' Ohms\n');

        //Acende o led se estiver escuro, apaga se estiver claro
        //Quanto mais luz menor a tensão no ldr
        if (ldr.value > dayLight) led.on();
        else led.off();
    });
});

board.on('exit', function () {
    led.off();
    //Debug
    console.log("Tchau Arduino!");
});
