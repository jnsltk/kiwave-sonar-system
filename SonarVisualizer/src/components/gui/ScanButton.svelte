<script>
    import { sonarCommands } from "../../data/stores";

    let status = 'Start';


    async function toggleScan() {
        $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;

        !$sonarCommands.sonarData.runSonar ? status = 'Start' : status = 'Stop';

    }
   
</script>
 
    <button class='scan-button' class:selected="{$sonarCommands.sonarData.runSonar}" on:click={()=>toggleScan()}>{status} scanning</button>

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


</style>
