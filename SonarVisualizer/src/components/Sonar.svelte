<script>
    /*
    This file shall bind all separate components into one single component.
    */
    
    import Console from "./gui/Console.svelte";
    import RadarScreen from "./gui/RadarScreen/RadarScreen.svelte";
    import Range from "./gui/Range.svelte";
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
        <Range/>
        <Sector/>
        <ScanButton/>
    </div>
   
</div>
<style>
    .container {
        display: flex;
        justify-content: center;
        gap: 10rem;
        margin-top:2rem
    }

    .controls{
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        padding:2rem;
        border-radius:30px;


    }
    @media only screen and (max-width: 600px) {
        .container {
            flex-direction: column;
            gap:0rem;
        }
        .controls{
            margin-left: 2rem;
            margin-right: 2rem;
            padding:1rem;
        }

      
    }
</style>