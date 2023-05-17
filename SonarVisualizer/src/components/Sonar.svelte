<script>
    /*
    This file shall bind all separate components into one single component.
    */
    import RadarScreen from "./gui/RadarScreen/RadarScreen.svelte";
    import Range from "./gui/Range.svelte";
    import Sector from "./gui/Sector.svelte";
    import ScanButton from "./gui/ScanButton.svelte";
    import TrackMode from "./gui/TrackMode.svelte";
    import TrackModeTooltip from "./gui/TrackModeTooltip.svelte";
    import ModeSwitch from "./gui/ModeSwitch.svelte";
</script>

<div class="header">
        <img src="KiWave-dark.png" class="kiwave-dark" alt="KiWave logo">
        <img src="KiWave-light.png" class="kiwave-light" alt="KiWave logo">
        <div class="modeswitch">
            <ModeSwitch/>  
        </div>
    </div>
    <div class="container">
    
    <div class="screen">
        <RadarScreen/>
    </div>
    
    <div class="controls">
        <div class="group-sliders" id ="group-sliders">
            <div class="track-mode">
            <TrackMode/>
            <TrackModeTooltip/>
            </div>
            <Range/>
            <Sector/>
        </div>
        <ScanButton/>
    </div>
   
    
      
</div>
<style>
 
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 96%;
    }

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
        padding-left: 20px;
    }

    .controls {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }
 
    .kiwave-dark{
      display: none;
    }
    .kiwave-light{
      width: 110px;
      height: 45px;
      padding-top: 10px;
      padding-left: 15px;
    }
   
    .group-sliders {
        padding: 1.8rem;
        border-radius: 20px;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        width:80%;
    }

    .track-mode {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }
    @media only screen and (max-width: 1350px) {
       .controls{
        margin-top: 100px;
        transition: 0.2s;
       }

    } 

    @media only screen and (max-width: 1000px) {
        .container {
            flex-direction: column;
            transition: 0.2s;
        }
        .controls {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 0px;
            transition: 0.2s;
        }
        .screen {
            padding-right: 0;
            padding-bottom: 20px;
            padding-left: 0;
        } 

    }

   

   


</style>
