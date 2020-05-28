#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "api.h"
#include "debug.h"
#include "network.h"
#include "pulses.h"
#include "secrets_real.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;  // the Wifi radio's status

int digPin = 10;
WiFiServer server(23);
Pulses pulses;
volatile byte state = LOW;

uint32_t previousMillis = 0;
uint32_t interval = 1000;

void onPulse() {
  state = digitalRead(digPin);
  if (state) {
    pulses.addPulse(millis());
  }
}

void connectToWifi() {
  debugPrint("Attempting to connect to WPA SSID: ");
  debugPrintln(ssid);
  status = WiFi.begin(ssid, pass);

  while (status != WL_CONNECTED) {
    delay(2000);
    debugPrint("Attempting to connect to WPA SSID: ");
    debugPrintln(ssid);
    status = WiFi.begin(ssid, pass);
  }
}

void setup() {
  Serial.begin(9600);
  if (debug) {
    while (!Serial) {
    }
  }

  if (WiFi.status() == WL_NO_MODULE) {
    debugPrintln("Communication with WiFi module failed!");
    while (true) {
    }
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    debugPrintln("Please upgrade the firmware");
  }
  server.begin();
  connectToWifi();

  debugPrintln("Connected to the network");
  printIp();

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(digPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(digPin), onPulse, CHANGE);
}

void loop() {
  digitalWrite(LED_BUILTIN, state);
  
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis > interval) {
    previousMillis = currentMillis;
    status = WiFi.status();
    if (status == WL_CONNECTED) {
      // we're connected, let's send some data
      pulses.printTo(server);
      server.println();
    } else if (status == WL_DISCONNECTED || status == WL_CONNECTION_LOST) {
      // we lost WiFi, let's reconnect
      connectToWifi();
    }
  }
}