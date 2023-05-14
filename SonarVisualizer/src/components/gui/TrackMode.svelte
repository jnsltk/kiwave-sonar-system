<script>
// @ts-nocheck
    
    import { sonarCommands,sonarStore } from "../../data/stores";

    /*
    * Used to toggle the activation and deactivation of track mode.
    */
    async function toggleTrackMode(){
        if(!clearedBootInterval) {
            clearInterval(onMountWatcher);
            clearedBootInterval=true;
        }
        notWaiting=false;
        $sonarCommands.sonarData.trackMode=!$sonarCommands.sonarData.trackMode;

        clearInterval(trackingWatcher);
        startTrackingWatcher()

    }
    let clearedBootInterval=false; //In the beginning of the program we run an interval to check if tracking mode is already enabled.
    let notWaiting=true; //Boolean flag used to check if we are waiting for the sonar to switch its mode on the Wio terminal to track mode.
    let trackingWatcher; //Used to refer the interval that reports if the sonar is in tracking mode.
    async function startTrackingWatcher(){
        trackingWatcher=setInterval(async function(){
        let timePassed=parseInt(Date.now()/1000)-$sonarStore.sonarData.trackingReportedAt;
        if(timePassed>5){
            //If more than 5 seconds have passed, we can regard the track mode has been disabled.
            clearInterval(trackingWatcher);
            $sonarStore.sonarData.isTracking=false;
            notWaiting=true;
        }
    })
    }
    /*
    * This checks if the sonar activates its tracking mode. If it does we need to start the trackingWathcer.
    */
    let onMountWatcher=setInterval(async function(){
        if($sonarStore.sonarData.isTracking){
            clearInterval(onMountWatcher);
            clearedBootInterval=true;
            notWaiting=false;
            $sonarCommands.sonarData.trackMode=false;
            startTrackingWatcher()
        }
    },1000)

</script>
    

        <button	class="{$sonarStore.sonarData.isTracking === true ? 'selected' : ''}" on:click={()=>toggleTrackMode()}>
            <!-- If the sonar is in track mode and is not waiting for anything to happen we are in the base case -->
            {#if $sonarCommands.sonarData.trackMode && notWaiting}
            Enable trackmode
            <!-- If the sonar is not currently tracking but notWaiting is false then we are awaiting confirmation -->
            {:else if !$sonarStore.sonarData.isTracking}
            Awaiting...
            {:else}
            <!-- Track mode is enabled, so we give the option to disable it. -->
            Disable trackmode
            {/if}
        </button>


      <style>


        button{
            float: right;
            color: #f8f0f0;
            background-color: #007AFF;
            font-family: 'Inter', sans-serif;
            border-radius: 10px;
            border: none;
            text-align: center;
            transition: all 0.2s ease;
            font-size: 1rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            padding-top:0.3rem;
            padding-bottom: 0.3rem;
            box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
            cursor: pointer;
                }
            .selected {
            background-color: #D9D9D9;
            color: #007AFF;
            box-shadow: unset;
        }
        
    </style>