/**
This exampel code uses the Ultrasonic library to measure the distance of obstacles
in front of the Ultrasonic sensor. To download library, go to the Resources
directory. then go to Seeed_Arduino_UltrasonicRanger-master directory. On the top 
left click on the download icon and download THIS directory as a zip file.
Then open up your Arduino IDE. Click on Sketch on the navigation bar. go to 
Include Library and then click on Add .Zip Library. Then choose the library that 
you downloaded and wait for it to install. Then you can use the methods of the 
Ultrasonic library. To see the methods of the libraray, tou can open up the 
Ultrasonic.cpp file that is included in the library using VSCode.
***********
This code example below is from https://wiki.seeedstudio.com/Grove-Ultrasonic_Ranger/#play-with-arduino
The code below is supposed to work and hsow the distance of objects in centimeters and 
milimiters detected by the Ultrasonic sensor.
**/

#include "Ultrasonic.h"
   long duration, inches, cm;
   pinMode(pingPin, OUTPUT);
   digitalWrite(pingPin, LOW);
   delayMicroseconds(2);
   digitalWrite(pingPin, HIGH);
   delayMicroseconds(10);
   digitalWrite(pingPin, LOW);
   pinMode(echoPin, INPUT);
   duration = pulseIn(echoPin, HIGH);
   inches = microsecondsToInches(duration);
   cm = microsecondsToCentimeters(duration);
   Serial.print(inches);
   Serial.print("in, ");
   Serial.print(cm);
   Serial.print("cm");
   Serial.println();
   delay(100);



Ultrasonic ultrasonic(13); //this can be changed later (ohter digital pins can be used)
long RangeInInches;
long RangeInCentimeters;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("The distance to obstacles in front is: ");
  RangeInInches = ultrasonic.MeasureInInches();
  Serial.print(RangeInInches);//0~157 inches
  Serial.println(" inch");
  delay(250);

  RangeInCentimeters = ultrasonic.MeasureInCentimeters(); // two measurements should keep an interval
  Serial.print(RangeInCentimeters);//0~400cm
  Serial.println(" cm");
  delay(250);
}



