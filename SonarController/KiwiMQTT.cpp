#include "rpcWiFi.h"
#include "Arduino.h"
#include "KiwiMQTT.h"
#include "PubSubClient.h"

KiwiMQTT::KiwiMQTT(char* ssid,char* secret,String name) {
  //Setting private variables.
    _ssid=ssid;
    _secret=secret; 
    _wifiClient=WiFiClient();
    _pubSubClient=PubSubClient(_wifiClient);
    _name=name;
 }

void KiwiMQTT::sweep(){
  //The call to the loop function results in a polling for the latest updates from the broker.
  _pubSubClient.loop();
}
int KiwiMQTT::getWiFiStatus(){
  //Returning the status of the WiFi connection.
  return WiFi.status();
}

bool KiwiMQTT::getBrokerStatus(){
  //Returning the status of the connection to the broker.
  return _pubSubClient.connected();
}

bool KiwiMQTT::connect(){
  //Connecting to the broker with username.
  if(_pubSubClient.connect(_name.c_str())){
      //Subscribing to the topic that controls the sonar.
    _pubSubClient.subscribe("KiWaveSonarCommand");
        Serial.println("Subscribed");

  } else {
    return false;
  }
  
}
void KiwiMQTT::init(){
    //Connecting to the WiFi network
    WiFi.mode(WIFI_STA);
    WiFi.begin(_ssid,_secret);
  }

bool KiwiMQTT::setServer(char* broker,int port){
  //Setting the broker.
  _pubSubClient.setServer(broker,port);
  
}

void KiwiMQTT::setCallback(void (*callback)(char*, uint8_t*, unsigned int) ){
  //Setting the callback function that will be called when a message is received from the broker.
  _pubSubClient.setCallback(callback);
}
void KiwiMQTT::publish(String data){
  //Converting the string to a char array and then publishing it to the topic where distance and range is received by the frontend.
  int stringLength=data.length()+1;
  char buff[stringLength];
  data.toCharArray(buff, stringLength);
  _pubSubClient.publish("KiWaveSonarData",buff);
}

