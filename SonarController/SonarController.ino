#include "Arduino.h"
#include "KiwiMQTT.h"
#include "KiwiSecrets.h"
#include "KiwiSonic.h"
#include "KiwiTemp.h"
#include "KiwiServo.h"
#include "math.h"


KiwiSonic ultrasonicSensor1(D7,350);
KiwiSonic ultrasonicSensor2(D8,350);
KiwiTemp tempSensor(A0);
KiwiServo servo(D2);
KiwiMQTT wireless(ssid,secret);
bool servoRun=false;
bool result=false;
float temperature=0;
int maxRange1=999;
int maxRange2=999;
long lastUpdateTime=0;
const long updateInterval=5000;
int from=0;
int to=180;
void safeDelay(int ms){
  long timeRunning=millis();
   while((millis()-timeRunning)<ms){
    //Perform non-blocking delay.
   }
}

uint8_t STP[3]={83,84,80}; //Stop
uint8_t STR[3]={83,84,82}; //Start
uint8_t SSR[3]={83,83,82}; //Set sector
uint8_t SRR[3]={83,82,82}; //Set range


void callback(char* topic, uint8_t* data, unsigned int msglen){
  //We know that the msg header is the first three bytes.
  //We loop through the first three bytes of the message and copy it to the messageHeader holder variable.
    uint8_t msgHeader[3]; //Message header has length 3.
    for(int i=0;i<3;i++){
      msgHeader[i]=(uint8_t) data[i]; //Retrieving the message header of the command.
    }
     /*
     * We use the method call: memcmp() to compare if the receive message header
     * matches any of the defined commands.
     **/
  if (memcmp(msgHeader,STP,sizeof(msgHeader))==0){
        Serial.println("RCV: Stop Sonar");        
        servoRun=false;
        Serial.println("Stopping sonar");
    } else if(memcmp(msgHeader,STR,sizeof(msgHeader))==0){
        Serial.println("RCV: Start Sonar");        
        servoRun=true;
        Serial.println("Starting sonar");
    } else if(memcmp(msgHeader,SSR,sizeof(msgHeader))==0){
        Serial.println("RCV: Go To Sector"); 
        
        char charFrom[3];
        char charTo[3]; 

        int c=0;
        for(int i=3;i<6;i++){
          charFrom[c]=(char) (data[i]);
          c++;
        }
        c=0;
        for(int i=6;i<9;i++){
          charTo[c]=(char) (data[i]);
          c++;
        }
        Serial.println("Sector Set");

        String strFrom=String(charFrom);
        String strTo=String(charTo);
        from= (strFrom).toInt();
        to=(strTo).toInt();
        Serial.println(from);
        Serial.println(to);
    }else if(memcmp(msgHeader,SRR,sizeof(msgHeader))==0){
        Serial.println("RCV: Set Range"); 
        char charFrom[3];
        char charTo[3]; 

        int c=0;
        for(int i=3;i<6;i++){
          charFrom[c]=(char) (data[i]);
          c++;
        }
        c=0;
        for(int i=6;i<9;i++){
          charTo[c]=(char) (data[i]);
          c++;
        }
        Serial.println("Range Set");

        String strFrom=String(charFrom);
        String strTo=String(charTo);
        maxRange1= (strFrom).toInt();
        maxRange2=(strTo).toInt();
        
    }

}

void setup(){
  //Delaying for 5 seconds so that some older systems have time to register the initial messages.
  //Connecting to WiFi
  //Awaiting a successful WiFi connection
Serial.begin(115200);
Serial.println("Measuring temperature");
temperature=tempSensor.measureTemp();

Serial.println(temperature);
  wireless.init();

while(wireless.getWiFiStatus()!=WL_CONNECTED){

  Serial.println(".");
  safeDelay(1000);
}
Serial.println("Wifi set.");
wireless.setServer("mqtt-http.jnsl.tk", 1883);
Serial.println("Server set");
wireless.setCallback(callback);
Serial.println("Callback set");
}

void record(int degree){
  int measure1=ultrasonicSensor1.calculateDistance(temperature);
  safeDelay(250);
  int measure2=ultrasonicSensor2.calculateDistance(temperature);
  int reportedMeasurement1=measure1<maxRange1?measure1:-1;
  int reportedMeasurement2=measure2<maxRange2?measure2:-1;

  String measureData=String("M/")+ reportedMeasurement1+String("/")+ reportedMeasurement2+String("/")+degree;

  wireless.publish(measureData);

}

void spin(){
  if(servoRun){
  for(int i=from;i<to;i+=15){
    servo.goTo(i);
    record(i);
    safeDelay(100);
  }
  for(int i=to;i>from;i-=15){
    servo.goTo(i);
    record(i);
    safeDelay(100);
  }
  }
}


void loop(){
  if(!wireless.getBrokerStatus()){
    Serial.println("Broker disconnected");
    wireless.connect();
    Serial.println("Connected");
  } else {
    long currentTime=millis(); //Retrieving the number ms the Wio terminal has been alive.
    if((currentTime-lastUpdateTime)>=updateInterval){
      /*
      * This part can get stuck, this is why have enabled logging, for debugging purposes in case
      * the sonar gets stuck. 
      **/
      Serial.println("Sweep");
      lastUpdateTime=currentTime; //Updating the variable that keeps track how often we fetch new messages.
      result=wireless.sweep(); //Fetching new messages from MQTT broker.
      Serial.println(result);
      if(result==1){
          spin(); //Perform rotation in accorance to the specified sector.
      }
    }
  }
}