#include <Servo.h>

Servo servo1;

int servoPosition = 0;

void setup()
{
  servo1.attach(9);
}


void loop()
{
  for (servoPosition = 0; servoPosition < 180; servoPosition += 1) {// goes from 0 degrees to 180 degrees 
    servo1.write(servoPosition);
    delay(200); // waits for the servo to move
  }
  for (servoPosition = 180; servoPosition >= 1; servoPosition -= 1) {// goes from 180 degrees to 0 degrees
    servo1.write(servoPosition);
    delay(200); // waits for the servo to move
  }
}
