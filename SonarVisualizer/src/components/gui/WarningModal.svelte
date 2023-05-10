<script>
    import { sonarStore } from "../../data/stores";
    
    const ALARM_DISTANCE_THRESHOLD = 10; // set the distance threshold to 20cm
    const NOTIFICATION_DISTANCE_THRESHOLD = 20; // set the distance threshold for notification to 30cm
    const AUTO_CLOSE_DURATION = 4000; // auto close duration in milliseconds
    
    let alarmAudio = null;
    let showWarningModal = false;
    let showModalMessage = "";
    
    let alarmPlaying=false;
    async function triggerAlarm(){
      if(alarmPlaying) return;
      alarmPlaying=true;

      playAlarmSound();
        showModalMessage = "An object has been detected within an extremely close range.";
        showWarningModal = true;
        setTimeout(() => {
          stopAlarmSound();
          showWarningModal = false;
        }, AUTO_CLOSE_DURATION);

        setTimeout(async function(){
          alarmPlaying=false;
        },6000)
    }

    $: if ($sonarStore.sonarData) {
      let { rRange1, rRange2 } = $sonarStore.sonarData;

      if ((parseFloat(rRange1) <= ALARM_DISTANCE_THRESHOLD && parseFloat(rRange1)>0) || (parseFloat(rRange2) <= ALARM_DISTANCE_THRESHOLD && parseFloat(rRange2)>0)) {
        triggerAlarm()
      } 
    }
    
    function playAlarmSound() {
      alarmAudio = new Audio("alarm.mp3");
      alarmAudio.play();
    }
    
    function stopAlarmSound() {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }
    }
  </script>
  
  <style>
    .modal {
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .modal-content {
      background-color: white;
      border-radius: 12px;
      padding: 20px;
      width: 80%;
      max-width: 500px;
    }
  
    .modal-header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  
    .modal-body {
      font-size: 18px;
      margin-bottom: 20px;
    }
  </style>
  
  
  {#if showWarningModal}
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">Warning</div>
        <div class="modal-body">
          {showModalMessage}
        </div>
      </div>
    </div>
  {/if}
  