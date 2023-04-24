<script>
    /*
    This file shall bind all separate components into one single component.
    */
    
    import Console from "./gui/Console.svelte";
    import RadarScreen from "./gui/RadarScreen.svelte";
    import ToggleButton from "./gui/ToggleButton.svelte";
    import Range from "./gui/Range.svelte";
    import TestButton from "./gui/TestButton.svelte";
    import Sector from "./gui/Sector.svelte";
    import ScanButton from "./gui/ScanButton.svelte";
  

</script>

<!-- The order is arbitrary, feel free to modify. Ideally, create columns in separate divs -->
<div class="container">
    <div class="screen">
        <RadarScreen/>
    </div>
    <div class="controls">
        <Console/>
        <ToggleButton/>
        <Range/>
        <Sector/>
<<<<<<< HEAD
        <TestButton/>
=======
>>>>>>> 3191caa1d4a9555d28dd1b166d5161ace03960fd
        <ScanButton/>
    </div>
</div>
<style>
    .container {
        display: flex;
    }
    @media only screen and (max-width: 600px) {
        .container {
            flex-direction: column;
        }
    }
</style>