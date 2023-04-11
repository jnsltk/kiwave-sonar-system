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
    
    const screenRadius = 300;
    const canvas = {
        width: screenRadius*2,
        height: screenRadius*2
    };
    
    let context;
    let deg;
    let dist;
    let range;
    let canvasEl;
    
    sonarStore.subscribe(sonarStore => {
        deg = sonarStore.sonarData.deg;
        dist = sonarStore.sonarData.dist;
        range = sonarStore.sonarData.range;
    });

    /**
     * Draws the radar screen 
     * @param context The graphical context
     */
     const drawRadar = (context) => {
        context.save();
        context.translate(screenRadius, screenRadius);
        context.beginPath();
        context.strokeStyle = 'grey';
        context.lineWidth = 1;
        // Draw concentric circles
        context.arc(0, 0, screenRadius, 0, 2 * Math.PI);
        context.moveTo(screenRadius * 3/4, 0);
        context.arc(0, 0, screenRadius * 3/4, 0, 2 * Math.PI);
        context.moveTo(screenRadius * 2/4, 0);
        context.arc(0, 0, screenRadius * 2/4, 0, 2 * Math.PI);
        context.moveTo(screenRadius * 1/4, 0);
        context.arc(0, 0, screenRadius * 1/4, 0, 2 * Math.PI);
        context.stroke();
        // Draw lines dividing sectors
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(30)) * - screenRadius, Math.sin(toRadians(30)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(60)) * - screenRadius, Math.sin(toRadians(60)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(90)) * - screenRadius, Math.sin(toRadians(90)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(120)) * - screenRadius, Math.sin(toRadians(120)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(150)) * - screenRadius, Math.sin(toRadians(150)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(180)) * - screenRadius, Math.sin(toRadians(180)) * - screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(30)) * screenRadius, Math.sin(toRadians(30)) * screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(60)) * screenRadius, Math.sin(toRadians(60)) * screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(90)) * screenRadius, Math.sin(toRadians(90)) * screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(120)) * screenRadius, Math.sin(toRadians(120)) * screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(150)) * screenRadius, Math.sin(toRadians(150)) * screenRadius);
        context.moveTo(0, 0);
        context.lineTo(Math.cos(toRadians(180)) * screenRadius, Math.sin(toRadians(180)) * screenRadius);
        context.stroke();

        context.restore();
    }

    /**
     * Draws a green line from the center to the specified coordinates
     * @param context The graphical context
     * @param x The x coordinate of the line's endpoint
     * @param y The y coordinate of the line's endpoint
     */
    const drawLineTo = (context, x, y) => {
        context.save();
        context.translate(screenRadius, screenRadius);
        context.beginPath();
        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.moveTo(0, 0);
        context.lineTo(x, y);
        context.stroke();
        context.restore();
    };

    /**
     * Draws a red line from the specified coordinates to the edge of the radar screen, which represents a detected object
     * @param context The graphcial context
     * @param deg The angle at which the object was detected, used to determine the edge of the screen in combination with range
     * @param x The x coordinate of the detected object on the radar screen
     * @param y The y coordinate of the detected object on the radar screen
     */
    const drawObjectFrom = (context, deg, x, y) => {
        // Calculate coordinates for the endpoint for the line on the circle
        let endCoordinates = getCoordinates(deg, range);
        context.save();
        context.translate(screenRadius, screenRadius);
        context.beginPath();
        context.strokeStyle = 'red';
        context.lineWidth = 3;
        context.moveTo(x, y);
        context.lineTo(endCoordinates.x, endCoordinates.y);
        context.stroke();
        context.restore();
    };

    /**
     * Returns the x and y coordinates of the point defined by the angle and distance from the sensor
     * @typedef {Object} Point
     * @param deg The direction of the distance meaurement
     * @param dist The distance from the sensor
     * @return {Point} The object containing the x and y coordinates
     */
    const getCoordinates = (deg, dist) => {
        let mappedDist = mapDistance(dist, range);
        // X = cos(deg) * dist
        // Y = sin(deg) * dist
        return {
            x: Math.cos(toRadians(deg)) * mappedDist,
            y: Math.sin(toRadians(deg)) * mappedDist
        };
    }

    /**
     * Converts degrees to radians
     * @param deg Angle in degrees
     * @return {Number} Angle in radians
     */
    const toRadians = (deg) => {
        return deg * (Math.PI / 180);
    }

    /**
     * Draws line on radar screen based on data received from the sensor
     * @param context The graphical context
     * @param deg The direction of the distance measurement
     * @param dist The distance from the sensor
     */
    const draw = (deg, dist) => {
        if (canvasEl == null) {
            return;
        }
        context = canvasEl.getContext('2d');

        // Fade out previous lines
        context.save();
        context.translate(screenRadius, screenRadius);
        context.moveTo(0, 0);
        context.arc(0, 0, screenRadius, 0, 2 * Math.PI);
        context.fillStyle = "rgba(0, 0, 0, 0.03)";
        context.fill();
        context.restore();

        drawRadar(context);

        // If dist is greater than or equal to range, the whole line is green, else the object is red
        const coordinates = getCoordinates(deg, dist);
        const endCoordinates = getCoordinates(deg, range);
        if (dist >= range) {
            drawLineTo(context, endCoordinates.x, endCoordinates.y);
        } else {
            drawLineTo(context, coordinates.x, coordinates.y);
            drawObjectFrom(context, deg, coordinates.x, coordinates.y);
        }
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

    //This code should execute auto, everytime the variable changes.
    $: if($sonarStore.sonarData){
        console.log("Fire!")
        draw(deg, dist);
    }

    //Simulating change of sonarData
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
            $sonarStore.sonarData.deg=(await getRandomInt(0,360)).toString()
            $sonarStore.sonarData.dist=(await getRandomInt(0,350)).toString()
        },100)
    }
    sonarSim()

    onMount(() => {
        console.log("RadarScreen mounted");

        // Testing with a for loop
        // console.log(`${deg}, ${dist}`)
        // for (let i = 0; i < 360; i++) {
        //     setTimeout(function() {
        //         if (i == deg) {
        //             draw(i, dist);
        //         } else {
        //             draw(i, 350);
        //         };
        //     }, 10*i);
        // }
        //draw(deg, dist);
    });

    
    
</script>

<!-- Display current degree and corresponding distance from store.js for testing purposes -->
<p>{deg}: {dist}</p>

<canvas bind:this={canvasEl} width={canvas.width} height={canvas.height}></canvas>

<style>
    
</style>