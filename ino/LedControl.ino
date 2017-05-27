#define POTPIN A5
#define LEDPIN 3

void setup () {
    pinMode(LEDPIN, HIGH);
}

void loop () {
    analogWrite(LEDPIN, analogRead(POTPIN)/4);
}
