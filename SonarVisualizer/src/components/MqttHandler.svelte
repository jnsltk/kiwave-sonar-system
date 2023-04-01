<script context="module">
import * as mqtt from "mqtt"  // import everything inside the mqtt module and give it the namespace "mqtt"
import { Buffer } from "buffer";

export async function connectMqtt(){
    let client = mqtt.connect('mqtt://test.mosquitto.org') // create a client


}


</script>