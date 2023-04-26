<script>
  // @ts-nocheck
  
   
import Sonar from './components/Sonar.svelte';
import MqttHandler from './components/mqtt/MqttHandler.svelte';
import ModeSwitch from './components/gui/ModeSwitch.svelte';

  </script>
  
  <main> 
       
    <MqttHandler/>
    <Sonar/>
    <div class="modeswitch">
      <ModeSwitch/>  
    </div>
    

  </main>
  
  <style>

.modeswitch {
        position: absolute;
        top: 0.3rem;
        right: 2rem;

    }
  </style>
  