#include <FastLED.h>
#include <Servo.h>

#define LED_COUNT 1


// Pins
const int motorEnablePin = 3;
const int LED_PIN = 4;
const int motorLSpeedPin = 5;
const int motorRSpeedPin = 6;
const int motorLDirPin = 7;
const int motorRDirPin = 8;

Servo servo;

// Whole lotta colors
const int colors[13][3] = {
  {255, 255, 255}, // White
  {255, 0, 0},   // Red
  {0, 255, 0},   // Green
  {0, 0, 255},   // Blue
  {255, 0, 255}, // Magenta
  {255, 255, 0}, // Yellow
  {0, 255, 255}, // Cyan
  {128, 0, 128}, // Purple
  {255, 165, 0}, // Orange
  {128, 128, 0}, // Olive
  {0, 128, 128}, // Teal
  {0, 128, 0},   // Dark Green
  {128, 0, 0},   // Maroon
};

CRGB leds[LED_COUNT];

void setup() {
  Serial.begin(9600);
  // Set those pins
  servo.attach(9);
  FastLED.setBrightness(10);

  // Enable the motors
  digitalWrite(motorEnablePin, true);

  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);

  setPixelColor(colors[0]);
  driveForward(100, 1000);
  setPixelColor(colors[1]);
  driveBackward(100, 1000);
  setPixelColor(colors[2]);
  turnRight(255, 2000);
  setPixelColor(colors[3]);
  turnLeft(255, 2000);
  setPixelColor(colors[4]);
  pivotRight(255, 2000);
  setPixelColor(colors[5]);
  pivotLeft(255, 2000);
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
}

void setPixelColor(const int color[3]) {
  leds[0] = CRGB(color[0], color[1], color[2]);
  FastLED.show();
}

void motorController(int lSpeed, bool lDir, int rSpeed, bool rDir, int timeMilliseconds) {
  analogWrite(motorLSpeedPin, lSpeed);
  analogWrite(motorRSpeedPin, rSpeed);
  digitalWrite(motorLDirPin, lDir);
  digitalWrite(motorRDirPin, rDir);
  delay(timeMilliseconds);
  stopWheels();
}

void driveForward(int speed, int timeMilliseconds) {
  motorController(speed, true, speed, true, timeMilliseconds);
}

void driveBackward(int speed, int timeMilliseconds) {
  motorController(speed, false, speed, false, timeMilliseconds);
}

void turnLeft(int speed, int timeMilliseconds) {
  motorController(speed, true, speed / 2, true, timeMilliseconds);
}

void turnRight(int speed, int timeMilliseconds) {
  motorController(speed / 2, true, speed, true, timeMilliseconds);
}

void pivotLeft(int speed, int timeMilliseconds) {
  motorController(speed, false, speed, true, timeMilliseconds);
}

void pivotRight(int speed, int timeMilliseconds) {
  motorController(speed, true, speed, false, timeMilliseconds);
}

void stopWheels() {
  analogWrite(motorLSpeedPin, 0);
  analogWrite(motorRSpeedPin, 0);
  digitalWrite(motorLDirPin, 0);
  digitalWrite(motorRDirPin, 0);
}



void cycleColors(const int colorArray[][3], int colorCount, int delayTime) {
  for (int i = 0; i < colorCount; i++) {
    setPixelColor(colorArray[i]);
    delay(delayTime);
  }
}

int hue = 0;
void rainbowCycle(int delayTime, int led) {


  hue++;
  // Limit Hue at 255
  if (hue > 255) {
    hue = 0;
  }
  leds[0] = CHSV(hue, 255, 255);
  FastLED.show();
  delay(delayTime);
}
