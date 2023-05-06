<script>
    import { sonarCommands, sonarStore } from "../../data/stores";
    import { onMount } from 'svelte';

    let status = 'Start';
    let animationStarted = false;
  
    async function startAnimation() {
      animationStarted = true;
    }
  
    //Start the animation and make the loader pulse
    onMount(() => {
      startAnimation();
    });

    async function toggleScan() {
        $sonarCommands.sonarData.runSonar=!$sonarCommands.sonarData.runSonar;
        $sonarStore.sonarStatus.lastCommandReceived = !$sonarStore.sonarStatus.lastCommandReceived;
        !$sonarCommands.sonarData.runSonar ? status = 'Start' : status = 'Stop';

    }
   
</script>

    <button id = "button" class='scan-button' class:recieved = "{!$sonarStore.sonarStatus.lastCommandReceived}" class:selected="{$sonarCommands.sonarData.runSonar}" on:click={()=>toggleScan()} disabled = {!$sonarStore.sonarStatus.lastCommandReceived}>
        <span class = "text">{status} scanning</span>
    </button>

    {#if !$sonarStore.sonarStatus.lastCommandReceived}

    <div class="container">
        {#if animationStarted}
        <div class="loader"></div>
        {/if}
        <p>KiWave is processing your command...</p>
    </div>  

    {/if}

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
    .recieved {
        background-color: #D9D9D9;
        color: #bcbcba; 
    }

    .recieved:hover {
        cursor:default;
        opacity:unset;
    }

    p {
      font-size: 16px;
      color: gray;
      text-align: center;
      margin-top: 50px;
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 35vh;
    }
  
    .loader {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: relative;
      animation: pulsing 1.5s ease-in-out infinite;
      background-color: #007aff;
    }
  
    .loader::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      opacity: 0.5s;
      animation: wave 2s ease-in-out infinite;
    }
  
    @keyframes pulsing {
      0% {
        transform: scale(0.8);
      }
      50% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.8);
      }
    }
  
    @keyframes wave {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4);
      }
      100% {
        transform: scale(1.5);
        box-shadow: 0 0 0 20px rgba(0, 122, 255, 0);
      }
    }

</style>
