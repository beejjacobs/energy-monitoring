#include <Arduino.h>

enum class ApiAction : byte {
  UNKNOWN = 0x00,
 
  DATA = 0x01,
  RESET = 0x02
};