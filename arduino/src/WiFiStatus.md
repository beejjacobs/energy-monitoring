# WiFi.status()


* WL_CONNECTED: assigned when connected to a WiFi network;
* WL_AP_CONNECTED : assigned when a device is connected in Access Point mode;
* WL_AP_LISTENING : assigned when the listening for connections in Access Point mode;
* WL_NO_SHIELD: assigned when no WiFi shield is present;
* WL_NO_MODULE: assigned when the communication with an integrated WiFi module fails;
* WL_IDLE_STATUS: it is a temporary status assigned when WiFi.begin() is called and remains active until the number of attempts expires (resulting in WL_CONNECT_FAILED) or a connection is established (resulting in WL_CONNECTED);
* WL_NO_SSID_AVAIL: assigned when no SSID are available;
* WL_SCAN_COMPLETED: assigned when the scan networks is completed;
* WL_CONNECT_FAILED: assigned when the connection fails for all the attempts;
* WL_CONNECTION_LOST: assigned when the connection is lost;
* WL_DISCONNECTED: assigned when disconnected from a network;