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
  client.print(millis());
  if (length > 0) {
    client.print(',');
  }
  for (uint16_t i = 0; i < length; i++) {
    client.print(buffer[i]);
    if (i < (length - 1)) {
      client.print(',');
    }
  }
  reset(); // data is lost if no client is connected
}