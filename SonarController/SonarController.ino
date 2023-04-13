#include "Arduino.h"
#include "KiwiMQTT.h"
#include "KiwiSecrets.h"
#include "KiwiSonic.h"
#include "KiwiTemp.h"
#include "KiwiServo.h"
#include "math.h"
#include "Arduino.h"

/*
Pinout Instruction:
1- Temperature sensor: use the Multifunctional pinout under the joystick
2- First Ultrasonic sesnor: 
----GND connected to 25 (which is GND) on the Wio
----VCC connected to 1 (which is 3V3 (3.3 V)) on the Wio
----SIG connected to 36 (which is D7)non the Wio
3- Second Ultrasonic Sesnor: 
----GND connected to 30 (which is GND) on the Wio
----VCC connected to 17 (which is 3v3 (3.3 v)) on the Wio
----SIG connected to 37 (which is D8) on the Wio
4- Servo motor:
----GND connected to 6 (which is GND) on the Wio
----VCC connected to 2 (which is 5V) on the Wio
----SIG connected to 16 (which is D2) on the Wio
*/

long distanceInCentimeters;
KiwiSonic ultrasonicSensor1(D7, 50);
KiwiSonic ultrasonicSensor2(D8, 50);
KiwiTemp tempSensor(A0);
KiwiServo servo(D2);


KiwiMQTT wireless(ssid,secret);
bool handsShaken=false;
bool servoRun=false;
float temperature=0;
int from=0;
int to=180;
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
    }


/*
    Serial.println(data[i]);
    int test=0;
    test=data[i]-'0';
    Serial.println(test);
*/

}

void setup(){
Serial.begin(115200);
delay(5000);
Serial.println("Measuring temperature");
temperature=tempSensor.measureTemp();

Serial.println(temperature);

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

void record(){
  int measure1=ultrasonicSensor1.calculateDistance(temperature);
  int measure2=ultrasonicSensor2.calculateDistance(temperature);


  String measureData=String("MSRMT/1/")+ measure1+String("/2/")+ measure2;
  Serial.println(measureData);
}

void spin(){
  if(servoRun){
  for(int i=from;i<to;i+=1){
    servo.goTo(i);
    record();
    delay(100);
  }
  for(int i=to;i>from;i-=1){
    servo.goTo(i);
    record();
      delay(100);
  }
  }
}

void loop(){
  if(!wireless.getBrokerStatus()){
    Serial.println("Broker disconnected");
    delay(5000);
    wireless.connect();
    Serial.println("Connected");
  }
  wireless.sweep();
  spin();
  
}