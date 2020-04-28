#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "pulses.h"
#include "secrets.h"
#include "util/network.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;  // the Wifi radio's status

int led = LED_BUILTIN;
WiFiServer server(80);
Pulses pulses;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
  }

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true) {
    }
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    // wait 2 seconds for connection:
    delay(2000);
  }

  Serial.println("Connected to the network");
  printWifiNetworkInfo();
  printWifiData();

  pinMode(LED_BUILTIN, OUTPUT);

  server.begin();
}

void loop() {
  WiFiClient client = server.available();  // listen for incoming clients

  if (client) {                    // if you get a client,
    Serial.println("new client");  // print a message out the serial port
    bool resType = false;
    String currentLine = "";       // make a String to hold incoming data from the client
    while (client.connected()) {   // loop while the client's connected
      if (client.available()) {    // if there's bytes to read from the client,
        char c = client.read();    // read a byte, then
        // Serial.write(c);           // print it out the serial monitor
        if (c == '\n') {           // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            Serial.println("request end");
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            if (resType) {
              client.println("Content-type:application/json");
              client.println();
              pulses.printTo(client);
              client.println();
            } else {
              client.println("Content-type:text/html");
              client.println();

              // the content of the HTTP response follows the header:
              client.print("Click <a href=\"/H\">here</a> turn the LED on<br>");
              client.print("Click <a href=\"/L\">here</a> turn the LED off<br>");

              // The HTTP response ends with another blank line:
              client.println();
            }
            // break out of the while loop:
            break;
          } else {  // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        if (currentLine.endsWith("GET / HTTP")) {
           resType = true;
           pulses.addPulse(millis());
        } else if (currentLine.endsWith("GET /H")) {
          digitalWrite(led, HIGH);  // GET /H turns the LED on
        } else if (currentLine.endsWith("GET /L")) {
          digitalWrite(led, LOW);  // GET /L turns the LED off
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}