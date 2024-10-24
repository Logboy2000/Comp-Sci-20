const int redLED = 11;
const int yellowLED = 10;
const int greenLED = 9;
int currentLED = greenLED;


int fadeAmount = 5;
int delayMilliseconds = 3;
float brightness = 0;

void setup() {
  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
}

void loop() {
  analogWrite(currentLED, brightness);

  brightness = brightness + fadeAmount;

  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
    if(currentLED == redLED){
      currentLED = yellowLED;
    } else if (currentLED == yellowLED){
      currentLED = greenLED;
    } else {
      currentLED = redLED;
    }
  }
  
  delay(delayMilliseconds);
}
