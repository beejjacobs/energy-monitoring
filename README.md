# Energy Monitoring

This project uses pulse counting for monitoring energy usage and calculating power consumption.

# Parts

You will need:

 * [Arduino Nano 33 IoT](https://store.arduino.cc/arduino-nano-33-iot) + microUSB cable
 * [TSL257-LF ams, 690nm Visible Light Photodetector Amplifier](https://uk.rs-online.com/web/p/photodetector-amplifiers/6424430)
 * Something to mount it all on (perhaps some breadboard)

# /arduino

This folder contains the Arduino code, for an [Arduino Nano 33 IoT](https://store.arduino.cc/arduino-nano-33-iot); which has WiFi. The pulses from the 
photodetector are picked up with an interrupt; which marks the "time" the pulses
occurred. Then there is a basic TCP server on port 23 which sends the data
every second.

This project uses the [PlatformIO](https://platformio.org/) build system.

# /server

This folder contains a basic Node server for getting data from the Arduino.