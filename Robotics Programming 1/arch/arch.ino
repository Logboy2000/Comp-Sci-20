#include <FastLED.h>

#define NUM_LEDS 49
#define LAST_LED 48
#define MIDDLE_LED 24

// Pins
#define DATA_PIN 10
#define THE_PERFECT_AMAZING_UNUSED_CLOCK_PIN 13

#define OUTPUT_PIN 7
#define INPUT_PIN 8

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
  pinMode(OUTPUT_PIN, OUTPUT);
  pinMode(INPUT_PIN, INPUT);
  FastLED.addLeds<WS2811, DATA_PIN, BRG>(leds, NUM_LEDS);
  blackout();
} // end of setup

void loop()
{
  digitalWrite(OUTPUT_PIN, LOW);
  lightshow();
  digitalWrite(OUTPUT_PIN, HIGH);
  delay(5000);



} // end of loop

void lightshow()
{
  for (int i = 1000; i > 2; i *= 0.5)
  {
    delay(i);
    pulse(WHITE, 0, 0, i / 50);
  }

  int del = 1;
  startToEnd(WHITE, del);
  startToEnd(RED, del);
  endToStart(WHITE, del);
  endToStart(BLACK, del);
  endToStart(WHITE, del);
  endToStart(RED, del);
  for (int i = 0; i < 10; i++)
  {
    alternatingColors(RED, GREEN);
    delay(50);
    alternatingColors(WHITE, RED);
    delay(50);
  }
  endsToMiddle(10, WHITE, WHITE);
  middleToEnds(10, BLACK, BLACK);
  for (int i = 0; i < 3; i++)
  {
    endsToMiddle(i * 5, BLACK, WHITE);
    middleToEnds(i * 5, CYAN, BLACK);
    middleToEnds(i * 5, BLACK, GREEN);
    endsToMiddle(i * 5, RED, BLACK);
  }

  for (int ledCount = 0; ledCount < NUM_LEDS; ledCount += 10)
  {
    sparkle(WHITE, 10, ledCount, 10);
  }

  fadeTo(WHITE, 10);
  fadeTo(BLACK, 10);
  fadeTo(GREEN, 10);
  fadeTo(RED, 10);
  fadeTo(CYAN, 10);

  startToEnd(RED, 10);
  endToStart(BLACK, 10);

  endsToMiddle(10, BLUE, BLUE);
  endsToMiddle(10, RED, RED);
  endsToMiddle(10, GREEN, GREEN);
  endsToMiddle(10, BLUE, BLUE);
  endsToMiddle(10, CYAN, CYAN);
  endsToMiddle(10, MAGENTA, MAGENTA);

  middleToEnds(10, BLUE, BLUE);
  middleToEnds(10, RED, RED);
  middleToEnds(10, GREEN, GREEN);
  middleToEnds(10, BLUE, BLUE);
  middleToEnds(10, CYAN, CYAN);
  middleToEnds(10, MAGENTA, MAGENTA);

  middleToEnds(10, BLACK, BLACK);

  fadeTo(YELLOW, 10); // Fill with yellow
  delay(10);
  fadeTo(BLACK, 20);

  for (int ledCount = 0; ledCount < NUM_LEDS; ledCount++)
  {
    sparkle(WHITE, 10, ledCount, 10); // Sparkle effect
  }
  blackout();
}

void pulse(CRGB color, int fadeInDel, int holdTime, int fadeOutDel)
{
  fadeTo(color, fadeInDel);
  delay(holdTime);
  fadeTo(BLACK, fadeOutDel);
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

void endsToMiddle(int delayMil, CRGB colorR, CRGB colorL)
{
  // Loop for half of the LEDs
  for (int i = 0; i < MIDDLE_LED; i++)
  {
    // Right line
    line(0, i, colorR, 1);
    // Left line
    line(LAST_LED - i, NUM_LEDS, colorL, 1);
    delay(delayMil);
  }
} // end of endsToMiddle

void middleToEnds(int delayMil, CRGB colorR, CRGB colorL)
{
  // Loop for half of the LEDs
  for (int i = 0; i <= MIDDLE_LED; i++)
  {
    // Right side
    line(MIDDLE_LED - i, MIDDLE_LED, colorR, 1);
    // Left side
    line(MIDDLE_LED, MIDDLE_LED + i, colorL, 1);
    delay(delayMil);
  }
} // end of middleToEnds

/**
   Sparkles the LEDs with the given color for the specified number of times.

   @param color The color to use for the sparkles.
   @param delayMil The delay in milliseconds between each sparkle.
   @param numSparkle The number of LEDs to sparkle each time.
   @param sparkleRepeat The number of times to repeat the sparkle effect.
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
  FastLED.show();
} // end of fillAllLeds

void blackout()
{
  fillAllLeds(BLACK);
} // end of blackout
