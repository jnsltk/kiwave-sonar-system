#include "Arduino.h"
#include "KiwiSonic.h"
KiwiSonic::KiwiSonic(int sigPin,long maxDistance) {
  //Setting private variables to passed arguments.
  _sigPin = sigPin;
  _maxDistance = maxDistance;
}
static void safeDelayMicro(int us){
  long timeRunning=millis()*1000;
   while(((millis()*1000)-timeRunning)<us){
    //Perform non-blocking delay.
   }
}


//Returns the time duration of transmitting waves and receiving an echo.
int KiwiSonic::ping() {
  /*
  * For simplicity, certain variables are used as per the tutorial at:
  * https://wiki.seeedstudio.com/Grove-Ultrasonic_Ranger/
  * The reason why the entire library is not used is because we do not require its whole functionality, rather the only
  * pieces of code that have been used is the number of microseconds to delay between method calls.
  */
  
  pinMode(_sigPin, OUTPUT); //Set signal pin to "transmit mode".
  digitalWrite(_sigPin, LOW); //Ensuring that we stop all outgoing signals. 
  safeDelayMicro(4);
  digitalWrite(_sigPin, HIGH);  //Transmitting waves
  safeDelayMicro(10);        //Delay so that enough waves are transmitted.
  digitalWrite(_sigPin, LOW);   //Stop transmitting
  pinMode(_sigPin, INPUT);      //Set signal pin to "receive mode"
  return pulseIn(_sigPin, HIGH); //Await echo. Returns time duration that it took to receive echo.
}





/*
*
* A simplified formula for calculating the speed of sound in air:
* http://hyperphysics.phy-astr.gsu.edu/hbase/Sound/souspe3.html#c1
* 
* Speed = 331.4 + 0.6 * temp (celsius)
* Calculation of distance and then converting to centimeters.
* Dividing by 2 to get the distance from ultrasonic sensor and the object, since the time is measured from when tranmission started.
* The distance is wanted in cm, hence the speed should be multiplied by 100 to get cm/s. However, ping() gives time in microseconds. 
* Therefore we also need to divide speed by 1000000. 
* 
*/
long KiwiSonic::calculateDistance(float temperature) {
  long distance=((ping() * (331.4 + (0.6 * temperature))) / 10000) / 2;
  return distance>_maxDistance?-1:distance;
}

