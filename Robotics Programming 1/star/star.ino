// Strip Diagram https://raw.githubusercontent.com/Logboy2000/Comp-Sci-20/refs/heads/main/Robotics%20Programming%201/final_light_show/Star.png
#include <FastLED.h>

// 95th led is cooked
#define NUM_LEDS 94

// First LED is 0

#define LAST_LED 93

#define DATA_PIN 10
#define CLOCK_PIN 13

// Define the array of leds
CRGB leds[NUM_LEDS];

// Colors
CRGB WHITE = CRGB(255, 255, 255);

int outerBranch1[] = {0, 1, 2, 3, 4, 5, 6, 7, 8};          // Bottom
int outerBranch2[] = {15, 16, 17, 18, 19, 20, 21, 22, 23}; // Bottom Left
int outerBranch3[] = {24, 25, 26, 27, 28, 29, 30, 31, 32}; // Up Left
int outerBranch4[] = {39, 40, 41, 42, 43, 44, 45, 46, 47}; // Up
int outerBranch5[] = {48, 49, 50, 51, 52, 53, 54, 55, 56}; // Up Right
int outerBranch6[] = {87, 88, 89, 90, 91, 92, 93};         // Down Right

int innerLeds[] = {9, 10, 11, 12, 13, 14, 71, 72, 73, 74, 75, 33, 34, 35, 36, 37, 38, 79, 80, 81, 82, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 76, 77, 78, 84, 83, 85, 86};
int innerBranch1[] = {9, 10, 11, 12, 13, 14, 70, 69, 68};      // Bottom
int innerBranch2[] = {69, 70, 14, 71, 72, 73, 74, 75, 33, 76}; // Bottom Left
int innerBranch3[] = {76, 33, 34, 35, 36, 37, 38, 78, 77};     // Up Left
int innerBranch4[] = {77, 78, 38, 79, 80, 81, 82, 57, 83, 83}; // Up
int innerBranch5[] = {84, 83, 57, 58, 59, 60, 61, 86, 85};     // Up Right
int innerBranch6[] = {62, 63, 64, 65, 66, 67, 85, 86};         // Down Right

int line1[] = {43, 42, 41, 40, 39, 38, 78, 77, 68, 67, 8, 7, 6, 2, 3};
int line2[] = {20, 21, 17, 16, 15, 14, 70, 69, 84, 83, 57, 56, 55, 54, 50, 51};
int line3[] = {27, 26, 30, 31, 32, 33, 76, 85, 86, 87, 88, 93, 92};

void setup()
{
  FastLED.addLeds<WS2811, DATA_PIN, RGB>(leds, NUM_LEDS);
} // end of setup

void loop()
{
  lightshow();
} // end of loop

void lightshow()
{
  int del = 10;
  int del2 = 100;
  startToEnd(CRGB(0, 0, 0), del);
  startToEnd(CRGB(255, 255, 255), del);
  startToEnd(CRGB(0, 255, 255), del);
  startToEnd(CRGB(0, 0, 255), del);
  startToEnd(CRGB(0, 0, 0), del);
  endToStart(CRGB(255, 0, 0), del);
  endToStart(CRGB(255, 255, 0), del);
  endToStart(CRGB(255, 255, 255), del);
  endToStart(CRGB(0, 0, 0), del);
  for (int i = 0; i < 6; i++)
  {
    allOutside(CRGB(0, 255, 255));
    allInside(CRGB(255, 255, 255));
    delay(del2);
    allOutside(CRGB(255, 255, 255));
    allInside(CRGB(0, 255, 255));
    delay(del2);
  }
  for (int i = 0; i < 3; i++)
  {
    arrayToColor(outerBranch1, 9, WHITE);
    allLeds(CRGB(255, 0, 0));
    arrayToColor(line3, 13, WHITE);
    delay(del2);
    allLeds(CRGB(255, 0, 0));
    arrayToColor(line2, 16, WHITE);
    delay(del2);
    allLeds(CRGB(255, 0, 0));
    arrayToColor(line1, 15, WHITE);
    delay(del2);
  }
  allLeds(CRGB(255, 0, 0));
  delay(del2);
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

void gradientLine(int startIndex, int endIndex, CRGB color1, CRGB color2)
{
  int numLeds = endIndex - startIndex + 1;

  for (int i = startIndex; i <= endIndex; i++)
  {
    // Calculate the interpolation factor based on the current position
    float factor = float(i - startIndex) / float(numLeds - 1);

    // Interpolate the RGB values for the gradient
    uint8_t r = color1.r + factor * (color2.r - color1.r);
    uint8_t g = color1.g + factor * (color2.g - color1.g);
    uint8_t b = color1.b + factor * (color2.b - color1.b);

    // Set the color of the LED at position i
    leds[i] = CRGB(r, g, b);
  }

  FastLED.show();
} // end of gradientLine




void allOutside(CRGB color)
{
  arrayToColor(outerBranch1, 9, color);
  arrayToColor(outerBranch2, 9, color);
  arrayToColor(outerBranch3, 9, color);
  arrayToColor(outerBranch4, 9, color);
  arrayToColor(outerBranch5, 9, color);
  arrayToColor(outerBranch6, 9, color);
} // End of allOutside

void allInside(CRGB color)
{
  arrayToColor(innerLeds, 42, color);
} // end of allInside

void allLeds(CRGB color)
{
  line(0, NUM_LEDS, color);
}

void blackout()
{
  allLeds(CRGB(0, 0, 0));
} // end of blackout

void arrayToColor(int arr[], int length, CRGB color)
{
  for (int i = 0; i < length; i++)
  {
    int lightIndex = arr[i];
    leds[lightIndex] = color;
  }
  FastLED.show();
} // end of arrayToColor
