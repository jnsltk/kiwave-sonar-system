#include "Arduino.h"
#include "KiwiMQTT.h"
#include "KiwiSecrets.h"

KiwiMQTT wireless(ssid,secret);
bool handsShaken=false;

uint8_t SHK[3]={83,72,75}; //Send handshake
uint8_t RHK[3]={82,72,75}; //Request handshake
uint8_t CRK[3]={82,72,75}; //Received Confirm Request handshake
uint8_t CHK[3]={67,72,75}; //Sent Confirm handshake
uint8_t STP[3]={83,84,80}; //Stop
uint8_t STR[3]={83,84,82}; //Start
uint8_t SSR[3]={83,83,82}; //Set sector



void callback(char* topic, uint8_t* data, unsigned int msglen){
    uint8_t msgHeader[3];
    for(int i=0;i<3;i++){
      msgHeader[i]=(uint8_t) data[i];
      Serial.println(msgHeader[i]);
    }
    Serial.println("//////");
    if(memcmp(msgHeader,SHK,sizeof(msgHeader))==0){
        Serial.println("RCV: Sent Handshake");
        wireless.publish(CHK,3);
        Serial.println("SND: Sent Confirm Handshake");
    } else if (memcmp(msgHeader,RHK,sizeof(msgHeader))==0){
        Serial.println("RCV: Request Handshake");
        wireless.publish(SHK,3);
        Serial.println("SND: Sent Handshake");      
    } else if (memcmp(msgHeader,CRK,sizeof(msgHeader))==0){
        handsShaken=true;
        Serial.println("RCV: Confirmed Handshake");        
    } else if (memcmp(msgHeader,STP,sizeof(msgHeader))==0){
        Serial.println("RCV: Stop Sonar");        

        Serial.println("Stopping sonar");
    } else if(memcmp(msgHeader,STR,sizeof(msgHeader))==0){
        Serial.println("RCV: Start Sonar");        

        Serial.println("Starting sonar");
    } else if(memcmp(msgHeader,SSR,sizeof(msgHeader))==0){
        Serial.println("RCV: Go To Sector");  
        Serial.println("Sector Set");
    }


/*
    Serial.println(data[i]);
    int test=0;
    test=data[i]-'0';
    Serial.println(test);
*/

}

void setup(){
Serial.begin(9600);
wireless.init();
while(wireless.getWiFiStatus()!=WL_CONNECTED){
  Serial.println(".");
  delay(5000);
}
Serial.println("Wifi set.");
wireless.setServer("broker.hivemq.com", 1883);
Serial.println("Server set");
wireless.setCallback(callback);
Serial.println("Callback set");
}

void loop(){

  if(!wireless.getBrokerStatus()){
    Serial.println("Broker disconnected");
    delay(5000);
    wireless.connect();
    Serial.println("Connected");
  }
  wireless.sweep();

}