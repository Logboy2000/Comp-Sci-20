//PhotoResistor Pin
int lightPin = 0; 
//LED Pin
int ledPin = 9;   
                  
                  
                  
void setup(){
  pinMode(ledPin, OUTPUT); //sets the led pin to output
}

void loop(){
  //this easy
  int lightLevel = analogRead(lightPin); //Read the light level
  lightLevel = map(lightLevel, 0, 900, 0, 255);
  lightLevel = constrain(lightLevel, 0, 255);
  analogWrite(ledPin, lightLevel); 
}
