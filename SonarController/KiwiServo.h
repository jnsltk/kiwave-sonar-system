#ifndef KiwiServo_h
#define KiwiServo_h
#include "Arduino.h"

class KiwiServo {
    public:
    KiwiServo(int sigPin);
    void goTo(float angle);
    void setDelay(int newDelay);
    int getDelay();
    int convertAngleToPulse(float angle);
    private:
    int _delay;
    int _sigPin; 
};

#endif
