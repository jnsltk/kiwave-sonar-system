

<script>
    import { sonarCommands } from "../../data/stores";
    let start=true;
    async function toggleStart(){
        $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;
        console.log($sonarCommands.sonarData.runSonar)
    }
</script>
<button on:click={()=>toggleStart()}>Start/Stop</button>