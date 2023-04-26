<script>
    /*
    This file binds all separate components into one single component.
    */
    
    import Console from "./gui/Console.svelte";
    import RadarScreen from "./gui/RadarScreen.svelte";
    import Range from "./gui/Range.svelte";
    import Sector from "./gui/Sector.svelte";
    import ScanButton from "./gui/ScanButton.svelte";

  

</script>



<div class="container">

    <div class="screen">
        <img src="KiWave.png" class="kiwave-logo" alt="KiWave logo">
        <RadarScreen/>
    </div>

    <div class="controls">
    
        <div class="group-sliders">
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
        justify-content: center;
    }

    .screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
        padding-right: 50px;
    }

    .controls {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .kiwave-logo{
      width: 110px;
      height: auto;
    }

    .group-sliders {
        padding: 1.8rem;
        border-radius: 30px;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        width:80%;
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