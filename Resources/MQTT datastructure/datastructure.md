# MQTT Data structure

This file describes the string representation of the data structure that is used to send data from the Wio Terminal to the SonarVisualizer app using the MQTT protocol. 

The Wio terminal sends a number representing the degree that it's currently looking at and measuring, and the corresponding distance value. This data is represented in a json object.

Here's an example of the data format:

```json
{
    "deg": "125",
    "dist": "24.56"
}
```

The data is sent as a string on the MQTT protocol, which then can be parsed into a JavaScript object by the SonarVisualizer.