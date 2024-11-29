#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 49
#define LAST_LED 48
#define MIDDLE_LED 24

#define DATA_PIN 10
// #define CLOCK_PIN 13

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup()
{
  FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);
  blackout();
}

void loop()
{
  int del = 1;
  startToEnd(CRGB(255, 255, 255), del);
  startToEnd(CRGB(255, 0, 0), del);
  endToStart(CRGB(255, 255, 255), del);
  endToStart(CRGB(0, 0, 0), del);
  endToStart(CRGB(255, 255, 255), del);
  endToStart(CRGB(255, 0, 0), del);
  for (int i = 0; i < 10; i++)
  {
    alternatingColors(CRGB(255, 255, 255), CRGB(0, 255, 0));
    delay(100);
    alternatingColors(CRGB(0, 255, 255), CRGB(255, 255, 0));
    delay(100);
  }
  endsToMiddle(CRGB(255,255,255), 10);
  middleToEnds(CRGB(0,0,0), 10);
}

void startToEnd(CRGB color, int delayMil)
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    line(0, i, color, 1);
    delay(delayMil);
  }
} // end of startToEnd

void endToStart(CRGB color, int delayMil)
{
  for (int i = NUM_LEDS; i >= 0; i--)
  {
    line(i, NUM_LEDS, color, 1);
    delay(delayMil);
  }
} // End of endToStart

void line(int startIndex, int endIndex, CRGB color, int increase)
{
  for (int i = startIndex; i <= endIndex; i += increase)
  {
    leds[i] = color;
  }
  FastLED.show();
} // end of line

void alternatingColors(CRGB color1, CRGB color2)
{
  line(0, LAST_LED, color1, 2);
  line(1, LAST_LED - 1, color2, 2);
}

void endsToMiddle(CRGB color, int delayMil)
{
  // Loop for half of the LEDs
  for (int i = 0; i < MIDDLE_LED; i++)
  {
    //Right line
    line(0, i, color, 1);
    //Left line
    line(LAST_LED - i, NUM_LEDS, color, 1);
    delay(delayMil);
  }
}

void middleToEnds(CRGB color, int delayMil)
{
  // Loop for half of the LEDs
  for (int i = 0; i <= MIDDLE_LED; i++)
  {
    // Right side
    line(MIDDLE_LED - i, MIDDLE_LED, color, 1);
    // Left side
    line(MIDDLE_LED, MIDDLE_LED + i, color, 1);
    delay(delayMil);
  }
}




void allLeds(CRGB color)
{
  line(0, NUM_LEDS, color, 1);
}

void blackout()
{
  allLeds(CRGB(0, 0, 0));
} // end of blackout
