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
  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);
  servo.attach(9);
  FastLED.setBrightness(10);
  digitalWrite(motorEnablePin, true);
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

  motorController(0, true, 0, true);
  driveForward(10);




}

void setPixelColor(const int color[3]) {
  leds[0] = CRGB(color[0], color[1], color[2]);
  FastLED.show();
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
  motorController(-speed, true, speed, false);
}
void pivotRight(int speed) {
  motorController(speed, true, -speed, false);
}
