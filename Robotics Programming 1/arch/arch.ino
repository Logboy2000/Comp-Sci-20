#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 49
#define LAST_LED 48

#define DATA_PIN 10
#define CLOCK_PIN 13



// Define the array of leds
CRGB leds[NUM_LEDS];

void setup() { 
  FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);
}

void loop() { 
  startToEnd(CRGB(255,255,255), 10);
  delay(10);
  startToEnd(CRGB(0,0,0), 10);
}

void startToEnd(CRGB color, int delayMil)
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    line(0, i, color);
    delay(delayMil);
  }
} // end of startToEnd

void endToStart(CRGB color, int delayMil)
{
  for (int i = NUM_LEDS; i >= 0; i--)
  {
    line(i, NUM_LEDS, color);
    delay(delayMil);
  }
} // End of endToStart

void line(int startIndex, int endIndex, CRGB color)
{
  for (int i = startIndex; i <= endIndex; i++)
  {
    leds[i] = color;
  }
  FastLED.show();
} // end of line