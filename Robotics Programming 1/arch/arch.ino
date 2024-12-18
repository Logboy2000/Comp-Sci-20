#include "FastLED.h"

#define NUM_LEDS 16  // 49
#define LAST_LED 15  // 48
#define MIDDLE_LED 8 // 24

// Pins
#define DATA_PIN 10
#define THE_PERFECT_AMAZING_UNUSED_CLOCK_PIN 13 

// Common Colors
#define WHITE CRGB(255, 255, 255)
#define RED CRGB(255, 0, 0)
#define GREEN CRGB(0, 255, 0)
#define BLUE CRGB(0, 0, 255)
#define CYAN CRGB(0, 255, 255)
#define MAGENTA CRGB(255, 0, 255)
#define YELLOW CRGB(255, 255, 0)
#define BLACK CRGB(0, 0, 0)

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup()
{
  FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);
  blackout();
} // end of setup

void loop()
{
  int del = 1;
  startToEnd(WHITE, del);
  startToEnd(RED, del);
  endToStart(WHITE, del);
  endToStart(BLACK, del);
  endToStart(WHITE, del);
  endToStart(RED, del);
  for (int i = 0; i < 10; i++)
  {
    alternatingColors(WHITE, GREEN);
    delay(50); 
    alternatingColors(CYAN, YELLOW);
    delay(50); 
  }
  endsToMiddle(WHITE, 10);
  middleToEnds(BLACK, 10);

  for (int ledCount = 0; ledCount < NUM_LEDS; ledCount++)
  {
    sparkle(WHITE, 10, ledCount, 10);
  }

  for (int i = 0; i < 3; i++)
  {
    fadeTo(WHITE, 10);
    fadeTo(BLACK, 10);
  }

  startToEnd(RED, 10);
  endToStart(BLACK, 10);

  alternatingColors(GREEN, YELLOW); // Alternating green and yellow
  delay(10);

  endsToMiddle(BLUE, 10); // Fill to middle with blue
  middleToEnds(BLUE, 10); // Reverse blue

  fadeTo(YELLOW, 10); // Fill with yellow
  FastLED.show();
  delay(10);

  for (int ledCount = 0; ledCount < NUM_LEDS; ledCount++)
  {
    sparkle(WHITE, 10, ledCount, 10); // Sparkle effect
  }

  fadeTo(BLACK, 1); // Fade to black

} // end of loop

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
} // end of endToStart

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
  line(1, LAST_LED, color2, 2);
} // end of alternatingColors

void endsToMiddle(CRGB color, int delayMil)
{
  // Loop for half of the LEDs
  for (int i = 0; i < MIDDLE_LED; i++)
  {
    // Right line
    line(0, i, color, 1);
    // Left line
    line(LAST_LED - i, NUM_LEDS, color, 1);
    delay(delayMil);
  }
} // end of endsToMiddle

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
} // end of middleToEnds

/**
 * Sparkles the LEDs with the given color for the specified number of times.
 *
 * @param color The color to use for the sparkles.
 * @param delayMil The delay in milliseconds between each sparkle.
 * @param numSparkle The number of LEDs to sparkle each time.
 * @param sparkleRepeat The number of times to repeat the sparkle effect.
 */
void sparkle(CRGB color, int delayMil, int numSparkle, int sparkleRepeat)
{
  for (int count = 0; count < sparkleRepeat; count++)
  {
    for (int i = 0; i < numSparkle; i++)
    {
      int ledIndex = random(NUM_LEDS); // Randomly select an LED to light up
      leds[ledIndex] = color;
    }
    FastLED.show();
    delay(delayMil);

    for (int i = 0; i < NUM_LEDS; i++)
    {
      leds[i] = BLACK; // Turn off the LED
    }
  }
} // end of sparkle

void fadeTo(CRGB color, int delayMil)
{
  int fadeAmount = 5; // Adjust this value for the fade speed

  for (int i = 0; i < 256; i += fadeAmount)
  {
    for (int j = 0; j < NUM_LEDS; j++)
    {
      CRGB currentColor = leds[j]; // Get the current color of each LED
      leds[j] = CRGB(
          currentColor.r + (color.r - currentColor.r) * i / 255,
          currentColor.g + (color.g - currentColor.g) * i / 255,
          currentColor.b + (color.b - currentColor.b) * i / 255);
    }
    FastLED.show();
    delay(delayMil);
  }
} // end of fadeIn

void fillAllLeds(CRGB color)
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    leds[i] = color;
  }
} // end of fillAllLeds

void blackout()
{
  fillAllLeds(BLACK);
} // end of blackout