<script>
    import { Layer } from "svelte-canvas";

    export let x = 0;
    export let y = 0;
    export let value;
    export let displayTooltip = true;

    const width = 100;
    const height = 40;

    $: text = (value != null) ? `Distance: ${Math.floor(value.dist)} \nDegree: ${Math.floor(value.deg)}` : "";

    console.log(x, y, value)
</script>

<div 
    class="arrowBox"
    style="
        --after-border: {height / 4}px;
        --after-margin-right: {-width / 10}px;
        width: {width}px;
        height: {height}px;
        line-height: {height / 3}px;
        left: {x - width / 2}px;
        top: {y - height * 2 - 30}px;
        display:{(displayTooltip) ? "block" : "none"};
    ">
    {text}
</div>

<style>
    .arrowBox {
        z-index: 10;
        background-color: #252525;
        border-radius: 2px;
        position: absolute;
        font-size: 0.725em;
        font-weight: 200;
        color: white;
        text-align: center;
        padding-top: 12px;
        left: 500px;
    }
    .arrowBox:before {
        content: " ";
        z-index: 10;
        width: 0px;
        height: 0px;
        border-top: var(--after-border) solid #252525;
        border-left: var(--after-border) solid transparent;
        border-bottom: var(--after-border) solid transparent;
        border-right: var(--after-border) solid transparent;
        border-radius: 2px;
        position: absolute;
        right: 50%;
        top: 100%;
        margin-right: var(--after-margin-right);
  }
</style>