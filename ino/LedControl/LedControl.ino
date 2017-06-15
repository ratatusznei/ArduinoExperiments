#define POTPIN A5
#define LEDPIN 3

void setup () {
    //Seta o pino do led como saida
    pinMode(LEDPIN, OUTPUT);
}

void loop () {
    //Escreve no pino do led um valor proporcional
    //   a tensão no pino central do potenciometro
    analogWrite(LEDPIN, analogRead(POTPIN)/4);
}
