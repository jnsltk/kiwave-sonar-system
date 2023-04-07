#include "KiwiSonic.h"
#include "KiwiTemp.h"
#include "KiwiServo.h"
#include "math.h"
#include "Arduino.h"

/*
Pinout Instruction:
1- Temperature sensor: use the Multifunctional pinout under the joystick
2- First Ultrasonic sesnor: 
----GND connected to 25 (which is GND) on the Wio
----VCC connected to 1 (which is 3V3 (3.3 V)) on the Wio
----SIG connected to 36 (which is D7)non the Wio
3- Second Ultrasonic Sesnor: 
----GND connected to 30 (which is GND) on the Wio
----VCC connected to 17 (which is 3v3 (3.3 v)) on the Wio
----SIG connected to 37 (which is D8) on the Wio
4- Servo motor:
----GND connected to 6 (which is GND) on the Wio
----VCC connected to 2 (which is 5V) on the Wio
----SIG connected to 16 (which is D2) on the Wio
*/

float temp;
long distanceInCentimeters;
KiwiSonic ultrasonicSensor1(D7, 50);
KiwiSonic ultrasonicSensor2(D8, 50);
KiwiTemp tempSnsor(A0);
KiwiServo servo(D2);

void setup() {
    //This should be filled later
}

void loop() {
    //this should be filled later
}



