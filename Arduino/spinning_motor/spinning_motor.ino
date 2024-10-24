const int motor = 9;
int speed = 0;
int speedChange = 1;
int speedChangeSign = 1;
void setup() {
  pinMode(motor, OUTPUT);
}

void loop() {
  speed = speed + speedChange * speedChangeSign;
  if (speed >= 255) {
    speedChangeSign = -1;
  }
  if (speed <= 0) {
    speedChangeSign = 1;
  }
  delay(10);
  analogWrite(motor, speed);
}