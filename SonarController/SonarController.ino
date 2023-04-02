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

int timeToDistance(int time, int speedInMetersPerSecond){

}

#include "KiwiSonic.h"

//Instantiating KiwiSonic sensor object. args: signalPin, delayToUse. Leave as is for now. Will be auto-calculated once the implementation for temperature sensor is there.
KiwiSonic sensor(1,100);

void setup()
{
  Serial.begin(9600);

}

void loop()
{
	Serial.println(sensor.ping());
}