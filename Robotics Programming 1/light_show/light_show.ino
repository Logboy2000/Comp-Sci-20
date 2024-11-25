#include "FastLED.h"

#define LED_COUNT 48

#define DATA_PIN 10
#define CLOCK_PIN 13

// Define the array of leds
CRGB leds[LED_COUNT];

void setup() {
  FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, LED_COUNT);
  lightShow(); //Where all the lights get changed

}

void loop() {

}

void lightShow(){
  movingLineL(20, 5, CRGB(0, 255, 0));
  
  
}

// Sets all lights in between the two values to the given color
void setLEDS(int firstLightNum, int lastLightNum, CRGB color) {
  for (int i = firstLightNum; i < lastLightNum; i++) {
    leds[i] = color;
  }
  FastLED.show();
}

void setLED(int num, CRGB color){
  leds[num] = color;
  FastLED.show();
}

void movingLineL(int lineLength, int startingLED, CRGB color) {
  int i = startingLED;
  for (i = startingLED; i < LED_COUNT + lineLength; i++) {
    setLEDS(i, i + lineLength, color);
    delay(10);
    setLED(i, CRGB(0,0,0));
  }
  clearLEDS();
}

void clearLEDS(){
  setLEDS(0, LED_COUNT, CRGB(0,0,0));
  FastLED.show();
}
