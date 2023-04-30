<script>
    import { onMount } from "svelte";
    import { sonarCommands, sonarStore } from "../../../data/stores";
    import { Canvas } from 'svelte-canvas';
    import Background from "./Background.svelte";
    import Object from "./Object.svelte";
    import SectorLines from "./SectorLines.svelte";
    
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

    // Set the canvas width in proportion with the client window's outer width, also depending on the breakpoint at 600 pixels
    $: canvasWidth = (width > 600) ? (width / 3) : (width * 0.95);
    // Set the radius of the radar screen in proportion of the width of the canvas, leaving larger margin on mobile for the labels
    $: screenRadius = (width > 600) ? (canvasWidth / 2) * 0.9 : (canvasWidth / 2) * 0.85;

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

<svelte:window bind:outerWidth={width}/>

<Canvas 
    width={canvasWidth} 
    height={canvasWidth} >
    <Background {screenRadius} />
    <Object {screenRadius}/>
    <SectorLines {screenRadius} />
</Canvas>

<style>
    
</style>