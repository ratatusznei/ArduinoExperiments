#define R 11
#define G 10
#define B 9
#define S 1.0
#define V 1.0
#define p V*(1-S)

volatile unsigned int speed = 4;

void setup () {
    pinMode(R, OUTPUT);
    pinMode(G, OUTPUT);
    pinMode(B, OUTPUT);
    Serial.begin(9600);
}

void loop () {
    changeSpeed();
    //Hue = a tonalidade da cor em graus [0,360)
    static int hue = 0;

    //arredonda hue e calcula Hi
    const int hi = (hue/ 60) % 6;
    //calcula f
    const float f = hue/60.0 - hi;

    //calcula q e t
    const float q = V * (1 - f * S);
    const float t = V * (1 - (1 - f)*S);

    float r, g, b;

    switch (hi) {
        case 0:
            r = V;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = V;
            b = p;
            break;
        case 2:
            r = p;
            g = V;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = V;
            break;
        case 4:
            r = t;
            g = p;
            b = V;
            break;
        case 5:
            r = V;
            g = p;
            b = q;
            break;
    }
    //Delay function
    printRGB((int)(r*255), (int)(g*255), (int)(b*255));

    analogWrite(R, (int)(r * 255));
    analogWrite(G, (int)(g * 255));
    analogWrite(B, (int)(b * 255));
    hue = (hue + speed) % 360;
}

void printRGB(float r, float g, float b) {
    Serial.print("[ ");
    Serial.print(r);
    Serial.print(", ");
    Serial.print(g);
    Serial.print(", ");
    Serial.print(b);
    Serial.println(" ]");
}

void changeSpeed () {
    //Set speed,  0 <= speed <= 9
    if (Serial.available()) {
        speed = Serial.read() - '0';
    }
}
