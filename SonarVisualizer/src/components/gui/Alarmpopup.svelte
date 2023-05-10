<script>
    export let showModal = false;
    export let closeModal;
  
    function handleClose() {
      if (typeof closeModal === "function") {
        closeModal();
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
    }
  </style>
  
  {#if showModal}
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">Warning</div>
        <div class="modal-body">
          An object has been detected within an extremely dangerous range.
        </div>
        <button class="close-button" on:click="{handleClose}">Close</button>
      </div>
    </div>
  {/if}

  