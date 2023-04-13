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
    int _sigPin; //sigPin stands for the signal pin
    int _thermistorValue;
    //this is a constant ranging from 4250 to 4299 and the middle
    //value which is 4275 is chosen. 
    int _R0;
    //this is the value for the resistor used in the sesnor for the 
    //formula NTC = ((Vcc/V) - 1) * R0 which is 100000.

    //Note that these variables will be inisialised in the cpp file
    //where the constructor is defined
};

#endif