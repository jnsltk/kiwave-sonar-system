<script>
    // @ts-nocheck
    
    
  import {startListener,mqttSend} from "./MqttHandler.js"
  import {sonarStore} from "../../data/stores";
  
    //Enabling this flag causes random data to be added to sonarStore.
    const ENABLE_SIMULATION=true;
  
    //Callback function of mqtt connection. Runs every time we get a new message.
    async function mqttCallback(data){
      //Disable if we have simulation mode active.
        if(ENABLE_SIMULATION) return;
      //Decoding bytes to string.
        const parsedData = new TextDecoder().decode(data.payload);
      //Splitting by predetermined splitter.
        const parsedArray=parsedData.split("/");
      //The servo rotates CCW which is why we need to invert the received degrees.
        parsedArray[3]=360-parseInt(parsedArray[3]);
      //Updating the store with the new data.
        $sonarStore.sonarData.dist1=parseInt(parsedArray[1]);
        $sonarStore.sonarData.dist2=parseInt(parsedArray[2]);
        $sonarStore.sonarData.deg1=parseInt(parsedArray[3]);
      //Subtracting 180 from this, since this sensor is positioned opposite of previous sensor.
        $sonarStore.sonarData.deg2=parseInt(parsedArray[3])-180;
      //For logging purposes
        console.log($sonarStore.sonarData)
    }
    //Instantiates MQTT instance and subscribes to topic
      startListener(mqttCallback)


    //Command to stop the sonar over MQTT
      async function stopsonar(){
        mqttSend("KiWaveSonarCommand","STP");
      }
    //Command to start the sonar over MQTT
      async function startsonar(){
        mqttSend("KiWaveSonarCommand","STR");
  
      }
    
    //Starting degree of sonar.
      var startDeg=0;
    //End degree of sonar.
      var endDeg=180;
    //Maximum range that the sonar will report objects
      var maxRange=0;
    //Command to set range
      async function setrange(){
        mqttSend("KiWaveSonarCommand","SRR"+(maxRange.toString())+(maxRange.toString()));
      }
    //Command to set sector
      async function setdeg(){
        mqttSend("KiWaveSonarCommand","SRR"+(startDeg.toString())+(endDeg.toString()));
      }
  
  
  
    if(ENABLE_SIMULATION){
      setInterval(async function(){
        const simr1=parseInt(Math.random()*parseInt(500));
        const simr2=parseInt(Math.random()*parseInt(500));
        $sonarStore.sonarData.dist1=simr1<parseInt(maxRange)?simr1:-1;
        $sonarStore.sonarData.dist2=simr2<parseInt(maxRange)?simr2:-1;
        const simdeg1=parseInt(Math.random()*parseInt(endDeg));
        const simdeg2=parseInt(Math.random()*parseInt(endDeg));
        $sonarStore.sonarData.deg1=simdeg1<startDeg?startDeg:simdeg1;
        $sonarStore.sonarData.deg2=simdeg2<startDeg?startDeg:simdeg2;
        console.log($sonarStore.sonarData);
      },250)
    }
    </script>
    
    <main>
    <button on:click={()=>stopsonar()}>stop</button>
    <button on:click={()=>startsonar()}>start</button>
    <p>maxrange</p>
  <input bind:value={maxRange} type="text" placeholder="maxrange">
    <p>startdeg</p>
    
  <input bind:value={startDeg} type="text" placeholder="startdeg">
    <p>enddeg</p>
    
  <input bind:value={endDeg} type="text" placeholder="enddegree"><br>
    <button on:click={()=>setrange()}>setrange</button>
    <button on:click={()=>setdeg()}>setdegree</button>
    
    </main>
    
    <style>
  
    </style>
    