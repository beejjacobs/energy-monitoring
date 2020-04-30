#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "api.h"
#include "debug.h"
#include "pulses.h"
#include "secrets.h"
#include "util/network.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;  // the Wifi radio's status

int digPin = 10;
WiFiServer server(80);
Pulses pulses;
volatile byte state = LOW;

void onPulse() {
  state = digitalRead(digPin);
  if (state) {
    pulses.addPulse(millis());
  }
}

void setup() {
  if (debug) {
    Serial.begin(9600);
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

  debugPrint("Attempting to connect to WPA SSID: ");
  debugPrintln(ssid);
  status = WiFi.begin(ssid, pass);

  while (status != WL_CONNECTED) {
    delay(2000);
    debugPrint("Attempting to connect to WPA SSID: ");
    debugPrintln(ssid);
    status = WiFi.begin(ssid, pass);
  }

  debugPrintln("Connected to the network");
  printIp();

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(digPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(digPin), onPulse, CHANGE);

  server.begin();
}

void loop() {
  digitalWrite(LED_BUILTIN, state);
  
  WiFiClient client = server.available();  // listen for incoming clients

  if (client) {                    // if you get a client,
    // debugPrintln("new client");  // print a message out the serial port
    ApiAction action = ApiAction::UNKNOWN;
    String currentLine = "";       // make a String to hold incoming data from the client
    while (client.connected()) {   // loop while the client's connected
      if (client.available()) {    // if there's bytes to read from the client,
        char c = client.read();    // read a byte, then
        // Serial.write(c);           // print it out the serial monitor
        if (c == '\n') {           // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            debugPrint("HTTP request ");
            debugPrintln((byte) action);

            switch (action) {
              case ApiAction::UNKNOWN:
                client.println("HTTP/1.1 404 Not found");
                break;
              case ApiAction::DATA:
                client.println("HTTP/1.1 200 OK");
                client.println("Content-type:application/json");
                client.println();
                pulses.printTo(client);
                client.println();
                break;
              case ApiAction::RESET:
                pulses.reset();
                client.println("HTTP/1.1 200 OK");
                break;
            }
            break; // break out of the while loop:
          } else {  // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        if (currentLine.endsWith("GET / HTTP")) {
           action = ApiAction::DATA;
        } else if (currentLine.endsWith("GET /reset HTTP")) {
          action = ApiAction::RESET;
        }
      }
    }
    client.stop();
  }
}