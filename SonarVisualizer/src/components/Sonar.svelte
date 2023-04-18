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
    

</script>

<!-- The order is arbitrary, feel free to modify. Ideally, create columns in separate divs -->
<RadarScreen/>
<Console/>
<ToggleButton/>
<Range/>
<Sector/>
<TestButton/>
<style>


</style>