<script>
    import { Layer } from "svelte-canvas";
    import { darkModeSwitch } from "../../../data/stores";

    export let x = 0;
    export let y = 0;
    export let value;
    export let displayTooltip = true;

    const tooltipWidth = 88;
    const tooltipHeight = 60;
    const tooltipDimensions = {
        arrowBottom: (x, y) => {
            return {
                tooltipX: x - tooltipWidth / 2,
                tooltipY: y - tooltipHeight,
                arrowStartX: x - 7,
                arrowStartY: y -8,
                arrowEndX: x + 7,
                arrowEndY: y - 8,
                textX: x - tooltipWidth / 2 + 12,
                textY: y - tooltipHeight + 22
            }
        },
        arrowTop: (x, y) => {
            return {
                tooltipX: x - tooltipWidth / 2,
                tooltipY: y + 8,
                arrowStartX: x + 7,
                arrowStartY: y +8,
                arrowEndX: x - 7,
                arrowEndY: y + 8,
                textX: x - tooltipWidth / 2 + 12,
                textY: y - tooltipHeight + 90
            }
        },
        arrowRight: (x, y) => {
            return {
                tooltipX: x - tooltipWidth / 2,
                tooltipY: y + 8,
                arrowStartX: x + 7,
                arrowStartY: y +8,
                arrowEndX: x - 7,
                arrowEndY: y + 8,
                textX: x - tooltipWidth / 2 + 12,
                textY: y - tooltipHeight + 22
            }
        }
    }


    $: tooltipColor = ($darkModeSwitch.isDark) ? "#161616" : "#eef1ec";
    $: fontColor = ($darkModeSwitch.isDark) ? "#fff" : "#000";

    const drawToolTip = (context, x, y, direction) => {
        let tooltip;
        switch (direction) {
            case 'bottom':
                tooltip = tooltipDimensions.arrowBottom(x, y);
                break;
            case 'top':
                tooltip = tooltipDimensions.arrowTop(x, y);
                break;
            case 'left':
            case 'right':
                tooltip = tooltipDimensions.arrowRight(x, y);
        }
        context.save();

        context.beginPath();
        context.filter = "drop-shadow(rgba(0, 0, 0, 0.2) 0 2px 15px)";
        context.fillStyle = tooltipColor;
        context.roundRect(tooltip.tooltipX, tooltip.tooltipY, tooltipWidth, tooltipHeight - 8, [10]);
        context.fill()
        context.moveTo(tooltip.arrowStartX, tooltip.arrowStartY);
        context.lineTo(x, y);
        context.lineTo(tooltip.arrowEndX, tooltip.arrowEndY);
        context.fill();

        context.beginPath();
        context.fillStyle = fontColor;
        context.font = "14px sans-serif";
        context.fillText(`D: ${Math.floor(value.dist)} cm`, tooltip.textX, tooltip.textY);
        context.fillText(`A: ${Math.floor(value.deg)}°`, tooltip.textX, tooltip.textY + 18);

        context.restore();
    }

    $: render = ({context, width, height}) => {
        if (!displayTooltip) return;
        drawToolTip(context, x, y, 'top');
    }
</script>

<Layer {render} />