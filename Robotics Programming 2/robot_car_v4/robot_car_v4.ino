#include <FastLED.h>
#include <Servo.h>
#include <IRremote.h>
#include <Ultrasonic.h>

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
Ultrasonic ultrasonic(13,12);


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

// I love state machines
enum State { NONE, DRIVE_PATTERN, RAINBOW_LIGHTS, AVOIDANCE, LINE_FOLLOW};
State currentState = NONE;

void setup() {
  Serial.begin(9600);
  // Set those pins
  headServo.attach(10);
  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);

  // Brighten led
  FastLED.setBrightness(255);

  // Enable the motors
  digitalWrite(motorEnablePin, true);

  // Enable IR receiver
  irrecv.enableIRIn();

  // Prevent immediate driving
  stopWheels();
} // end of setup

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
    case AVOIDANCE:
      wallAvoidance();
      break;
    case LINE_FOLLOW:
      lineFollow();
    break;
    case NONE:
      break;
    default:
      break;
  }
} // end of loop

void setPixelColor(const CRGB color) {
  leds[0] = color;
  FastLED.show();
} // end of setPixelColor

void motorController(int lSpeed, bool lDir, int rSpeed, bool rDir) {
  analogWrite(motorLSpeedPin, lSpeed);
  analogWrite(motorRSpeedPin, rSpeed);
  digitalWrite(motorLDirPin, lDir);
  digitalWrite(motorRDirPin, rDir);
} // end of motorController

void driveForward(int speed) {
  motorController(speed, true, speed, true);
} // end of driveForward

void driveBackward(int speed) {
  motorController(speed, false, speed, false);
} // end of driveBackward

void turnLeft(int speed) {
  motorController(speed, true, speed / 2, true);
} // end of turnLeft

void turnRight(int speed) {
  motorController(speed / 2, true, speed, true);
} // end of turnRight

void pivotLeft(int speed) {
  motorController(speed, false, speed, true);
} // end of pivotLeft

void pivotRight(int speed) {
  motorController(speed, true, speed, false);
} // end of pivotRight

void stopWheels() {
  analogWrite(motorLSpeedPin, 0);
  analogWrite(motorRSpeedPin, 0);
  digitalWrite(motorLDirPin, 0);
  digitalWrite(motorRDirPin, 0);
} // end of stopWheels

int driveSpeed = 50;

void drivePattern() {
  static int state = 0;
  static unsigned long lastUpdate = 0;
  const unsigned long interval = 1000; // 1 second

  if (millis() - lastUpdate >= interval) {
    lastUpdate = millis();

    switch (state) {
      case 0:
        setPixelColor(WHITE);
        driveForward(driveSpeed);
        break;
      case 1:
        stopWheels();
        setPixelColor(colors[1]);
        driveBackward(driveSpeed);
        break;
      case 2:
        stopWheels();
        setPixelColor(colors[2]);
        turnRight(driveSpeed);
        break;
      case 3:
        stopWheels();
        setPixelColor(colors[3]);
        turnLeft(driveSpeed);
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
} // end of drivePattern

void rainbowLights() {
  static unsigned long rainbowLastUpdate = 0;
  static int hue = 0;

  if (millis() - rainbowLastUpdate >= 10) {
    rainbowLastUpdate = millis();
    leds[0] = CHSV(hue++, 255, 255);
    if (hue > 255) hue = 0;
    FastLED.show();
  }
} // end of rainbowLights


int servoPosition = 0;
int servoPositions[] = {30, 90, 150};
void wallAvoidance(){
  setPixelColor(BLUE);

  int distance = 0;

  static unsigned long previousMillis = 0;
  
  static bool movingForward = true;

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= 600) { // Runs every 600ms
    headServo.write(servoPositions[servoPosition]);
    distance = ultrasonic.Ranging(CM);
    Serial.print("Distance in CM: ");
    Serial.println(distance);
    switch(servoPosition){
      case 0:
        if (distance < 30) {
          pivotRight(driveSpeed);
        } else {
          driveForward(driveSpeed);
        }
      break;
      case 1:
        if (distance < 50) {
          pivotRight(driveSpeed);
        } else {
          driveForward(driveSpeed);
        }
      break;
      case 2:
        if (distance < 30) {
          pivotLeft(driveSpeed);
          
        } else {
          driveForward(driveSpeed);
        }
      break;
    }

    previousMillis = currentMillis;
    
    
    if (movingForward) {
      servoPosition++;
    } else {
      servoPosition--;
    }
    if (servoPosition >= 2){ 
      movingForward = false;
    } else if (servoPosition <= 0) { 
      movingForward = true;
    }
  }
} // end of wallAvoidance


int followerReadings[3];
static const uint8_t lineFollowPins[] = {A0, A1, A2}; // {left, middle, right}

void lineFollow(){
  const int threshold = 300;
  Serial.println("");
  for(int i = 0; i < 3; i++){
    followerReadings[i] = analogRead(lineFollowPins[i]); // Higher reading means darker color
    Serial.print(followerReadings[i]);
    Serial.print(", ");
  }

  // follow line
  if (followerReadings[1] > threshold && followerReadings[0] < threshold && followerReadings[2] < threshold) {
    setPixelColor(colors[3]);
    driveForward(driveSpeed);
  } else if (followerReadings[0] > threshold) {
    setPixelColor(colors[1]);
    turnRight(driveSpeed);
  } else if (followerReadings[2] > threshold) {
    setPixelColor(colors[2]);
    turnLeft(driveSpeed);
  } else {
    // stop if no line is detected
    setPixelColor(colors[0]);
    stopWheels();
  }
} // end of lineFollow

void irRemote() {
  if (irrecv.decode(&results)) { // Check if a signal is received
    switch (results.value) {
      case 0xFF22DD: Serial.println("Button Left");
        setPixelColor(colors[0]);
        pivotRight(driveSpeed);
        currentState = NONE;
        break;
      case 0xFFC23D: Serial.println("Button Right");
        setPixelColor(colors[1]);
        pivotLeft(driveSpeed);
        currentState = NONE;
        break;
      case 16736925: Serial.println("Button Up");
        setPixelColor(colors[3]);
        driveForward(driveSpeed);
        currentState = NONE;
        break;
      case 16754775: Serial.println("Button Down");
        setPixelColor(colors[4]);
        driveBackward(driveSpeed);
        currentState = NONE;
        break;
      case 16712445: Serial.println("Button OK");
        setPixelColor(colors[1]);
        stopWheels();
        currentState = NONE;
        break;
      case 16738455: Serial.println("Button 1");
        stopWheels(); 
        currentState = RAINBOW_LIGHTS;
        break;
      case 16750695: Serial.println("Button 2");
        currentState = DRIVE_PATTERN;
        break;
      case 16756815: Serial.println("Button 3");
        stopWheels();
        currentState = AVOIDANCE;
        headServo.write(90);
        break;
      case 16724175: Serial.println("Button 4");
        stopWheels();
        currentState = LINE_FOLLOW;
        break;
      case 16718055: Serial.println("Button 5");
        break;
      case 16743045: Serial.println("Button 6");
        break;
      case 16716015: Serial.println("Button 7");
        driveSpeed = 50;
        setPixelColor(colors[1]);
        break;
      case 16726215:Serial.println("Button 8");
        driveSpeed = 100;
        break;
      case 16734885:Serial.println("Button 9");
        driveSpeed = 150;
        break;
      case 16728765:Serial.println("Button *");
        setPixelColor(colors[1]);
        stopWheels();
        currentState = NONE;
      case 16730805:Serial.println("Button 0");
        driveSpeed = 255;
        break;
      case 16732845: Serial.println("Button #");
        setPixelColor(colors[1]);
        stopWheels();
        currentState = NONE;
        break;
    }
    irrecv.resume(); // Receive the next value
  }
} // end of irRemote
