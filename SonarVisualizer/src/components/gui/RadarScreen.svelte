<script>
    import { onMount } from "svelte";
    import { sonarCommands, sonarStore } from "../../data/stores";
    
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
    const canvasDimensions = {
        // Width and height is screenRadius x2 plus 15% padding to make space for labels
        width: screenRadius*2*1.15,
        height: screenRadius*2*1.15
    };
    const objectColor = "#73936E";
    const lineColor = "#101010";
    const radarBackround = "#414440"
    const lineToObjectColor = radarBackround;
    
    let context;
    let deg1;
    let deg2;
    let dist1;
    let dist2;
    let range;
    let canvasEl;

    /**
     * Draws the radar screen 
     * @param context The graphical context
     */
     const drawRadar = (context) => {
        context.save();
        context.translate(canvasDimensions.width / 2, canvasDimensions.height / 2);
        context.beginPath();
        context.strokeStyle = lineColor;
        context.lineWidth = 2;
        // Draw concentric circles
        context.arc(0, 0, screenRadius, 0, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        context.lineWidth = 1;
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
     * Draws 15 lines (because of the 15 degree measurement angle) from the center to the specified coordinates to erase 
     * previous object measurments
     * @param context The graphical context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor
     */
    const drawLineTo = (context, deg, dist) => {
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const endCoordinates = getCoordinates(i, dist);
            context.save();
            context.translate(canvasDimensions.width / 2, canvasDimensions.height / 2);
            context.beginPath();
            context.strokeStyle = lineToObjectColor;
            context.lineWidth = 5;
            context.moveTo(0, 0);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        };
    };


    /**
     * Draws 15 lines (because of the 15 degree measurement angle) from the specified coordinates to the edge of the 
     * radar screen, which represents a detected object
     * @param context The graphcial context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor
     */
    const drawObjectFrom = (context, deg, dist) => {
        // Calculate coordinates for the endpoint for the line on the circle
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const startCoordinates = getCoordinates(i, dist);
            const endCoordinates = getCoordinates(i, range);
            context.save();
            context.translate(canvasDimensions.width / 2, canvasDimensions.height / 2);
            context.beginPath();
            context.strokeStyle = objectColor;
            context.lineWidth = 3;
            context.moveTo(startCoordinates.x, startCoordinates.y);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        }
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
        // Subtract 90 from the angle so it starts at 12 o' clock positon
        return {
            x: Math.cos(toRadians(deg - 90)) * mappedDist,
            y: Math.sin(toRadians(deg - 90)) * mappedDist
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

        if (dist > range) dist = range;
        drawObjectFrom(context, deg, dist);
        drawLineTo(context, deg, dist);

        drawRadar(context);
    }

    /**
     * Clears the radar screen, draws degree labels and sets the background color
     */
    const resetScreen = () => {
        if (canvasEl == null) {
            return;
        }
        context = canvasEl.getContext('2d');

        context.save();
        context.translate(canvasDimensions.width / 2, canvasDimensions.height / 2);
        context.beginPath();
        context.fillStyle = radarBackround;
        context.arc(0, 0, screenRadius, 0, 2 * Math.PI);  
        context.fill();

        // Draw labels
        context.font = "0.8em sans";
        context.fillText("0°", -5, - (screenRadius + 5));
        context.fillText("90°", (screenRadius + 5), 5);
        context.fillText("270°", - (screenRadius + 35), 5);
        context.fillText("180°", -15, screenRadius + 17);

        context.restore();

        drawRadar(context);
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
    /**
     * Subscribes to the data in sonarStore and assigns them to local variables whenever updated
     */
    sonarStore.subscribe(sonarStore => {
        deg1 = sonarStore.sonarData.rDeg1;
        deg2 = sonarStore.sonarData.rDeg2;
        dist1 = sonarStore.sonarData.rRange1;
        dist2 = sonarStore.sonarData.rRange2;
    });

    sonarCommands.subscribe(sonarCommands => {
        range = sonarCommands.sonarData.sRange;
    })

    /**
     * Calls the draw function everytime the value of either deg or dist changes in sonarStore
    */
    $: if($sonarStore.sonarData.rDeg1 || 
            $sonarStore.sonarData.rDeg2 || 
            $sonarStore.sonarData.rRange1 ||
            $sonarStore.sonarData.rRange2
            ){
        draw(deg1, dist1);
        draw(deg2, dist2);
    }

    onMount(() => {
        console.log("RadarScreen mounted");
        resetScreen();
        draw(deg1, dist1);
        draw(deg2, dist2);
    });

    
    
</script>

<canvas bind:this={canvasEl} width={canvasDimensions.width} height={canvasDimensions.height}></canvas>

<style>
    
</style>