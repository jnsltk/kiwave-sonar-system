<script>
    import { Layer } from "svelte-canvas";
    import { getCoordinates } from "./utils";
    import { sonarCommands, sonarStore } from "../../../data/stores";

    export let screenRadius;

    $: dist1 = parseFloat($sonarStore.sonarData.rRange1);
    $: dist2 = parseFloat($sonarStore.sonarData.rRange2);
    $: deg1 = parseInt($sonarStore.sonarData.rDeg1);
    $: deg2 = parseInt($sonarStore.sonarData.rDeg2);
    $: range = parseInt($sonarCommands.sonarData.sRange);
    let history = [];

    const objectColor = "#585858";
    const activeSectorColor = "#007AFF"
    const lineToObjectColor = "#D5D7D4";
        
    /**
     * Draws 15 lines (because of the 15 degree measurement angle) from the center to the specified coordinates to erase 
     * previous object measurments. If called on the currently measured (active) sector, the line corresponding to the 
     * degree will be highlighted.
     * @param context The graphical context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor
     * @param width Canvas width
     * @param height Canvas height 
     * @param currentlyActive Boolean flag indicating whether the function is called on the currently measured (active) sector
     */
    const drawLineTo = (context, deg, dist, width, height, currentlyActive) => {
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const endCoordinates = getCoordinates(i, dist, $sonarCommands.sonarData.sRange, screenRadius);
            context.save();
            context.translate(width / 2, height / 2);
            context.beginPath();
            context.strokeStyle = lineToObjectColor;
            context.lineWidth = 5;
            context.moveTo(0, 0);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        };
        // Draws the highlighted line last so it's not drawn on and covered
        if (currentlyActive) {
            const endCoordinates = getCoordinates(deg, dist, $sonarCommands.sonarData.sRange, screenRadius);
            context.save();
            context.translate(width / 2, height / 2);
            context.beginPath();
            context.strokeStyle = activeSectorColor;
            context.lineWidth = 2;
            context.moveTo(0, 0);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        }
    };


    /**
     * Draws 15 lines (because of the 15 degree measurement angle) from the specified coordinates to the edge of the 
     * radar screen, which represents a detected object. If called on the currently measured (active) sector, the line corresponding to the 
     * degree will be highlighted.
     * @param context The graphcial context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor 
     * @param width Canvas width
     * @param height Canvas height 
     * @param currentlyActive Boolean flag indicating whether the function is called on the currently measured (active) sector
     */
    const drawObjectFrom = (context, deg, dist, width, height, currentlyActive) => {
        // Calculate coordinates for the endpoint for the line on the circle
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const startCoordinates = getCoordinates(i, dist, $sonarCommands.sonarData.sRange, screenRadius);
            const endCoordinates = getCoordinates(i, $sonarCommands.sonarData.sRange, $sonarCommands.sonarData.sRange, screenRadius);
            context.save();
            context.translate(width / 2, height / 2);
            context.beginPath();
            context.strokeStyle = objectColor;
            context.lineWidth = 2;
            context.moveTo(startCoordinates.x, startCoordinates.y);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        }
        // Draws the highlighted line last so it's not drawn on and covered
        if (currentlyActive) {
            const startCoordinates = getCoordinates(deg, dist, $sonarCommands.sonarData.sRange, screenRadius);
            const endCoordinates = getCoordinates(deg, $sonarCommands.sonarData.sRange, $sonarCommands.sonarData.sRange, screenRadius);
            context.save();
            context.translate(width / 2, height / 2);
            context.beginPath();
            context.strokeStyle = activeSectorColor;
            context.lineWidth = 2;
            context.moveTo(startCoordinates.x, startCoordinates.y);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        }
    };

    /**
     * Renders the Object component to the Canvas element. The Object component will contain the two sectors the sensor is currently 
     * looking at (indicated by a highlighted line in the middle), as well any previously measured objects, if there are any.
     * By declaring this function reactively, we make sure svelte-canvas re-render anytime the values the function depends on change. 
     * @param context The 2D rendering context of the Canvas element
     * @param width Canvas width
     * @param height Canvas height 
     */
    $: render = ({ context, width, height }) => {
        history.forEach(element => {
            if (element.dist1 > range) element.dist1 = range;
            drawObjectFrom(context, element.deg1, element.dist1, width, height, false);
            drawLineTo(context, element.deg1, element.dist1, width, height, false);

            if (element.dist2 > range) element.dist2 = range;
            drawObjectFrom(context, element.deg2, element.dist2, width, height, false);
            drawLineTo(context, element.deg2, element.dist2, width, height, false);
        });

        if (dist1 > range) dist1 = range;
        drawObjectFrom(context, deg1, dist1, width, height, true);
        drawLineTo(context, deg1, dist1, width, height, true);

        if (dist2 > range) dist2 = range;
        drawObjectFrom(context, deg2, dist2, width, height, true);
        drawLineTo(context, deg2, dist2, width, height, true);

        history.push({
            "deg1": deg1,
            "deg2": deg2,
            "dist1": dist1,
            "dist2": dist2
        })
    }
</script>

<Layer {render} />