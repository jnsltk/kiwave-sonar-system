<script>
    // @ts-nocheck
    import mqtt_client from '../../mqtt' // or v4.min.js or v5.min.js    import {sonarStore,sonarCommands} from "../../data/stores.js";
    import {sonarStore,sonarCommands} from "../../data/stores.js";

    const BROKER="mqtt.jnsl.tk";
    const BROKER_PORT="443";
    const REPORTING_TOPIC="KiWaveSonarData";
    const RECEIVED_CONFIRMATION="RCVD";
    const CONNECTED_CONFIRMATION="CNCTD"
    const MEASUREMENT_ANGLE=15;
    let measurementsQueue=[];
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

    async function interpretPotentialConfirmation(data){
      if(data.includes(RECEIVED_CONFIRMATION)){
        $sonarStore.sonarStatus.lastCommandReceived=true;
        console.log("Last command was received by sonar.");
        return true;
      } else if (data.includes(CONNECTED_CONFIRMATION)){
        $sonarStore.sonarStatus.isOnline=true;
        console.log("Sonar is online.");
        return true;
      }
      return false;
    }
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    let busy=false;
    let previousDeg=0;
    async function shiftAndDrawEntry(){
      if(busy) return;
      busy=true;
      let entry=measurementsQueue.shift();
      if(entry==undefined){
        busy=false;

        return;
      }
        if(previousDeg<entry.rDeg1){
        for(let i=15;i>0;i--){
          $sonarStore.sonarData.rRange1=entry.rRange1;
          $sonarStore.sonarData.rRange2=entry.rRange2;
          $sonarStore.sonarData.rDeg1=entry.rDeg1-i;
        //Subtracting 180 from this, since this sensor is positioned opposite of previous sensor.
          $sonarStore.sonarData.rDeg2=entry.rDeg2-i;
          await sleep(10);
        }
      } else {
        for(let i=15;i>0;i--){
          $sonarStore.sonarData.rRange1=entry.rRange1;
          $sonarStore.sonarData.rRange2=entry.rRange2;
          $sonarStore.sonarData.rDeg1=entry.rDeg1+i;
        //Subtracting 180 from this, since this sensor is positioned opposite of previous sensor.
          $sonarStore.sonarData.rDeg2=entry.rDeg2+i;
          await sleep(10);
        }
      }
      previousDeg=entry.rDeg1

        busy=false;
    }
    setInterval(async function(){
      await shiftAndDrawEntry()

    },500);

    //Callback function of mqtt connection. Runs every time we get a new message.
    async function mqttCallback(data){
      //Decoding bytes to string.
        const parsedData = new TextDecoder().decode(data.payload);
        console.log(parsedData)
        if(await interpretPotentialConfirmation(parsedData)) return;
      //Splitting by predetermined splitter.
      const parsedArray=parsedData.split("/");
         
        for(let i=1;i<parsedArray.length;i+=3){
          let queueEntry={
            "rRange1":parseInt(parsedArray[i]),
            "rRange2":parseInt(parsedArray[i+1]),
            "rDeg1":(360-parseInt(parsedArray[i+2])),
            "rDeg2":(360-parseInt(parsedArray[i+2]))-180
          }
          measurementsQueue.push(queueEntry);
        }

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
    

    