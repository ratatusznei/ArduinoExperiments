#define POTPIN A5
#define LEDPIN 3

void setup () {
    pinMode(LEDPIN, OUTPUT);
}

void loop () {
    analogWrite(LEDPIN, analogRead(POTPIN)/4);
}
