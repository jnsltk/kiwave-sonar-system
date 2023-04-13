#ifndef KiwiMQTT_h
#define KiwiMQTT_h
#include "Arduino.h"
#include "PubSubClient/PubSubClient.h"
class KiwiMQTT {
    public:
    KiwiMQTT(char* ssid,char* secret);
    bool init(char* broker); //Connects to chosen MQTT broker.
    bool publish(char* data);
    bool handshake();
    private:
    PubSubClient _pubSubClient;
    WiFiClient _wifiClient;
    char* _ssid;
    char* _secret;
    int _timeout;
};

#endif
