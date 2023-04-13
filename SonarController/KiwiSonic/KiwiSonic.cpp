#include "Arduino.h"
#include "kiwiSonic.h"

KiwiSonic::KiwiSonic(int sigPin, int maxDelay) {
  _sigPin = sigPin;
  _maxDelay = maxDelay;
}

//this method gives the duration of time taken to detect an object
int KiwiSonic::ping() {
  pinMode(_sigPin, OUTPUT);  //first we need the signal pin as OUTPUT to tell the Ultrasonic
  //sesnor to transmit ultrasonic waves.
  digitalWrite(_sigPin, HIGH);  //by seeting the signal pin high we transmit waves
  delay(_maxDelay);             //we transmit waves as lon as _maxDelay
  digitalWrite(_sigPin, LOW);   //we stop transmitting waves
  pinMode(_sigPin, INPUT);      //now we need to recieve the waves and give the time it took for
  //for them to go and come back. Since we will get an input, namely duration of the time
  //it took for the waves to detect an object and come back, we set the signal pin to
  //INPUT
  return pulseIn(_sigPin, HIGH, _maxDelay * 1000L);  //_maxDelay * 1000L gives a time which
  //is the longest time the ultrasonic awaits the trasmitted waves. It is put 1000 times longer
  //than the time allocated for transmitting waves which is _maxdelay. (there is no reason for this)
  //we could have as well chosen 100 instead of 1000
}

int KiwiSonic::getDelay() {
  return _maxDelay;
}

void KiwiSonic::setDelay(int newDelay) {
  _maxDelay = newDelay;
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
  return ((ping() * (331.4 + (0.6 * temperature))) / 10000) / 2;
}
