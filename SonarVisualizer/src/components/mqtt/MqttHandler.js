
import mqtt_client from 'u8-mqtt/esm/web/index.js'
const MQTT_SERVER='wss://test.mosquitto.org:8081' // Example MQTT websocket server
let mqttClient;
let mqttConnected=false;
export async function mqttSend(topic,msg){
  if(!mqttConnected) throw Error("MQTT Client Not Connected!");
  await mqttClient.json_send(
  topic,
  { note: msg,
    live: new Date().toISOString() })
  
}

export async function mqttSubscribe(topic,callback){
  if(!mqttConnected) throw Error("MQTT Client Not Connected!");
  if (!(callback instanceof Function)) throw Error("Invalid callback function!");
  mqttClient.subscribe_topic(
  topic,
  (pkt, params, ctx) => {
    callback(pkt, pkt.json())
  })
}



export async function initMqtt(server){
    mqttClient = mqtt_client()
  .with_websock('wss://test.mosquitto.org:8081')
  .with_autoreconnect()

await mqttClient.connect().then(async function(){
  mqttConnected=true; //On successful connection, allow sending and subscribing to topics.
})

}

