#ifndef KiwiSonic_h
#define KiwiSonic_h
#include "Arduino.h"
class KiwiSonic {
    public:
        KiwiSonic(int sigPin,int maxDelay);
        int ping();
        void setDelay(int newDelay);
        int getDelay();
        long calculateDistance(float temperature);
    private:
        int _sigPin; //sigPin stands for the signal pin
        int _maxDelay;
};

#endif

