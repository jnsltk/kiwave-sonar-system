<script>
  // @ts-nocheck
  
import {fade } from "svelte/transition";
import Sonar from './components/Sonar.svelte';
import MqttHandler from './components/mqtt/MqttHandler.svelte';
import LoadingScene from './components/gui/LoadingScene.svelte';
import {sonarStore} from "./data/stores";
import WarningModal from './components/gui/WarningModal.svelte';

$:sonarIsOnline = $sonarStore.sonarStatus.isOnline;

</script>

<main> 
   <MqttHandler/>
   <WarningModal/>
  {#if sonarIsOnline}
  <div transition:fade>
    <Sonar/>
  </div>
  {:else}
   <!-- If the sonar is not connected, show the loading scene -->
    <div class="loader" transition:fade>
      <LoadingScene/>
    </div>
  {/if}

</main>

<style>


    .loader {
    position: fixed;
    background-color: #eef1ec;
    height: 100%;
    width: 100%;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>