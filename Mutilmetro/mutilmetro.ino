#define VPIN A0
#define RPIN A1
#define IIPIN A2
#define IOPIN A3

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Pronto!");
}

void loop() {
  static char argv[2];
  static int8_t argc;
  static char readPin;
  static float multiple;

  argc = Serial.available();
  if (argc == 2) {
    static float measured;
   
    argv[0] = Serial.read();
    argv[1] = Serial.read();

    if (argv[0] == 'V' || argv[0] == 'v') {
      readPin = VPIN;

      multiple =  argv[1] == '0'? 1:
                  argv[1] == '1'? 10:
                  argv[1] == '2'? 100:
                  argv[1] == '3'? 1000: -1;

      if (multiple == -1) {
        Serial.println("Escala invalida!");
        return;
      }
      //O valor medido nesse pino vai de 0 V a 200 mV
      measured = analogRead(readPin)*5.0/(1024.0) * multiple;
      Serial.print("Valor medido: ");
      Serial.print(measured);
      Serial.println(" V");
    }
    else if (argv[0] == 'R' || argv[0] == 'r') {
      readPin = RPIN;

      multiple =  argv[1] == '0'? 100:
                  argv[1] == '1'? 1E3:
                  argv[1] == '2'? 10E3:
                  argv[1] == '3'? 100E3: -1;

      if (multiple == -1) {
        Serial.println("Escala invalida!");
        return;
      }
      //O valor medido nesse pino vai de 0 V a 3,333 V
      measured = (5.0*analogRead(readPin)/1024.0)/((5-(5.0*analogRead(readPin)/1024.0))/multiple);
      Serial.print("Valor medido: ");
      Serial.print(measured);
      Serial.println(" R");
    }
    else if (argv[0] == 'I' || argv[0] == 'i') {
      readPin = IIPIN;

      multiple = argv[1] == '0'? 100:
                 argv[1] == '1'? 10:
                 argv[1] == '2'? 1:
                 argv[1] == '3'? 0.1: -1;

      if (multiple == -1) {
        Serial.println("Escala invalida!");
        return;
      }
      measured = (analogRead(readPin)*5.0/1024.0 - analogRead(IOPIN)*5.0/1024.0) * multiple;
      Serial.print("Valor medido: ");
      Serial.print(measured);
      Serial.println(" mA");
    }
    delay(100);
  }
  else if (argc != 0 && argc != 1) {
    Serial.println("Digite um comando valido!");
    delay(100);
  }
}
