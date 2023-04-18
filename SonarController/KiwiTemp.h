#ifndef KiwiTemp_h
#define KiwiTemp_h
#include "Arduino.h"
#include "math.h"

class KiwiTemp {
    public: 
    KiwiTemp(int sigPin);
    float measureTemp();
    int getThermistorValue();
    int getR0();
    private:
    int _sigPin;
    int thermistorValue;
    int R0;
};

#endif