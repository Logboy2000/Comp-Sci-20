#include <FastLED.h>

// How many leds in your strip?
#define NUM_LEDS 94

#define DATA_PIN 10
#define CLOCK_PIN 13

// Define the array of leds
CRGB leds[NUM_LEDS];

// Colors
CRGB WHITE = CRGB(255,255,255);

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
  line(0,NUM_LEDS,CRGB(0,0,0));
}// end of setup

void loop() {
  int del = 1;
//  startToEnd(CRGB(255,255,255), del);
//  startToEnd(CRGB(0,255,255), del);
//  startToEnd(CRGB(0,0,255), del);
//  startToEnd(CRGB(0,0,0), del);
//  endToStart(CRGB(255,0,0), del);
//  endToStart(CRGB(255,255,0), del);
//  endToStart(CRGB(255,255,255), del);
//  endToStart(CRGB(0,0,0), del);
//    allOutside(CRGB(255,255,255), del);
  line(93,96,WHITE);

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
      line(1, 9, color);
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


void allOutside(CRGB color, int delayMilliseconds){
  outerBranch(0,color);
  outerBranch(1,color);
  outerBranch(2,color);
  outerBranch(3,color);
  outerBranch(4,color);
  outerBranch(5,color);
  delay(delayMilliseconds);
}



void arrayToLights(int arr[], int arrayLength, CRGB color) {
  for (int i = 0; i < arrayLength; i++) {
    int lightIndex = arr[i];
    leds[lightIndex] = color;
  }
}
