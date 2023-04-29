#include "Arduino.h"
#include "KiwiMQTT.h"
#include "KiwiSecrets.h"
#include "KiwiSonic.h"
#include "KiwiTemp.h"
#include "KiwiServo.h"
#include "math.h"


//Instantiating two objects of ultrasonic sensors and passing in there max range.
  KiwiSonic ultrasonicSensor1(D7,350);
  KiwiSonic ultrasonicSensor2(D8,350);
//Instantiating temperature sensor, servo motor and MQTT objects.
  KiwiTemp tempSensor(A0);
  KiwiServo servo(D2);
  KiwiMQTT wireless(ssid,secret);
//Boolean flag to stop and start sonar.
  bool servoRun=false; 
//Used to store current temperature
  float temperature=0;
//Two variables used for setting up to what range to report distances.
  int maxRange1=999;
  int maxRange2=999;
//Start and end degrees
  int from=0; 
  int to=180;

//Stop command
  uint8_t STP[3]={83,84,80}; 
//Start command
  uint8_t STR[3]={83,84,82};
//Set sector command 
  uint8_t SSR[3]={83,83,82};
//Set range command 
  uint8_t SRR[3]={83,82,82}; 


void callback(char* topic, uint8_t* data, unsigned int msglen){
  //We know that the msg header is the first three bytes.
    uint8_t msgHeader[3];
  //We loop through the first three bytes of the message and copy it to the messageHeader holder variable.
    for(int i=0;i<3;i++){
      msgHeader[i]=(uint8_t) data[i];
    }
  //We check if any of the message headers are registered as commands in the system
    if (memcmp(msgHeader,STP,sizeof(msgHeader))==0){
          Serial.println("RCV: Stop Sonar");        
          //Stop signal, hence we are stopping the sonar by toggling the flag.
            servoRun=false;
          Serial.println("Stopping sonar");
      } else if(memcmp(msgHeader,STR,sizeof(msgHeader))==0){
          Serial.println("RCV: Start Sonar");        
          //Start signal, hence we are stopping the sonar by toggling the flag.
            servoRun=true;
          Serial.println("Starting sonar");
      } else if(memcmp(msgHeader,SSR,sizeof(msgHeader))==0){
          Serial.println("RCV: Go To Sector"); 
          //charFrom is the next 3 bytes after msgHeader and charTo is the last 3 bytes.
            char charFrom[3];
            char charTo[3]; 

          //We loop through the message and copy the 3 bytes that come after the message header
            int c=0;
            for(int i=3;i<6;i++){
              charFrom[c]=(char) (data[i]);
              c++;
            }
          //We loop through and copy the 3 bytes after the previous 3 bytes.
            c=0;
            for(int i=6;i<9;i++){
              charTo[c]=(char) (data[i]);
              c++;
            }
          //We can now convert the received bytes into integers to change at what sector, the sonar should measure.
            String strFrom=String(charFrom);
            String strTo=String(charTo);
            from= (strFrom).toInt();
            to=(strTo).toInt();
            Serial.println("Sector Set");
      }else if(memcmp(msgHeader,SRR,sizeof(msgHeader))==0){
        //charFrom is the next 3 bytes after msgHeader and charTo is the last 3 bytes.
          Serial.println("RCV: Set Range"); 
          char charFrom[3];
          char charTo[3]; 
        //We loop through the message and copy the 3 bytes that come after the message header
          int c=0;
          for(int i=3;i<6;i++){
            charFrom[c]=(char) (data[i]);
            c++;
          }
        //We loop through and copy the 3 bytes after the previous 3 bytes.
          c=0;
          for(int i=6;i<9;i++){
            charTo[c]=(char) (data[i]);
            c++;
          }
        //We convert the bytes into integers which are then used to report ranges below this range.
          String strFrom=String(charFrom);
          String strTo=String(charTo);
          maxRange1= (strFrom).toInt();
          maxRange2=(strTo).toInt();
          Serial.println("Range Set");
      }
}

void setup(){
  //Starting serial at 115200 baud
    Serial.begin(115200);
  //Delaying for 5 seconds so that some older systems have time to register the initial messages.
    delay(5000);
  Serial.println("Measuring temperature");
  temperature=tempSensor.measureTemp();
  Serial.println(temperature);
  //Connecting to WiFi
    wireless.init();
  //Awaiting a successful WiFi connection
    while(wireless.getWiFiStatus()!=WL_CONNECTED){
      Serial.println(".");
      delay(1000);
    }
  Serial.println("Wifi set.");
  wireless.setServer("mqtt-http.jnsl.tk", 1883);
  Serial.println("Server set");
  wireless.setCallback(callback);
  Serial.println("Callback set");
}

void record(int degree){
  //Letting the 1st sensor to perform its measurement
    int measure1=ultrasonicSensor1.calculateDistance(temperature);
  //In smaller rooms, the previous sensor's sound waves will cause interference, hence we need to wait for them to dissipate
  delay(250);
  //2nd sensor performs measurement
    int measure2=ultrasonicSensor2.calculateDistance(temperature);
  //We perform a check if the measurements comply to the maxRange, if not we return -1
    int reportedMeasurement1=measure1<maxRange1?measure1:-1;
    int reportedMeasurement2=measure2<maxRange2?measure2:-1;
  //We concatenate all data in a format understandable by the front-end
    String measureData=String("M/")+ reportedMeasurement1+String("/")+ reportedMeasurement2+String("/")+degree;
  //Publish the data to the broker
    wireless.publish(measureData);
}

void affirm(){
  //This function is used to affirm the developer that the sonar is connected to the broker, using visual response.
  servo.goTo(0);
  delay(2000);
  servo.goTo(180);
}

void spin(){
  //If the sonar is allowed, it will spin 15 degrees at a time from: from to: to.
  if(servoRun){
    for(int i=from;i<to;i+=15){
      servo.goTo(i);
      record(i);
      delay(100);
    }
    for(int i=to;i>from;i-=15){
      servo.goTo(i);
      record(i);
      delay(100);
    }
  }
}

void loop(){
  if(!wireless.getBrokerStatus()){
    Serial.println("Broker disconnected");
    delay(1000);
    wireless.connect();
    Serial.println("Connected");
    //Calling the affirm method to show to whoever, that the sonar is connected.
      affirm();
  } else {
  //Look for new messages
    wireless.sweep();
  //Spin the sonar and record measurements
    spin();
    }
}