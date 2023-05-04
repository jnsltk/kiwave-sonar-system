<script>
// @ts-nocheck

    import { sonarCommands,sonarStore } from "../../data/stores";
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
    let clearedBootInterval=false;
    let lastTrackingKeepAlive=0;
    let notWaiting=true;
    let trackingWatcher;
    async function startTrackingWatcher(){
        trackingWatcher=setInterval(async function(){
        let timePassed=parseInt(Date.now()/1000)-$sonarStore.sonarData.trackingReportedAt;
        if(timePassed>5){
            clearInterval(trackingWatcher);
            $sonarStore.sonarData.isTracking=false;
            notWaiting=true;
        }
    })
    }

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
    <div class="mt-2">

        <button	class="{$sonarStore.sonarData.isTracking === true ? 'selected' : ''}" on:click={()=>toggleTrackMode()}>
            {#if $sonarCommands.sonarData.trackMode && notWaiting}
            Enable trackmode
            {:else if !$sonarStore.sonarData.isTracking}
            Awaiting...
            {:else}
            Disable trackmode
            {/if}
        </button>
  

    </div>
      <style>

        .mt-2{
            margin-top:2rem;
        }
        button{
            float: right;
            color: #f8f0f0;
    background-color: #007AFF;
    font-family: 'Inter', sans-serif;
    border-radius: 20px;
    border: none;
    text-align: center;
    transition: all 0.2s ease;
    font-size: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top:0.3rem;
    padding-bottom: 0.3rem;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        }
        .selected {
        background-color: #D9D9D9;
        color: #007AFF;
        box-shadow: unset;
    }
    </style>