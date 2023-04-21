<script>
    // @ts-nocheck
    import mqtt_client from 'u8-mqtt'
    import {sonarStore,sonarCommands} from "../../data/stores.js";

    const BROKER="mqtt.jnsl.tk";
    const BROKER_PORT="443";
    const REPORTING_TOPIC="KiWaveSonarData";
    const COMMANDING_TOPIC="KiWaveSonarCommand";
    const STOP_COMMAND="STP";
    const START_COMMAND="STR";
    const SET_SECTOR_COMMAND="SSR";
    const SET_RANGE_COMMAND="SRR";
    let storeCopy={};
    let mqttClient;
    let mqttConnected=false;
       async function mqttSend(topic,msg){
        if(!mqttConnected) console.log("Ignoring send request due to no connection to broker.");
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
      .with_websock('wss://'+server+':'+port+"/mqtt")
      .with_autoreconnect()
      await mqttClient.connect().then(async function(){
        mqttConnected=true; //On successful connection, allow sending and subscribing to topics.
      })

    }

     async function startListener(callback){
      //Initializing mqtt and connecting to broker.
        await initMqtt(BROKER,BROKER_PORT);
      //Subscribe to topic and add callback
      await mqttSubscribe(REPORTING_TOPIC,callback);
    }

    //Callback function of mqtt connection. Runs every time we get a new message.
    async function mqttCallback(data){
      //Decoding bytes to string.
        const parsedData = new TextDecoder().decode(data.payload);
      //Splitting by predetermined splitter.
        const parsedArray=parsedData.split("/");
      //The servo rotates CCW which is why we need to invert the received degrees.
        parsedArray[3]=360-parseInt(parsedArray[3]);
      //Updating the store with the new data.
        $sonarStore.sonarData.rRange1=parseInt(parsedArray[1]);
        $sonarStore.sonarData.rRange2=parseInt(parsedArray[2]);
        $sonarStore.sonarData.rDeg1=parseInt(parsedArray[3]);
      //Subtracting 180 from this, since this sensor is positioned opposite of previous sensor.
        $sonarStore.sonarData.rDeg2=parseInt(parsedArray[3])-180;
      //For logging purposes
        console.log($sonarStore.sonarData)
    }

    async function copyStore(){
      for(let key in $sonarCommands.sonarData){
        storeCopy[key]=$sonarCommands.sonarData[key];
      }
      startListener(mqttCallback)

    }

    //Copies store and instantiates MQTT instance and subscribes to topic
      copyStore()
      //Setting degrees and ranges if any of the store variables change.
        $: if(storeCopy.sDeg1!=$sonarCommands.sonarData.sDeg1){
          console.log("Sending degrees!")
          mqttSend("KiWaveSonarCommand","SSR"+($sonarCommands.sonarData.sDeg1)+($sonarCommands.sonarData.sDeg2));
          storeCopy.sDeg1=$sonarCommands.sonarData.sDeg1
        }
        $: if(storeCopy.sDeg2!=$sonarCommands.sonarData.sDeg2){
          console.log("Sending degrees!")
          mqttSend("KiWaveSonarCommand","SSR"+($sonarCommands.sonarData.sDeg1)+($sonarCommands.sonarData.sDeg2));
          storeCopy.sDeg2=$sonarCommands.sonarData.sDeg2
        }
        $: if(storeCopy.sRange!=$sonarCommands.sonarData.sRange){
          console.log("Sending range!")

          if($sonarCommands.sonarData.sRange.length!=3) throw Error("sRange invalid format! Expected: XXX length: 3 Received: "+$sonarStore.sonarData.sRange);
          mqttSend("KiWaveSonarCommand","SRR"+($sonarCommands.sonarData.sRange)+($sonarCommands.sonarData.sRange));
          console.log(("KiWaveSonarCommand","SRR"+($sonarCommands.sonarData.sRange)+($sonarCommands.sonarData.sRange)))
          storeCopy.sRange=$sonarCommands.sonarData.sRange
        }     

    
      
      //Command to start and stop the sonar over MQTT
      $: if(storeCopy.runSonar!=$sonarCommands.sonarData.runSonar){
        if($sonarCommands.sonarData.runSonar){
          console.log("Starting!");
          mqttSend("KiWaveSonarCommand","STR");
        } else {
          console.log("Stopping!!");
          mqttSend("KiWaveSonarCommand","STP");
        }
        storeCopy.runSonar=$sonarCommands.sonarData.runSonar
      }
    

    

    </script>
    

      <!--
    <button on:click={()=>stopsonar()}>stop</button>
    <button on:click={()=>startsonar()}>start</button>
    <p>maxrange</p>
  <input bind:value={maxRange} type="text" placeholder="maxrange">
    <p>startdeg</p>
    
  <input bind:value={startDeg} type="text" placeholder="startdeg">
    <p>enddeg</p>
    
  <input bind:value={endDeg} type="text" placeholder="enddegree"><br>
    <button on:click={()=>setrange()}>setrange</button>
    <button on:click={()=>setdeg()}>setdegree</button>-->
    

    