#ifndef KiwiMQTT_h
#define KiwiMQTT_h
#include "Arduino.h"
#include "PubSubClient.h"
#include "rpcWiFi.h"
class KiwiMQTT {
    public:
    KiwiMQTT(char* ssid,char* secret,String name);
    void init();
    bool setServer(char* broker,int port); 
    void setCallback(void (*callback)(char*, uint8_t*, unsigned int));
    void publish(String data);
    void sweep();
    bool connect();
    bool getBrokerStatus();
    int getWiFiStatus();
    private:
    PubSubClient _pubSubClient;
    WiFiClient _wifiClient;
    String _name;
    char* _ssid;
    char* _secret;

};

#endif
