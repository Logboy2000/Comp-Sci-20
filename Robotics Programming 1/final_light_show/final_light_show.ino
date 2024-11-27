// Diagram https://raw.githubusercontent.com/Logboy2000/Comp-Sci-20/refs/heads/main/Robotics%20Programming%201/final_light_show/Star.png
#include <FastLED.h>

#define NUM_LEDS 94

// First LED is 0
// Led 94 is cooked
#define LAST_LED 93


#define DATA_PIN 10
#define CLOCK_PIN 13

// Define the array of leds
CRGB leds[NUM_LEDS];

// Colors
CRGB WHITE = CRGB(255,255,255);

int inner_leds[42] = {9,10,11,12,13,14,71,72,73,74,75,33,34,35,36,37,38,79,80,81,82,57,58,59,60,61,62,63,64,65,66,67,68,69,70,76,77,78,84,83,85,86};
void setup() {
  Serial.begin(9600);
  FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
  // Turn off all LEDS
  line(0,NUM_LEDS,CRGB(0,0,0));
}// end of setup

void loop() {
  int del = 10;
  int del2 = 100;
  startToEnd(CRGB(0,0,0), del);
  startToEnd(CRGB(255,255,255), del);
  startToEnd(CRGB(0,255,255), del);
  startToEnd(CRGB(0,0,255), del);
  startToEnd(CRGB(0,0,0), del);
  endToStart(CRGB(255,0,0), del);
  endToStart(CRGB(255,255,0), del);
  endToStart(CRGB(255,255,255), del);
  endToStart(CRGB(0,0,0), del);
  allOutside(CRGB(255,255,255));
  for(int i = 0; i < 6; i++){
    allOutside(CRGB(0,255,255));
    allInside(CRGB(255,255,255));
    delay(del2);
    allOutside(CRGB(255,255,255));
    allInside(CRGB(0,255,255));
    delay(del2);
  }

  

}// end of loop

void startToEnd(CRGB color, int delayMil){
  for(int i = 0; i < NUM_LEDS; i++){
    line(0, i, color);
    delay(delayMil);
  }
}

void endToStart(CRGB color, int delayMil){
    for(int i = NUM_LEDS; i >= 0; i--){
    line(i, NUM_LEDS, color);
    delay(delayMil);
  }
}


void line(int startIndex, int endIndex, CRGB color) {
  for (int i = startIndex; i <= endIndex; i++) {
    leds[i] = color;
  }
  FastLED.show();
}// end of line

void outerBranch(int index, CRGB color) {
  switch (index) {
    case 0:
      line(0, 8, color);
      break;
    case 1:
      line(15, 23, color);
      break;
    case 2:
      line(24, 32, color);
      break;
    case 3:
      line(39, 47, color);
      break;
    case 4:
      line(48, 56, color);
      break;
    case 5:
      line(87, LAST_LED, color);
      break;
    default:
      line(0, NUM_LEDS, CRGB(255, 255, 255));
      break;
  }
}// end of outerBranch

void innerBranch(int index, CRGB color) {
  switch (index) {
    case 0:
      line(10, 15, color);
      break;
    case 1:
      line(16, 24, color);
      break;
    case 2:
      line(25, 33, color);
      break;
    case 3:
      line(40, 48, color);
      break;
    case 4:
      line(49, 57, color);
      break;
    case 5:
      line(88, 96, color);
      break;
    default:
      line(0, NUM_LEDS, CRGB(255, 255, 255));
      break;
  }
}// end of innerBranch


void allOutside(CRGB color){
  outerBranch(0,color);
  outerBranch(1,color);
  outerBranch(2,color);
  outerBranch(3,color);
  outerBranch(4,color);
  outerBranch(5,color);
}

void allInside(CRGB color){
  arrayToLights(inner_leds, 42, color);
}



void arrayToLights(int arr[], int arrayLength, CRGB color) {
  for (int i = 0; i < arrayLength; i++) {
    int lightIndex = arr[i];
    leds[lightIndex] = color;
  }
  FastLED.show();
}
