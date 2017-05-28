class Led {
    short pin;
    short state;
    long onTime;
    long offTime;
    unsigned long lastUpdate;

public:
    Led (int pin, long on, long off) {
        pinMode(pin, OUTPUT);
        this->pin = pin;
        this->onTime = on;
        this->offTime = off;
        this->state = LOW;
        this->lastUpdate = 0L;
    }
    void update () {
        unsigned long now = millis();
        if ((this->state == HIGH) && (now - this->lastUpdate >= this->onTime)) {
            this->state = LOW;
            digitalWrite(this->pin, this->state);
            this->lastUpdate = millis();
        }
        else if ((this->state == LOW) && (now - this->lastUpdate >= this->offTime)) {
            this->state = HIGH;
            digitalWrite(this->pin, this->state);
            this->lastUpdate = millis();
        }
    }
};

Led l1(12, 100, 1900);
Led l2(11, 1000, 500);
Led l3(10, 2000, 500);
Led l4(13, 500, 500);

void setup() {}

void loop() {
    l1.update();
    l2.update();
    l3.update();
    l4.update();
}
