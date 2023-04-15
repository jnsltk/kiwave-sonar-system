<script>
// @ts-nocheck

 
    import Sonar from './components/gui/Sonar.svelte';
    import Range from './components/gui/Range.svelte';
    import {startListener,mqttSend} from "./components/mqtt/MqttHandler.js"
    import {sonarStore} from "./data/stores";
    const ENABLE_SIMULATION=true;


    async function mqttCallback(data){
      if(ENABLE_SIMULATION) return;
    const parsedData = new TextDecoder().decode(data.payload);
    console.log(parsedData)
    const parsedArray=parsedData.split("/");
    parsedArray[3]=360-parseInt(parsedArray[3]);
    $sonarStore.sonarData.dist1=parseInt(parsedArray[1]);
    $sonarStore.sonarData.dist2=parseInt(parsedArray[2]);
    $sonarStore.sonarData.deg1=parseInt(parsedArray[3]);
    $sonarStore.sonarData.deg2=parseInt(parsedArray[3])-180;
    console.log($sonarStore.sonarData)
    }


  
    startListener(mqttCallback)

    async function stopsonar(){
      mqttSend("KiWaveSonarCommand","STP");
    }
    async function startsonar(){
      mqttSend("KiWaveSonarCommand","STR");

    }

    var startDeg=0;
    var endDeg=180;
    var maxRange=0;
    async function setrange(){
      mqttSend("KiWaveSonarCommand","SRR"+(maxRange.toString())+(maxRange.toString()));

    }
    async function setdeg(){
      mqttSend("KiWaveSonarCommand","SRR"+(startDeg.toString())+(endDeg.toString()));

    }

    async function hsk(){
      mqttSend("KiWaveSonarCommand","SHK");

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
  <button on:click={()=>hsk()}>handshake</button>
<button on:click={()=>stopsonar()}>stop</button>
<button on:click={()=>startsonar()}>start</button>
<p>maxrange</p>
<input bind:value={maxRange} type="number" placeholder="maxrange">
<p>startdeg</p>

<input bind:value={startDeg} type="number" placeholder="startdeg">
<p>enddeg</p>

<input bind:value={endDeg} type="number" placeholder="enddegree"><br>
<button on:click={()=>setrange()}>setrange</button>
<button on:click={()=>setdeg()}>setdegree</button>

</main>

<style>

</style>
