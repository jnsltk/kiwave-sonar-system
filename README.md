<img src= "https://camo.githubusercontent.com/121f5000155889c0642b8a6b2a33a7f5fbe5c32d9133dac405ac269da15fcf94/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f432532422532422d3030353939433f7374796c653d666f722d7468652d6261646765266c6f676f3d63253242253242266c6f676f436f6c6f723d7768697465">
<img src= "https://camo.githubusercontent.com/93c855ae825c1757f3426f05a05f4949d3b786c5b22d0edb53143a9e8f8499f6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4a6176615363726970742d3332333333303f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661736372697074266c6f676f436f6c6f723d463744463145">
<img src= "https://camo.githubusercontent.com/9318a538d66a59bae54556fa490931939f442d6df8d48c4c819c360d709282d7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f41726475696e6f5f4944452d3030393739443f7374796c653d666f722d7468652d6261646765266c6f676f3d61726475696e6f266c6f676f436f6c6f723d7768697465">
<img src= "https://camo.githubusercontent.com/06c6858186510906c21d8c951168d55d976d7dfb9176ed6125c55b8a7de0baae/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4749542d4534344333303f7374796c653d666f722d7468652d6261646765266c6f676f3d676974266c6f676f436f6c6f723d7768697465">
<img src= "https://camo.githubusercontent.com/657329738460f56c758a29135bc198b08943183f5030a71776c2ea6050f5358e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5376656c74652d3441344135353f7374796c653d666f722d7468652d6261646765266c6f676f3d7376656c7465266c6f676f436f6c6f723d464633453030">
<img src= "https://camo.githubusercontent.com/0fad77ddd85292b8800107c5a51df2f64ff5126a0fe6dfa1eb7d4977032918e2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4e6f64652532306a732d3333393933333f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f6465646f746a73266c6f676f436f6c6f723d7768697465">


# Contents Table
[[_TOC_]]

# Information

### Team Kiwi(Group 13) 
- Kaisa Arumeel
- Alexander Säfström
- Omid Khodaparast
- Amirpooya Asadollahnejad
- Milad Tamaddondar
- János Litkei
 
[Introductory video](https://www.youtube.com/watch?v=9HAqAKBQyas) for the project:

## Project Background/ Problem Description
The need for efficient, cost-effective, and non-invasive monitoring solutions has become increasingly important in various industries. The monitoring system offers a reliable and accessible solution to security and environmental concerns. The system can be used in home security, industrial safety, parking assistance, environmental monitoring, retail analytics, and traffic management. The project builds on existing technologies and offers a customizable and expandable monitoring solution for different applications.

## Utilization
Despite the fact that the system is mainly designed for "Home Security", it has multiple other potential applications.
- Industrial safety: The system can detect objects in areas with heavy machinery and prevent accidents.
- Parking assistance: The system can detect the presence of vehicles and assist drivers in parking.
- Environmental monitoring: The system can detect changes in the environment and provide valuable insights.
- Retail analytics: The system can track the movement of customers and provide valuable data for businesses
- Traffic management: The system can detect and monitor traffic flow and help manage congestion.


## Project Description
This project aims to implement a monitoring system for a designated area or sector. The system employs three sensors: two ultrasonic sensors, a temperature sensor, and an actuator in the form of a servo motor, all of which are connected to a Wio terminal, a microcontroller.

The core concept of the system involves mounting two ultrasonic sensors on top of a servo motor, which rotates the sensors to scan the designated area. These sensors transmit high-frequency sound waves and receive the corresponding echoes, thus detecting any objects that move within a specific radius of the sensors. The temperature sensor comes into play by measuring the temperature, which helps calculate the speed of sound in the air. This information, in turn, assists in determining the number of milliseconds to wait for the echo.

The servo motor is responsible for continuously monitoring its position in degrees, while the ultrasonic sensors communicate the degree and range data to the microcontroller, which then publishes this information over WiFi to the topic: KiWaveSonarData.

To provide a user-friendly interface, the front-end utilizes SvelteJS and other JavaScript libraries to subscribe to the topic KiWaveSonarData. Upon receiving new information, the front-end parses and displays it in the form of a radar image that showcases the range and degree of any detected object relative to the sensors.


## Used Technologies
- C++ 
- JAVA SCRIPT
- FIGMA
- ARDUINO
- WIO SEEED TERMINAL 
- SERVO MOTOR
- ULTRASONIC SENSOR
- TEMPERATURE SENSOR

## Documentation 
[Documents](https://git.chalmers.se/courses/dit113/2023/group-13/kiwi/-/wikis/Home)
## Installation
TO BE COMPLETED
## Testing
TO BE COMPLETED







