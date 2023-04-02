#include <math.h>

float processedTemp;
float notProcessedTemp;
float temp;
const int thermistorValue = 4275;
//this is a constant ranging from 4250 to 4299 and the middle
//value which is 4275 is chosen
const int R0 = 100000;
//this is the value for the resistor used in the sesnor for the 
//formula NTC = ((Vcc/V) - 1) * R0
const int tempSensorPin = A0;
//the pin could be changed to another analog pin later


void setup() {
  Serial.begin(9600);
}

void loop() {
  temp = measureTemp();
  Serial.print("temperature = ");
  Serial.println(temp);
}

float measureTemp() {
  notProcessedTemp = analogRead(tempSensorPin);
  notProcessedTemp = (1023.0/notProcessedTemp - 1.0) * R0;
  processedTemp = 1.0/(log(notProcessedTemp/R0)/thermistorValue+1/298.15)-273.15;
  //This formula processes the date and gives the temperature in
  //celsius degrees
  //source: https://wiki.seeedstudio.com/Grove-Temperature_Sensor_V1.2/#play-with-arduino
  return processedTemp;
}


