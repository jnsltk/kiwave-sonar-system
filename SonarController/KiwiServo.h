#ifndef KiwiServo_h
#define KiwiServo_h
#include "Arduino.h"

class KiwiServo {
    public:
    KiwiServo(int sigPin);
    void goTo(float angle);
    void spin();
    void setDelay(int newDelay);
    int getDelay();
    int convertAngelToPulse(float angle);
    private:
    int _delay;
    int _sigPin; //sigPin stands for the signal pin
};

#endif
