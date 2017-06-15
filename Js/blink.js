var five = require('johnny-five');
var board = new five.Board();

board.on('ready', () => {
    led = new five.Led(13);
    led.blink(400);
});

board.on('exit', () => {
    led.off();
    console.log("Tchau, Arduino!");
});
