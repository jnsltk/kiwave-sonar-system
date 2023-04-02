#include "Arduino.h"
#include "kiwiSonic.h"
KiwiSonic::KiwiSonic(int sigPin,int maxDelay) {
	_sigPin = sigPin;
  _maxDelay = maxDelay;
}

int KiwiSonic::ping(){
    	pinMode(sigPin, OUTPUT);

    digitalWrite(_sigPin, HIGH);
    delay(_maxDelay);
    digitalWrite(_sigPin, LOW);
    pinMode(_sigPin, INPUT);
    return pulseIn(_sigPin, HIGH);;
}

int KiwiSonic::getPin(){
  return _sigPin;
}
int KiwiSonic::getDelay(){
  return _maxDelay;
}

void KiwiSonic::setDelay(int newDelay){
  _maxDelay=newDelay;
}

void KiwiSonic::setPin(int newPin){
  _sigPin=newPin;
}
