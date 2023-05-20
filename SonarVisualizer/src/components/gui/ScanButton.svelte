<script>
    import { sonarCommands, sonarStore } from "../../data/stores";
    import LoadingScene from "./LoadingScene.svelte";
 
    let status = !$sonarCommands.sonarData.runSonar ?'Start scanning' :'Stop scanning';
    let watchInterval;
    let watcherActive=false;
    async function startWatchInterval(){
        /*
        * The watch interval checks if the sonar has received the command. If it has not we will simply exit the interval callback.
        * If it has received the command we change the button label to the appropriate value and then disable the interval.
        */
        watcherActive=true;
        watchInterval=setInterval(async function(){
            if($sonarStore.sonarStatus.lastCommandReceived==false) return;
            clearInterval(watchInterval);
            !$sonarCommands.sonarData.runSonar ? status = 'Start scanning' : status = 'Stop scanning';
            watcherActive=false;
        },100)
    }

    async function toggleScan() {
        /*
        * When the user toggle's the scan button we assume that the sonar has not yet received the command,
        * hence we set lastCommandReceived to false. It will be switched back by the MqttHandler once it receives the command.
        * Then we toggle the previous value of runSonar and change the status to awaiting for visual purposes while starting the watchInterval.
        */
        $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;
        $sonarStore.sonarStatus.lastCommandReceived = false;
        status="Awaiting...";
        startWatchInterval()
    }
   
</script>

    <button id = "button" class='scan-button' class:received = "{watcherActive}" class:selected="{$sonarCommands.sonarData.runSonar}" on:click={()=>toggleScan()} disabled = {watcherActive}>
        <span class = "text">
            {status}
        </span>
    </button>


    <style>

    .scan-button{
        color: #f8f0f0;
        background-color: #007AFF;
        font-family: 'Inter', sans-serif;
        width: 85%;
        height: 80px;
        border-radius: 20px;
        border: none;
        text-align: center;
        margin-top: 3rem;
        margin-bottom: 1rem;
        transition: all 0.2s ease;
        font-size: 20px;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }

    @media screen and (max-width:600px){
       .scan-button{ 
        width:90%; 
        margin-bottom: 50px;
        }
    }

    .scan-button:hover{
        opacity: 0.8;
        cursor: pointer;
    }
    
    .selected {
        background-color: #D9D9D9;
        color: #007AFF;
        box-shadow: unset;
    }
    .received {
        background-color: #D9D9D9;
        color: #bcbcba; 
    }

    .received:hover {
        cursor:default;
        opacity:unset;
    }

</style>
