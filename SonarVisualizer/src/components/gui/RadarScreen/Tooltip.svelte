<script>
    import { Layer } from "svelte-canvas";
    import { darkModeSwitch } from "../../../data/stores";
    import { sonarCommands } from "../../../data/stores";
    import { mapDistance } from "./utils";

    export let x = 0;
    export let y = 0;
    export let value;
    export let displayTooltip = true;
    export let screenRadius;

    /*
    * This component has the responsibility of creating tooltips on the 
    * radar screen showing the degree and distance of from where the user clicked.
    */

    const tooltipWidth = 88;
    const tooltipHeight = 60;

    // Object containing the different positions of the tooltip based on which direction its arrow is pointing
    const tooltipDimensions = {
        /*
        * The arrow on the box sometimes need to be positioned in other places, therefore we need to make
        * calculations for all the possible places of where the arrow can be.
        */
        arrowBottom: (x, y) => {
            return {
                tooltipX: x - tooltipWidth / 2,
                tooltipY: y - tooltipHeight,
                arrowStartX: x - 7,
                arrowStartY: y - 8,
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
        arrowLeft: (x, y) => {
            return {
                tooltipX: x - tooltipWidth - 8,
                tooltipY: y - (tooltipHeight - 8) / 2,
                arrowStartX: x - 8,
                arrowStartY: y + 7,
                arrowEndX: x - 8,
                arrowEndY: y - 7,
                textX: x - tooltipWidth / 2 - 40,
                textY: y - tooltipHeight + 56
            }
        },
        arrowRight: (x, y) => {
            return {
                tooltipX: x  + 8,
                tooltipY: y - (tooltipHeight - 8) / 2,
                arrowStartX: x + 8,
                arrowStartY: y + 7,
                arrowEndX: x + 8,
                arrowEndY: y - 7,
                textX: x + 18,
                textY: y - tooltipHeight + 56
            }
        }
    }

    // Set the tooltip colors based on the value of the darkmode switch
    $: tooltipColor = ($darkModeSwitch.isDark) ? "#161616" : "#eef1ec";
    $: fontColor = ($darkModeSwitch.isDark) ? "#fff" : "#000";

    /**
     * Draws the correct tooltip based on the direction passed to it, using the neccessary function in the tooltipDimensions object
     * @param context The graphical context of the canvas element
     * @param x The x coordinate of the tip of the tooltip's arrow
     * @param y The y coordinate of the tip of the tooltip's arrow
     * @param direction The direction of the tooltip's arrow
     */
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
                tooltip = tooltipDimensions.arrowLeft(x, y);
                break;
            case 'right':
                tooltip = tooltipDimensions.arrowRight(x, y);
                break;
        }
        /*
        * Context code to draw the tooltip.
        */
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

    /**
     * Renders the Tooltip component to the Canvas element. The Tooltip component shows information about any point on the radar
     * screen that the user hovers over. This data includes the distance from the sensor, and the measurement angle.
     * By declaring this function reactively, we make sure svelte-canvas re-render anytime the values the function depends on change. 
     * @param context The 2D rendering context of the Canvas element
     */
    $: render = ({context}) => {
        if (!displayTooltip) return;
        let direction;
        /*
        * Here we have some breakpoints that tell us in what direction we need to position the arrow.
        */
        if (mapDistance(value.dist, $sonarCommands.sonarData.sRange, screenRadius) + tooltipHeight - 25 > screenRadius
            && (value.deg < 30 || value.deg > 330)) {
            direction = 'top';
        } else if (mapDistance(value.dist, $sonarCommands.sonarData.sRange, screenRadius) + tooltipWidth / 2 - 25 > screenRadius
            && value.deg > 60 && value.deg < 120) {
            direction = 'left';
        } else if (mapDistance(value.dist, $sonarCommands.sonarData.sRange, screenRadius) + tooltipWidth / 2 - 25 > screenRadius
            && value.deg > 240 && value.deg < 300) {
            direction = 'right';
        } else {
            direction = 'bottom'
        }
        drawToolTip(context, x, y, direction);
    }
</script>

<Layer {render} />