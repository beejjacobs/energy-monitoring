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

void Pulses::printTo(Print& client) {
  uint32_t now = millis();

  client.write((byte*)&now, sizeof(now));
  for (uint32_t i = 0; i < length; i++) {
    client.write((byte*)&buffer[i], sizeof(buffer[i]));
  }
}