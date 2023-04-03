
<script context="module">
import mqtt_client from 'u8-mqtt/esm/web/index.js' // or v4.js or v5.js

export async function initMqtt(){
    let my_mqtt = mqtt_client()
  .with_websock('wss://test.mosquitto.org:8081')
  .with_autoreconnect()

await my_mqtt.connect()

my_mqtt.subscribe_topic(
  'u8-mqtt/demo-simple/:topic',
  (pkt, params, ctx) => {
    console.log('topic packet', params, pkt, pkt.json())
  })

await my_mqtt.json_send(
  'u8-mqtt/demo-simple/live',
  { note: 'from Web bundled example',
    live: new Date().toISOString() })
}
</script>
