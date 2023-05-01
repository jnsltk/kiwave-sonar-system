<script>
    import { onMount } from "svelte";
    import { sonarCommands, sonarStore } from "../../../data/stores";
    import { Canvas } from 'svelte-canvas';
    import Background from "./Background.svelte";
    import Object from "./Object.svelte";
    
    /*
    Sonar store can be accessible at all times and contains the mapping: 
    "sonarData":{
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },
    Used for communicating data from Mqtt component and radar screen
    */
   
    let width;
    let height;

    $: screenRadius = (width / 2) * 0.85;

    onMount(() => {
        console.log("RadarScreen mounted");
    });

    async function sonarSim(){
        async function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }
        // for (let i = 0; i < 360; i++) {
        //     setTimeout(async function() {
        //         $sonarStore.sonarData.deg=i.toString()
        //         $sonarStore.sonarData.dist=(await getRandomInt(0,350)).toString()
        //     }, 30*i)
        // }
        setInterval(async function(){
            let deg = (await getRandomInt(0,360))
            $sonarStore.sonarData.rDeg1=(deg).toString()
            $sonarStore.sonarData.rRange1=(await getRandomInt(0, $sonarCommands.sonarData.sRange)).toString()
            $sonarStore.sonarData.rDeg2=(deg + 180).toString()
            $sonarStore.sonarData.rRange2=(await getRandomInt(0, $sonarCommands.sonarData.sRange)).toString()
        },1000)
    }

    sonarSim();
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
    <Canvas 
        {width} 
        {height} >
        <Background {screenRadius} />
        <Object {screenRadius}/>
    </Canvas>
</div>

<style>
    
</style>