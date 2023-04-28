<script>
    import { Layer } from "svelte-canvas";

    export let screenRadius;

    const lineColor = "#8f948d";
    const radarBackround = "#d5d7d4";
    
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