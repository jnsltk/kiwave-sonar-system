<script>
    import { Layer } from "svelte-canvas";
    import { darkModeSwitch } from "../../../data/stores";

    export let screenRadius;

    const lineColor = "#8f948d";
    /*
     * If dark mode is activated, we have another color for the background.
    */
    $: radarBackround = $darkModeSwitch.isDark ? "#3b3b3b" : "#d5d7d4";
    
    /**
     * Renders the Background component to the canvas, which consists of the background circle and the labels showing different angles.
     * By declaring this function reactively, we make sure svelte-canvas re-render anytime the values the function depends on change.
     * @param context The 2D rendering context of the Canvas element
     * @param width Canvas width
     * @param height Canvas height 
     */
    $: render = ({ context, width, height }) => {
        context.save();
        context.translate(width / 2, height / 2);
        context.beginPath();
        context.fillStyle = radarBackround;
        context.arc(0, 0, screenRadius, 0, 2 * Math.PI);  
        context.fill();

        // Draw labels
        context.fillStyle = lineColor;
        context.font = "12px sans-serif";
        context.fillText("0°", -3, - (screenRadius + 4));
        context.fillText("90°", (screenRadius + 3), 4);
        context.fillText("270°", - (screenRadius + 27), 4);
        context.fillText("180°", -10, screenRadius + 12);

        context.restore();
    }
</script>

<Layer {render} />