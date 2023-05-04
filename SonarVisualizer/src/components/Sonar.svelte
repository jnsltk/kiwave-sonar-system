<script>
    /*
    This file shall bind all separate components into one single component.
    */
    
    import RadarScreen from "./gui/RadarScreen/RadarScreen.svelte";
    import Range from "./gui/Range.svelte";
    import Sector from "./gui/Sector.svelte";
    import ScanButton from "./gui/ScanButton.svelte";
    import TrackMode from "./gui/TrackMode.svelte";
  

</script>

<!-- The order is arbitrary, feel free to modify. Ideally, create columns in separate divs -->
<div class="container">
    <div class="screen">

        <img src="KiWave-dark.png" class="kiwave-dark" alt="KiWave logo">
        <img src="KiWave-light.png" class="kiwave-light" alt="KiWave logo">
        <RadarScreen/>
    </div>
    
    <div class="controls">
        <div class="group-sliders" id ="group-sliders">
            <TrackMode/>
            <Range/>
            <Sector/>
        </div>

        <ScanButton/>
    </div>
   
</div>
<style>
 
 .container {
        display: flex;
        flex-direction: row;
        align-items: center;

    }

    .screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .controls {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }
 
    .kiwave-dark{
      width: 0;
    }
    .kiwave-light{
      width: 110px;
      height: auto;
      padding-top: 10px;
    }
   
   

    .group-sliders {
        padding: 1.8rem;
        border-radius: 20px;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        width:80%;
    }

    .group-sliders-dark {
    background-color: #333;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 4px 16px 0px, rgba(0, 0, 0, 0.3) 0px 0px 0px 1px;
    }

    @media only screen and (max-width: 600px) {
        .container {
            flex-direction: column;
        } 
        .screen {
            padding-right: 0;
        }   
    }
    @media only screen and (max-width: 1000px) {
        .container {
            flex-direction: column;
        }
        .controls {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .screen {
            padding-right: 0;
        } 

    }


</style>
