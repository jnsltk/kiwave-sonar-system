<script>
    import { Layer } from "svelte-canvas";
    import { darkModeSwitch } from "../../../data/stores";

    export let x = 0;
    export let y = 0;
    export let value;
    export let displayTooltip = true;

    const tooltipWidth = 88;
    const tooltipHeight = 60;

    $: tooltipColor = ($darkModeSwitch.isDark) ? "#161616" : "#eef1ec";
    $: fontColor = ($darkModeSwitch.isDark) ? "#fff" : "#000";

    console.log(x, y, value)

    $: render = ({context, width, height}) => {
        if (!displayTooltip) return;
        context.save();

        context.beginPath();
        context.filter = "drop-shadow(rgba(0, 0, 0, 0.2) 0 2px 15px)";
        context.fillStyle = tooltipColor;
        context.roundRect(x - tooltipWidth / 2, y - tooltipHeight, tooltipWidth, tooltipHeight - 8, [10]);
        context.fill()
        context.moveTo(x - 7, y - 8);
        context.lineTo(x, y);
        context.lineTo(x + 7, y - 8);
        context.fill();

        context.beginPath();
        context.fillStyle = fontColor;
        context.font = "14px sans-serif"
        context.fillText(`D: ${Math.floor(value.dist)} cm`, x - tooltipWidth / 2 + 12, y - tooltipHeight + 22);
        context.fillText(`A: ${Math.floor(value.deg)}°`, x - tooltipWidth / 2 + 12, y - tooltipHeight + 40);

        context.restore();
    }
</script>

<Layer {render} />