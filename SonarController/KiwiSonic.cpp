#include "Arduino.h"
#include "KiwiSonic.h"

KiwiSonic::KiwiSonic(int sigPin,long maxDistance) {
  //Setting private variables to passed arguments.
  _sigPin = sigPin;
  _maxDistance = maxDistance;
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
  delayMicroseconds(2);
  digitalWrite(_sigPin, HIGH);  //Transmitting waves
  delayMicroseconds(5);        //Delay so that enough waves are transmitted.
  digitalWrite(_sigPin, LOW);   //Stop transmitting
  pinMode(_sigPin, INPUT);      //Set signal pin to "receive mode"
  return pulseIn(_sigPin, HIGH); //Await echo. Returns time duration that it took to receive echo.
}





/*
The ultrasonic's sesnor range is from 1 to 538 cm (in room temperature which is 23 degrees).
This was found out using experimentation.

The following method calculates the distance in centimeters.

Temperature of environment affects the speed of sound. For example, sound's speed is
331.4 m/s at 0 degrees celsius and 343 m/s at 20 degrees celsius. The time given by ping()
is in microseconds. The disatnce can be calculated from the formula:

distance = speed * time

However, the formula below is more complicated as it considers temprature as well.
The formula for speed in different temperatures is as follows:

Speed = 331.4 + 0.6 * temperature (in degrees celsius) with 331.4 being the speed of sound
at 0 degrees celsius. 

The two mentioned formulae above are combined and they give off 
the following formula used in the method below. 

The units of the different paramters should be compatible. The disnatce is wanted in cm, 
hence the speed should be multiplied by 100 to be cm/s. However, ping() gives time in microseconds. 
Hence, the speed needs to be divided by 1000000. 
That is where 10000 come from as (speed/1000000) * 1000 is speed/10000.

In the end we divide the result by 2 due to the fact that the time given is the time that 
it takes for the wave to travel to and back from the object. If we do not divid by 2 in the
end, we get double the distance between the object and the Ultrasonic sensor.
*/
long KiwiSonic::calculateDistance(float temperature) {
  long distance=((ping() * (331.4 + (0.6 * temperature))) / 10000) / 2;
  return distance>_maxDistance?-1:distance;
}

