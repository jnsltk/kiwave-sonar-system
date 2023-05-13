<script>
  import { sonarStore, darkModeSwitch, notificationStore } from "../../data/stores";

  const ALARM_DISTANCE_THRESHOLD = 5;

  let alarmAudio = null;
  let showWarningModal = false;
  let showModalMessage = "";

  async function triggerAlarm() {
    if (showWarningModal) return;

    showWarningModal = true;
    showModalMessage = "An object has been detected within an extremely close range.";

    playAlarmSound();
  }

  $: if ( $sonarStore.sonarData && $notificationStore ) {
    let { rRange1, rRange2 } = $sonarStore.sonarData;

    if (
      (parseFloat(rRange1) <= ALARM_DISTANCE_THRESHOLD && parseFloat(rRange1) > 0) ||
      (parseFloat(rRange2) <= ALARM_DISTANCE_THRESHOLD && parseFloat(rRange2) > 0)
    ) {
      triggerAlarm();
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

  function closeModal() {
    stopAlarmSound();
    showWarningModal = false;
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

  .modal.dark-mode {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .modal-content {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    width: 80%;
    max-width: 500px;
  }

  .modal-content.dark-mode {
    background-color: #333;
    color: #fff;
  }

  .modal-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .modal-body {
    font-size: 18px;
  }

  .close-button {
    background-color: #007AFF;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-size: 18px;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
		margin-left: 400px;
		margin-top: 20px;
  }
</style>

{#if showWarningModal}
  <div class={$darkModeSwitch.isDark ? 'modal dark-mode' : 'modal'}>
    <div class={$darkModeSwitch.isDark ? 'modal-content dark-mode' : 'modal-content'}>
      <div class="modal-header">
        Warning
      </div>
      <div class="modal-body">
        {showModalMessage}
        <button class="close-button" on:click={closeModal}>Close</button>
      </div>
    </div>
  </div>
{/if}

