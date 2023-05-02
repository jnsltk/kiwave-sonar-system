<script>
    import { onMount } from "svelte";
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
    $: canvasWidth = (width > 600) ? (width / 2.3) : (width * 0.95);
    // Set the radius of the radar screen in proportion of the width of the canvas, leaving larger margin on mobile for the labels
    $: screenRadius = (width > 600) ? (canvasWidth / 2) * 0.9 : (canvasWidth / 2) * 0.85;

    onMount(() => {
        console.log("RadarScreen mounted");
    });

</script>

<svelte:window bind:outerWidth={width}/>

<div id="canvas">
    <Canvas 
        width={canvasWidth} 
        height={canvasWidth} >
        <Background {screenRadius} />
        <Object {screenRadius}/>
        <SectorLines {screenRadius} />
    </Canvas>
</div>

<style>
    #canvas {
        filter: drop-shadow(2px 4px 40px #c3c1c1);
    }

</style>