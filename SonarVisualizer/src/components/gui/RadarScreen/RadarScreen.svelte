<script>
    import { onMount } from "svelte";
    import { Canvas } from 'svelte-canvas';
    import Background from "./Background.svelte";
    import Object from "./Object.svelte";
    import SectorLines from "./SectorLines.svelte";
    import { getDegDist } from "./utils";
    import { sonarCommands } from "../../../data/stores";
    import Tooltip from "./Tooltip.svelte";
    
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
    let canvas;
    let tooltipX;
    let tooltipY;
    let tooltipVal;

    // Should the tooltip be displayed
    let displayTooltip = false;

    // Set the canvas width in proportion with the client window's outer width, also depending on the breakpoints at 600 and 1000 pixels
    $: canvasWidth = (width > 1000) ? (width / 2.3)
                  : (width > 600 && width <= 1000) ? (width * 0.9)
                  : (width * 0.95);
   

   
    // Set the radius of the radar screen in proportion of the width of the canvas, leaving larger margin on mobile for the labels
    $: screenRadius = (width > 600) ? (canvasWidth / 2) * 0.9 : (canvasWidth / 2) * 0.85;

    /**
     * Returns the position of the pointer on the canvas at a given event, where the 0,0 position would mean the top left corner of the canvas
     * @typedef {Object} mousePos
     * @param e The event object
     * @param canvas The canvas element
     * @return {mousePos} The object containing the x and y coordinates
     */
    const getMousePosition = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    /**
     * Returns the translated position of the pointer on the canvas at a given event, where the 0,0 position would mean the center of the canvas
     * @param e The event object
     * @param canvas The canvas element
     * @return {mousePos} The object containing the x and y coordinates
     */
    const getTranslatedMousePosition = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) - canvasWidth / 2,
            y: -((e.clientY - rect.top) - canvasWidth / 2) 
        };
    }

    /**
     * Checks to see if during the passed in event the pointer was in the canvas or not
     * @param e The event object
     * @param canvas The canvas element
     * @return {boolean} Value indicating whether the pointer was in the canvas
     */
    const isPointerInCanvas = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        return !((rect.x + rect.width) < e.clientX || rect.y + rect.height < e.clientY || rect.x > e.clientX || rect.y > e.clientY);
    }

    onMount(() => {
        console.log("RadarScreen mounted");
    });

</script>

<svelte:window 
    bind:outerWidth={width} 
    on:pointermove={(e) => {
            // If the pointer is outside the canvas, the tooltip should not be displayed
            displayTooltip = isPointerInCanvas(e, canvas) && tooltipVal.dist <= parseInt($sonarCommands.sonarData.sRange);
        }}/>

<div id="canvas" bind:this={canvas}>
    <Canvas
        on:pointermove={(e) => {
            // If the pointer is in the canvas and also in the circular area of the radar screen, the tooltip should be displayed
            let translMousePos = getTranslatedMousePosition(e, canvas);
            let mousePos = getMousePosition(e, canvas);
            tooltipX = mousePos.x;
            tooltipY = mousePos.y;
            tooltipVal = getDegDist(translMousePos.x, translMousePos.y, parseInt($sonarCommands.sonarData.sRange), screenRadius);
            displayTooltip = (tooltipVal.dist <= parseInt($sonarCommands.sonarData.sRange));

        }}
        width={canvasWidth} 
        height={canvasWidth} >
        <Background {screenRadius} />
        <Object {screenRadius}/>
        <SectorLines {screenRadius} />
        <Tooltip 
            x={tooltipX} 
            y={tooltipY}
            value={tooltipVal}
            displayTooltip={displayTooltip}
            {screenRadius}/>
    </Canvas>
    
</div>

<style>
    #canvas {
        /* Padding needs to stay zero for the tooltips' coordinates to be accurate */
        padding: 0;
        filter: drop-shadow(2px 4px 40px #c3c1c1);
    }

</style>