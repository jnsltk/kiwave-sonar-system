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
        margin-top: 25px;
        color: #F5F5F5;
        background-color: #333333;
        width: 400px;
        height: 100px;
        border-radius: 10px;
        border: none;
        text-align: center;

        font-weight: bold;
        transition: all 0.3s ease;
    }

    .my-button:hover{
        opacity: 0.8;
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
        cursor: pointer;
    }

    
    @media only screen and (max-width: 600px){
        .my-button{
            width: 90%;
            font-size: 20px;
        }
    }


</style>