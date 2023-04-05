<script>
    import { onMount } from "svelte";
    import { sonarStore } from "../../data/stores";
    
    /*
    Sonar store can be accessible at all times and contains the mapping: 
    "sonarData":{
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },
    Used for communicating data from Mqtt component and radar screen
    */
    
    let deg;
    let dist;
    let canvasEl;
    const screenRadius = 200;
    const canvas = {
        width: screenRadius*2,
        height: screenRadius*2
    };
    let context;
    
    sonarStore.subscribe(sonarStore => {
        deg = sonarStore.sonarData.deg;
        dist = sonarStore.sonarData.dist;
    });

    const drawCircle = (context) => {
        context.beginPath();
        context.arc(screenRadius, screenRadius, screenRadius, 0, 2 * Math.PI);
        context.stroke();
    }

    const drawLineTo = (context, x, y) => {
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.moveTo(canvas.width/2, canvas.height/2);
        context.lineTo(x, y);
        context.stroke();
    };

    const getCoordinates = (deg, dist) => {
        let mappedDist = mapDistance(dist);
        // TODO
    }
    
    /**
     * Maps distance from sensor to radar screen
     * @param dist - The distance from the sensor
     * @param range - The current maximum distance the radar is set to
     * @return {number} - The distance mapped to the radar screen
     */
    const mapDistance = (dist, range) => {
        return dist / range * screenRadius;
    }

    onMount(() => {
        console.log("RadarScreen mounted");
        context = canvasEl.getContext('2d');
        drawCircle(context);
        drawLineTo(context, 400, 200);
    });
    
</script>

<p>{deg}: {dist}</p>
<canvas bind:this={canvasEl} width={canvas.width} height={canvas.height}></canvas>

<style>
    canvas {
        border: 1px solid black;
    }
    
</style>