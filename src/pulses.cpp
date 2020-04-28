#include "pulses.h"

Pulses::Pulses() {
  reset();
}

void Pulses::addPulse(uint32_t time) {
  if (length >= MAX_LENGTH) {
    reset(); // better than crashing hopefully!
  }
  buffer[length] = time;
  length++;
}

void Pulses::reset() {
  length = 0;
}

void Pulses::printTo(WiFiClient& client) {
  client.print("{");
    client.print("\"time\":");
    client.print(millis());
    client.print(",");
    client.print("\"pulses\":[");
    for (uint32_t i = 0; i < length; i++) {
      client.print(buffer[i]);
      if (i != (length - 1)) {
        client.print(",");
      }
    }
    client.print("]");
  client.print("}");
}