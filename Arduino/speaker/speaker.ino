int c = 261;
int cSharp = 277;
int d = 294;
int dSharp = 311;
int e = 329;
int f = 349;
int fSharp = 370;
int g = 392;
int gSharp = 415;
int a = 440;
int aSharp = 466;
int b = 493;
int C = 523;
int CSharp = 554;
int D = 587;
int DSharp = 622;
int E = 659;
int F = 698;
int FSharp = 740;
int G = 784;
int GSharp = 831;
int A = 880;
int ASharp = 932;
int B = 987;

int speaker = 11;

void setup() {
  pinMode(speaker, OUTPUT);
}

void loop() {
  playSong();
}

void playTone(int tone, int duration) {
  for (long i = 0; i < duration * 1000L; i += tone * 2) {
    digitalWrite(speaker, HIGH);
    delayMicroseconds(tone);
    digitalWrite(speaker, LOW);
    delayMicroseconds(tone);
  }
}

void playSong() {
  int melody[] = {
    E, E, E, CSharp, D, E, G, G, G, FSharp, E, CSharp, D, E, B, B, CSharp, B, A, G, A, B
  };

  // Approximate durations for the melody (in milliseconds)
  int durations[] = {
    250, 250, 250, 250, 250, 250, 500, 250, 250, 250, 250, 250, 250, 500, 250, 250, 250, 250, 250, 500, 500
  };

  // Play the melody
  for (int i = 0; i < sizeof(melody) / sizeof(melody[0]); i++) {
    playTone(melody[i], durations[i]);
    delay(50); // Small pause between notes
  }
}
