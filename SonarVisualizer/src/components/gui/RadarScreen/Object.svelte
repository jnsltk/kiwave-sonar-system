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

    const objectColor = "#585858";
    const lineToObjectColor = "#D5D7D4";
        
    /**
     * Draws 15 lines (because of the 15 degree measurement angle) from the center to the specified coordinates to erase 
     * previous object measurments
     * @param context The graphical context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor
     */
    const drawLineTo = (context, deg, dist, width, height) => {
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const endCoordinates = getCoordinates(i, dist);
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
    };


    /**
     * Draws 15 lines (because of the 15 degree measurement angle) from the specified coordinates to the edge of the 
     * radar screen, which represents a detected object
     * @param context The graphcial context
     * @param deg The angle at which the object was detected
     * @param dist The distance from the sensor
     */
    const drawObjectFrom = (context, deg, dist, width, height) => {
        // Calculate coordinates for the endpoint for the line on the circle
        for (let i = parseInt(deg) - 7; i < parseInt(deg) + 8; i++) {
            const startCoordinates = getCoordinates(i, dist, $sonarCommands.sonarData.sRange, screenRadius);
            const endCoordinates = getCoordinates(i, $sonarCommands.sonarData.sRange, $sonarCommands.sonarData.sRange, screenRadius);
            context.save();
            context.translate(width / 2, height / 2);
            context.beginPath();
            context.strokeStyle = objectColor;
            context.lineWidth = 3;
            context.moveTo(startCoordinates.x, startCoordinates.y);
            context.lineTo(endCoordinates.x, endCoordinates.y);
            context.stroke();
            context.restore();
        }
    };


    $: render = ({ context, width, height }) => {
        if (dist1 > range) dist1 = range;
        drawObjectFrom(context, deg1, dist1, width, height);
        drawLineTo(context, deg1, dist1, width, height);

        if (dist2 > range) dist2 = range;
        drawObjectFrom(context, deg2, dist2, width, height);
        drawLineTo(context, deg2, dist2, width, height);
    }
</script>

<Layer {render} />