#ifndef KiwiMQTT_h
#define KiwiMQTT_h
#include "Arduino.h"
#include "PubSubClient.h"
#include "rpcWiFi.h"
class KiwiMQTT {
    public:
    KiwiMQTT(char* ssid,char* secret);
    void init();
    void setServer(char* broker,int port); 
    void setCallback(void (*callback)(char*, uint8_t*, unsigned int));
    void publish(String data);
    void sweep();
    void connect();
    bool getBrokerStatus();
    int getWiFiStatus();
    private:
    PubSubClient _pubSubClient;
    WiFiClient _wifiClient;
    char* _ssid;
    char* _secret;
};

#endif
