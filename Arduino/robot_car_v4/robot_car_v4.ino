#include <FastLED.h>
#include <Servo.h>

// How many LEDs in your strip?
#define LED_COUNT 1
#define LED_PIN 4

Servo servo;

// Whole lotta colors
const int colors[13][3] = {
  {255,255,255}, // White
  {255,0,0},     // Red
  {0,255,0},     // Green
  {0,0,255},     // Blue
  {255,0,255},   // Magenta
  {255,255,0},   // Yellow
  {0,255,255},   // Cyan
  {128,0,128},   // Purple
  {255,165,0},   // Orange
  {128,128,0},   // Olive
  {0,128,128},   // Teal
  {0,128,0},     // Dark Green
  {128,0,0},     // Maroon
};

CRGB leds[LED_COUNT];

void setup() { 
  // Set those pins
  FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_COUNT);
  servo.attach(9);
  FastLED.setBrightness(255);
}

void loop() {
  //cycleColors(colors, 13, 500); 
  rainbowCycle(3);
}

void setPixelColor(const int color[3]) {
  leds[0] = CRGB(color[0], color[1], color[2]);
  FastLED.show();
}

void cycleColors(const int colorArray[][3], int colorCount, int delayTime) {
  for (int i = 0; i < colorCount; i++) {
    setPixelColor(colorArray[i]);
    delay(delayTime);
  }
}

void rainbowCycle(int delayTime) {
  for (int hueShift = 0; hueShift < 256; hueShift++) { // Cycle through hues
    for (int i = 0; i < LED_COUNT; i++) {
      int hue = (i * 256 / LED_COUNT + hueShift) % 256; // Calculate hue for each LED
      leds[i] = CHSV(hue, 255, 255); // Set color based on hue
    }
    FastLED.show(); // Display the LED colors
    delay(delayTime); // Delay to control the speed of the cycle
  }
}
