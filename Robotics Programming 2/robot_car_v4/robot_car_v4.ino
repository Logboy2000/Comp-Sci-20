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

unsigned long previousMillis = 0;

// Universal state management
enum State { NONE, DRIVE_PATTERN, RAINBOW_LIGHTS };
State currentState = NONE;

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

  // Prevent immediate driving
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

  switch (currentState) {
    case DRIVE_PATTERN:
      drivePattern();
      break;
    case RAINBOW_LIGHTS:
      rainbowLights();
      break;
    case NONE:
    default:
      break;
  }
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
  static int state = 0;
  static unsigned long lastUpdate = 0;
  const unsigned long interval = 1000; // 1 second

  if (millis() - lastUpdate >= interval) {
    lastUpdate = millis();

    switch (state) {
      case 0:
        setPixelColor(WHITE);
        driveForward(100);
        break;
      case 1:
        stopWheels();
        setPixelColor(colors[1]);
        driveBackward(100);
        break;
      case 2:
        stopWheels();
        setPixelColor(colors[2]);
        turnRight(255);
        break;
      case 3:
        stopWheels();
        setPixelColor(colors[3]);
        turnLeft(255);
        break;
      case 4:
        stopWheels();
        setPixelColor(colors[4]);
        pivotRight(255);
        break;
      case 5:
        stopWheels();
        setPixelColor(colors[5]);
        pivotLeft(255);
        break;
      default:
        stopWheels();
        state = -1;
        currentState = NONE; // Reset state
        break;
    }

    state++;
  }
}

void rainbowLights() {
  static unsigned long rainbowLastUpdate = 0;
  static int hue = 0;

  if (millis() - rainbowLastUpdate >= 10) {
    rainbowLastUpdate = millis();
    leds[0] = CHSV(hue++, 255, 255);
    if (hue > 255) hue = 0;
    FastLED.show();
  }
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
        currentState = NONE;
        break;
      case 16738455:
        Serial.println("Button 1");
        currentState = RAINBOW_LIGHTS;
        break;
      case 16750695:
        Serial.println("Button 2");
        currentState = DRIVE_PATTERN;
        break;
    }
    irrecv.resume(); // Receive the next value
  }
}
