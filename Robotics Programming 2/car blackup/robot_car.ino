#include <FastLED.h>
#include <Servo.h>
#include <IRremote.h>

#define LED_COUNT 1

// Pins
const int motorEnablePin = 3;
const int LED_PIN = 4;
const int motorLSpeedPin = 5;
const int motorRSpeedPin = 6;
const int motorLDirPin = 7;
const int motorRDirPin = 8;
const int IR_PIN = 9;
IRrecv irrecv(IR_PIN);

decode_results results;

Servo headServo;

const CRGB colors[13] = {
  CRGB(255, 255, 255),
  CRGB(255, 0, 0),
  CRGB(0, 255, 0),
  CRGB(0, 0, 255),
  CRGB(255, 0, 255),
  CRGB(255, 255, 0),
  CRGB(0, 255, 255),
  CRGB(128, 0, 128),
  CRGB(255, 165, 0),
  CRGB(128, 128, 0),
  CRGB(0, 128, 128),
  CRGB(0, 128, 0),
  CRGB(128, 0, 0),
}; 
typedef enum {WHITE, RED, GREEN, BLUE, MAGENTA, YELLOW, CYAN, PURPLE, ORANGE, OLIVE, TEAL, DARK_GREEN, MAROON} colorNames;

CRGB leds[LED_COUNT];

void setup() {
  Serial.begin(9600);
  // Set those pins
  headServo.attach(9);
  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);

  // Brighten led
  FastLED.setBrightness(255);

  // Enable the motors
  digitalWrite(motorEnablePin, true);

  // Enable IR receiver
  irrecv.enableIRIn();

  // Prevent immidiate driving
  stopWheels();


  
}

void loop() {
  if (Serial.available() > 0) {
    char inChar = Serial.read();
    if (inChar == 'q') {
      Serial.println("Stopping Motors");
      digitalWrite(motorEnablePin, false);
    }
    if (inChar == 's') {
      Serial.println("Starting Motors");
      digitalWrite(motorEnablePin, true);
    }
  }

  irRemote();
}

void setPixelColor(const CRGB color) {
  leds[0] = color;
  FastLED.show();
}

void motorController(int lSpeed, bool lDir, int rSpeed, bool rDir) {
  analogWrite(motorLSpeedPin, lSpeed);
  analogWrite(motorRSpeedPin, rSpeed);
  digitalWrite(motorLDirPin, lDir);
  digitalWrite(motorRDirPin, rDir);
}

void driveForward(int speed) {
  motorController(speed, true, speed, true);
}

void driveBackward(int speed) {
  motorController(speed, false, speed, false);
}

void turnLeft(int speed) {
  motorController(speed, true, speed / 2, true);
}

void turnRight(int speed) {
  motorController(speed / 2, true, speed, true);
}

void pivotLeft(int speed) {
  motorController(speed, false, speed, true);
}

void pivotRight(int speed) {
  motorController(speed, true, speed, false);
}

void stopWheels() {
  analogWrite(motorLSpeedPin, 0);
  analogWrite(motorRSpeedPin, 0);
  digitalWrite(motorLDirPin, 0);
  digitalWrite(motorRDirPin, 0);
}

void drivePattern() {
  setPixelColor(WHITE);
  driveForward(100);
  delay(1000);
  stopWheels();

  setPixelColor(colors[1]);
  driveBackward(100);
  delay(1000);
  stopWheels();

  setPixelColor(colors[2]);
  turnRight(255);
  delay(1000);
  stopWheels();

  setPixelColor(colors[3]);
  turnLeft(255);
  delay(1000);
  stopWheels();

  setPixelColor(colors[4]);
  pivotRight(255);
  delay(1000);
  stopWheels();

  setPixelColor(colors[5]);
  pivotLeft(255);
  delay(1000);
  stopWheels();
}


void irRemote() {
  if (irrecv.decode(&results)) { // Check if a signal is received
    switch (results.value) {
      case 0xFF22DD:
        Serial.println("Button Left");
        setPixelColor(colors[0]);
        pivotRight(100);
        break;
      case 0xFFC23D:
        Serial.println("Button Right");
        setPixelColor(colors[1]);
        pivotLeft(100);
        break;
      case 16736925:
        Serial.println("Button Up");
        setPixelColor(colors[3]);
        driveForward(100);
        break;
      case 16754775:
        Serial.println("Button Down");
        setPixelColor(colors[4]);
        driveBackward(100);
        break;
      case 16712445:
        Serial.println("Button OK");
        setPixelColor(colors[2]);
        stopWheels();
        break;
      case 16738455:
        Serial.println("Button 1");
        for(int hue = 0; hue <= 255; hue++){
          leds[0] = CHSV(hue, 255, 255);
          FastLED.show();
          delay(10);
        }
        break;
      case 16750695:
        Serial.println("Button 2");
        drivePattern();
        break;
      case 16756815://3
        Serial.println("Button 3");
        break;
      case 16724175://4
        Serial.println("Button 4");
        break;
      case 16718055://5
        Serial.println("Button 5");
        break;
      case 16743045://6
        Serial.println("Button 6");
        break;
      case 16716015://7
        Serial.println("Button 7");
        break;
      case 16726215://8
        Serial.println("Button 8");
        break;
      case 16734885://9
        Serial.println("Button 9");
        break;
      case 16728765: // *
      Serial.println("Button *");
      break;
      case 16730805: // 0
      Serial.println("Button 0");
      break;
      case 16732845: // #
      Serial.println("Button #");
      break;
    }
    irrecv.resume(); // Receive the next value
  }

}


void cycleColors(const int colorArray[][3], int colorCount, int delayTime) {
  for (int i = 0; i < colorCount; i++) {
    setPixelColor(colorArray[i]);
    delay(delayTime);
  }
}