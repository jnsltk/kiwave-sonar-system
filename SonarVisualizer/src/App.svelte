<script>
  // @ts-nocheck
  
   
import Sonar from './components/Sonar.svelte';
import MqttHandler from './components/mqtt/MqttHandler.svelte';

  </script>
  
  <main>

      <img src="KiWave.png" class="kiwave-logo" alt="KiWave logo">
    
    <MqttHandler/>
    <Sonar/>
    
  </main>
  
  <style>
    .kiwave-logo{
      width: 300px;
      height: 200px;
    }
  </style>
  