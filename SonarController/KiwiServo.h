#ifndef KiwiServo_h
#define KiwiServo_h
#include "Arduino.h"
class KiwiServo {
    public:
    KiwiServo(int sigPin);
    void goTo(float angle);
    int convertAngleToPulse(float angle);
    private:
    int _sigPin; 
};

#endif
