<script>
    import { sonarCommands } from "../../data/stores";
   async function toggleScan() {
    $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;
   }

</script>

<main>
    {#if !$sonarCommands.sonarData.runSonar}
        <button class='my-button' on:click={()=>toggleScan()}>START SCANNING</button>
    {:else}
        <button class='my-button' on:click={()=>toggleScan()}>STOP SCANNING</button>
    {/if}
</main>

<style>


    .my-button{
        color: #f8f0f0;
        background-color: #333333;
        width: 70vh;
        height: 80px;
        border-radius: 10px;
        border: none;
        text-align: center;
        margin-top: 100px;
        transition: all 0.3s ease;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: bold;
        font-size: 20px;
    }

    .my-button:hover{
        opacity: 0.8;
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
        cursor: pointer;
    }

    
    @media only screen and (max-width: 600px){
        .my-button{
            width: 50vh;
            font-size: 18px;
        }
    }


</style>