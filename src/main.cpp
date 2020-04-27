#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "util/network.h"
#include "secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS; 
int status = WL_IDLE_STATUS; // the Wifi radio's status

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  Serial.print("You're connected to the network");
  printCurrentNet();
  printWifiData();
}

void loop() {
  // check the network connection once every 10 seconds:
  delay(10000);
  printCurrentNet();
}