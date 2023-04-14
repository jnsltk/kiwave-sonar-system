#ifndef KiwiMQTT_h
#define KiwiMQTT_h
#include "Arduino.h"
#include "PubSubClient.h"
#include "rpcWiFi.h"
class KiwiMQTT {
    public:
    KiwiMQTT(char* ssid,char* secret);
    void init(); //Connects to chosen MQTT broker.
    bool setServer(char* broker,int port); //Connects to chosen MQTT broker.
    void setCallback(void (*callback)(char*, uint8_t*, unsigned int));
    void publish(uint8_t* data,int dataLength);
    void publish(String data);
    void sweep();
    bool connect();
    bool getBrokerStatus();
    int getWiFiStatus();
    private:
    PubSubClient _pubSubClient;
    WiFiClient _wifiClient;
    char* _ssid;
    char* _secret;

};

#endif
