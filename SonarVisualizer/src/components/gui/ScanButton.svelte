<script>
    import { sonarCommands } from "../../data/stores";
   async function toggleScan() {
    $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;
   }

</script>

<main>
    {#if !$sonarCommands.sonarData.runSonar}
        <button class='my-button' on:click={()=>toggleScan()}>Start scanning</button>
    {:else}
        <button class='my-button' on:click={()=>toggleScan()}>STOP SCANNING</button>
    {/if}
</main>

<style>


    .my-button{
        color: #f8f0f0;
        background-color: #007AFF;
        width: 80%;
        height: 80px;
        border-radius: 30px;
        border: none;
        text-align: center;
        margin-top: 50px;
        margin-bottom: 50px;
        transition: all 0.2s ease;
        font-size: 20px;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }

    .my-button:hover{
        opacity: 0.8;
        cursor: pointer;
    }

    
    @media only screen and (max-width: 600px){
        .my-button{
            width: 50vh;
            font-size: 18px;
        }
    }


</style>