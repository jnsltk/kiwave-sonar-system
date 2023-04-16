#include "KiwiTemp.h"
#include "Arduino.h"
#include "math.h"

/*
Grove Temperature Sensor uses a thermistor to measure ambient temperature. The resistance of 
thermistor changes based on ambient temperature. This resistance value alters the output of a 
voltage divider which is measured by an analog input pin and converted to a temperature value. 
The operating range is -40 to 125°C, with an accuracy of 1.5°C.
*/

KiwiTemp::KiwiTemp(int sigPin) {
    _sigPin = sigPin;
    //This is the Nominal B-Constant ranging from 4250 to 4299. 
        thermistorValue = 4275;
    //Resistor resistance in Ohm. NTC = ((Vcc/V) - 1) * R0 which is 100000.
        R0 = 100000;
}

float KiwiTemp::measureTemp() {
    //The calculation originates from: https://wiki.seeedstudio.com/Grove-Temperature_Sensor_V1.2/#play-with-arduino
    float notProcessedTemp = ((1023.0/analogRead(_sigPin)) - 1.0) * R0;
    float processedTemp = 1.0 / (log(notProcessedTemp/R0) / thermistorValue + 1 / 298.15) - 273.15;
    //Returning celsius degrees
        return processedTemp;
}

//Returns raw value of thermistor
    int KiwiTemp::getThermistorValue() {
        return thermistorValue;
    }
//Returns resistance
    int KiwiTemp::getR0() {
        return R0;
    }

