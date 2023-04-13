#include "WiFi/rpcWiFi.h"
#include "Arduino.h"

KiwiMQTT::KiwiMQTT(char* ssid,char* secret,int timeout) {
    _ssid=ssid;
    _secret=secret; 
 }

KiwiMQTT::init(char* broker){
    Serial.println("Attempting connection to WiFi...")
    WiFi.mode(WIFI_STA);
    WiFi.begin(_ssid,_secret);

    for(int i=0;i<3;i++){

    }
}
KiwiMQTT::publish(char* data){
    
}