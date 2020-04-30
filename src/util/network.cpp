#include "util/network.h"

#include <SPI.h>
#include <WiFiNINA.h>
#include "debug.h"

void printIp() {
  IPAddress ip = WiFi.localIP();
  debugPrint("IP Address: ");
  debugPrintln(ip);
}