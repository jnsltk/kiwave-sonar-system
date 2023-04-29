/*
*/

#include "Arduino.h"
#include "KiwiServo.h"

KiwiServo::KiwiServo(int sigPin) {
    _sigPin = sigPin;
    pinMode(_sigPin, OUTPUT); //We need to transmit signals.
    setDelay(25); 
}

int KiwiServo::convertAngleToPulse(float angle) {
    float angleInSeconds=2000/180; //Scaling seconds in relation to the angle
    float minDelay=500;  //Minimum delay (corresponds to degree 0)
    float convertedAngle = angle*(150.0/180.0); //Scaling the received angle to a max value of 150
    //Returning the number of seconds to delay.
    return(((angleInSeconds)*(convertedAngle))+minDelay); 
}

void KiwiServo::goTo(float angle) {
    //Transmit voltage to servo
        digitalWrite(_sigPin, HIGH);
    //Delaying by seconds required to move servo to a certain angle.
        delayMicroseconds(convertAngleToPulse(angle)); 
    //Stopping signal transmission to servo
    digitalWrite(_sigPin, LOW);
}



void KiwiServo::setDelay(int newDelay) { _delay = newDelay; }

int KiwiServo::getDelay() { return _delay; }