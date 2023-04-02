#ifndef KiwiSonic_h
#define KiwiSonic_h
#include "Arduino.h"
class KiwiSonic {
    public:
        KiwiSonic(int sigPin,int maxDelay);
        int ping();
        void setDelay(int newDelay);
        int getDelay();
        int getPin();
        void setPin(int newPin);
    private:
        int _sigPin;
        int _maxDelay;
};
#endif

