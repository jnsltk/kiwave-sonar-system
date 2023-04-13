#include "rpcWiFi.h"
#include "Arduino.h"
#include "KiwiMQTT.h"
#include "PubSubClient.h"
KiwiMQTT::KiwiMQTT(char* ssid,char* secret) {
    _ssid=ssid;
    _secret=secret; 
    _wifiClient=WiFiClient();
    _pubSubClient=PubSubClient(_wifiClient);

 }

void KiwiMQTT::sweep(){
  _pubSubClient.loop();
}
int KiwiMQTT::getWiFiStatus(){
  return WiFi.status();
}

bool KiwiMQTT::getBrokerStatus(){
  return _pubSubClient.connected();
}

bool KiwiMQTT::connect(){
  String name="KiWaveSonarv1";
  if(_pubSubClient.connect(name.c_str())){
        //_pubSubClient.publish("KiWaveSonarData",REQUEST_HANDSHAKE);
        //Serial.println("Published ");

    _pubSubClient.subscribe("KiWaveSonarData");
        Serial.println("Subscribed");

  } else {
    return false;
  }
  
}
void KiwiMQTT::init(){
    WiFi.mode(WIFI_STA);
    WiFi.begin(_ssid,_secret);
  }

bool KiwiMQTT::setServer(char* broker,int port){
  _pubSubClient.setServer(broker,port);
  
}

void KiwiMQTT::setCallback(void (*callback)(char*, uint8_t*, unsigned int) ){
  _pubSubClient.setCallback(callback);
}

void KiwiMQTT::publish(uint8_t* data,int dataLength){

  _pubSubClient.publish("KiWaveSonarData",(char*) data);
}
