import mqtt_client from 'u8-mqtt'
let mqttClient;
let mqttConnected=false;
  export async function mqttSend(topic,msg){
    if(!mqttConnected) throw Error("MQTT Client Not Connected!");
    await mqttClient.send(
    topic,
    msg)
  }

  async function mqttSubscribe(topic,callback){
    if(!mqttConnected) throw Error("MQTT Client Not Connected!");
    if (!(callback instanceof Function)) throw Error("Invalid callback function!");
    mqttClient.subscribe_topic(
    topic,
    (pkt, params, ctx) => {
      callback(pkt, pkt)
    })
  }

 async function initMqtt(server,port){
    mqttClient = mqtt_client()
  .with_websock('ws://'+server+':'+port+"/mqtt")
  .with_autoreconnect()
  await mqttClient.connect().then(async function(){
    mqttConnected=true; //On successful connection, allow sending and subscribing to topics.
  })

}


export async function startListener(callback){
  //Initializing mqtt and connecting to broker.
    await initMqtt("broker.hivemq.com","8000");
  //Subscribe to topic and add callback
  await mqttSubscribe("KiWaveSonarData",callback);
}

