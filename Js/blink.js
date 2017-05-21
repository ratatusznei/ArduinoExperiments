var five = require('johnny-five');
var board = new five.Board();

board.on('ready', () => {
    led = new five.Led(13);
    led.blink(400);
});
