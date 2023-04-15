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
    int thermistorValue;
    //this is the Nominal B-Constant ranging from 4250 K to 4299 K and the middle
    //value which is 4275 is chosen. 
    int R0;
    //this is the value for the resistor used in the sesnor for the 
    //formula NTC = ((Vcc/V) - 1) * R0 which is 100000.

    //Note that these variables will be inisialised in the cpp file
    //where the constructor is defined
};

#endif