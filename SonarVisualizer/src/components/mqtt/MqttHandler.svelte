<script>
    // @ts-nocheck
    // We use a ported version of u8-mqtt that will work with vite compiler.
    import mqtt_client from '../../mqtt'
    import {sonarStore,sonarCommands} from "../../data/stores.js";

    const BROKER="mqtt.jnsl.tk";
    const BROKER_PORT="443";
    const REPORTING_TOPIC="KiWaveSonarData"; //Topic where the sonar sends its data
    const RECEIVED_CONFIRMATION="RCVD"; //A command for the sonar
    const CONNECTED_CONFIRMATION="CNCTD" //Another command for the sonar
    const MEASUREMENT_ANGLE=15; //The sonar measures thing effectively every 15 degrees.
    const TRACK_MODE="TRK"; //A notification sent by the sonar to tell the frontend that it is in track mode.
    const MAX_QUEUE_LENGTH=300; //Maximum length of the queue which stores the buffered data from the sonar.
    const MIN_INTERVAL=25; //The slowest time for the queue to be processed.
    const MAX_INTERVAL=75; //The fastest time of which the queue can be processed.
    const CONNECTION_TIMEOUT=10;
    let measurementsQueue=[];
    let storeCopy={};
    let mqttClient;
    let mqttConnected=false;
    let lastKeepAliveReceived;

    /**
     * Used to check if the sonar is still connected. We regard it as disconnected after 10 seconds has passed. 
     * @param topic
     * @param msg
     */
      setInterval(() => {
        let timePassed=parseInt(Date.now()/1000)-lastKeepAliveReceived;
        if(timePassed>CONNECTION_TIMEOUT){
          $sonarStore.sonarStatus.isOnline=false;
        }
      }, 500);

    

      /**
       * Used to send messages to the broker.
       * @param topic
       * @param msg
       */
      
       async function mqttSend(topic,msg){
        if(!mqttConnected) console.log("Ignoring send request due to no connection to broker.");
        await mqttClient.send(
        topic,
        msg)
      }

      /**
       * Wrapper function for subscribing to a topic.
       * @param topic
       * @param callback
       */
      async function mqttSubscribe(topic,callback){
        if(!mqttConnected) throw Error("MQTT Client Not Connected!");
        if (!(callback instanceof Function)) throw Error("Invalid callback function!");
        mqttClient.subscribe_topic(
        topic,
        (pkt, params, ctx) => {
          callback(pkt, pkt)
        })
      }

      /**
       * Wrapper function to initialize MQTT connection to broker.
       * @param server
       * @param port
       */
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
        lastKeepAliveReceived=parseInt(Date.now()/1000)
        console.log("Sonar is online.");
        return true;
      }else if (data.includes(TRACK_MODE)){
        $sonarStore.sonarStatus.isOnline=true;

        $sonarStore.sonarData.isTracking=true;    
        lastKeepAliveReceived=parseInt(Date.now()/1000)    
        $sonarStore.sonarData.trackingReportedAt=parseInt((Date.now()/1000));

        return true;
      }
      return false;
    }
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    let busy=false;
    let previousDeg=0;
    let previousQueueLength=0;
    let fetchInterval=MIN_INTERVAL;
    async function shiftAndDrawEntry(){
      /*
      * Responsible for taking the first element from the queue and updating the sonarData.
      */
      if(busy) return;
      busy=true;
        let entry=measurementsQueue.shift();
        if(entry==undefined){
          busy=false;
          return;
        }
        if(entry.rRange1==-1) entry.rRange1=Infinity;
        if(entry.rRange2==-1) entry.rRange2=Infinity;
        $sonarStore.sonarData.rRange1=entry.rRange1;
        $sonarStore.sonarData.rRange2=entry.rRange2;
        $sonarStore.sonarData.rDeg1=entry.rDeg1;
        $sonarStore.sonarData.rDeg2=entry.rDeg2;
      busy=false;
    }

    async function queueShifter(){
      /*
      * Responsible for calling the function that will process entries at a fixed interval.
      */
      let shifter=setInterval(async function(){
      await shiftAndDrawEntry()
      /*
      * If the length keeps increasing we need to increase the interval at which we playback the data.
      */
      if(measurementsQueue.length==0){
        if(fetchInterval<MAX_INTERVAL){
          fetchInterval+=1;
          clearInterval(shifter);
          queueShifter()
        }
      } else if(measurementsQueue.length>MAX_QUEUE_LENGTH) {
        if(fetchInterval>MIN_INTERVAL){
          fetchInterval-=1;
          clearInterval(shifter);
          queueShifter()
        }

      }
     },fetchInterval);

    }
    queueShifter()

    //Callback function of mqtt connection. Runs every time we get a new message.
    async function mqttCallback(data){
      
      //Decoding bytes to string.
        const parsedData = new TextDecoder().decode(data.payload);
        console.log(parsedData)
        if(await interpretPotentialConfirmation(parsedData)) return;
      //Splitting by predetermined splitter.
      const parsedArray=parsedData.split("/");
         
        for(let i=1;i<parsedArray.length;i+=3){
          let rRange1=parseInt(parsedArray[i])
          let rRange2=parseInt(parsedArray[i+1])
          let initDeg=(360-parseInt(parsedArray[i+2]));
          if(previousDeg<(360-parseInt(parsedArray[i+2]))){
            for(let i=initDeg-MEASUREMENT_ANGLE;i<initDeg;i++){
              //If measurements are empty then we do not need to add them to the queue
              if(parseInt(rRange1)==-1 && parseInt(rRange2)==-1) continue;
              let queueEntry={
                "rRange1":rRange1,
                "rRange2":rRange2,
                "rDeg1":i,
                "rDeg2":i-180
              }
              if(!measurementsQueue.includes(queueEntry)){
                measurementsQueue.push(queueEntry);
              }
            }
          } else {
            for(let i=initDeg+MEASUREMENT_ANGLE;i>initDeg;i--){
               //If measurements are empty then we do not need to add them to the queue
              if(parseInt(rRange1)==-1 && parseInt(rRange2)==-1) continue;
              let queueEntry={
                "rRange1":rRange1,
                "rRange2":rRange2,
                "rDeg1":i,
                "rDeg2":i-180
              }
              if(!measurementsQueue.includes(queueEntry)){
                measurementsQueue.push(queueEntry);
              }
            }
          }
          previousDeg=initDeg;
        }

    }

    /**
     * Creates a copy of the store to look check for changes.
     */
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
          console.log(("SSR"+($sonarCommands.sonarData.sDeg1)+($sonarCommands.sonarData.sDeg2)))
          mqttSend("KiWaveSonarCommand","SSR"+($sonarCommands.sonarData.sDeg1)+($sonarCommands.sonarData.sDeg2));
          storeCopy.sDeg1=$sonarCommands.sonarData.sDeg1
        }
        $: if(storeCopy.sDeg2!=$sonarCommands.sonarData.sDeg2){
          console.log("Sending degrees!")
          console.log(("SSR"+($sonarCommands.sonarData.sDeg1)+($sonarCommands.sonarData.sDeg2)))

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

        $: if(storeCopy.trackMode!=$sonarCommands.sonarData.trackMode){
          let command=($sonarCommands.sonarData.trackMode===false?"TRK":"SRK")
          mqttSend("KiWaveSonarCommand",command);
          storeCopy.trackMode=$sonarCommands.sonarData.trackMode;

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
