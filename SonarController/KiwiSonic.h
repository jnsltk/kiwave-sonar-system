#ifndef KiwiSonic_h
#define KiwiSonic_h
#include "Arduino.h"
class KiwiSonic {
    public:
        KiwiSonic(int sigPin,long maxDistance);
        int ping();
        long calculateDistance(float temperature);
    private:
        int _sigPin; //sigPin stands for the signal pin
        int _maxDistance;
};

#endif

