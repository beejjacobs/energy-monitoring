#include <Arduino.h>

#include <WiFiNINA.h>

#define MAX_LENGTH 256 * 4

class Pulses {
  public:
    Pulses();

    void addPulse(uint32_t);
    void reset();

    void printTo(Print&);

  private:
    uint16_t length;
    uint32_t buffer[MAX_LENGTH];
};