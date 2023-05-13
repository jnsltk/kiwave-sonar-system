<script>
   import { notificationStore } from "../../data/stores";

let notificationEnabled = true;
  
function toggleNotification() {
  notificationEnabled = !notificationEnabled;
  notificationStore.set(notificationEnabled); // set the state in the store
}

</script>
  
<button class='notification-button' on:click="{toggleNotification}">
    <span class="text">{notificationEnabled ? 'Turn off notification' : 'Turn on notification'}</span>
</button>
  
<style>
    .notification-button {
      color: #f8f0f0;
      background-color: #007AFF;
      font-family: 'Inter', sans-serif;
      width: 190px;  
      height: 35px;  
      border-radius: 10px;
      border: none;
      text-align: center;
      margin-right: 5rem;
      margin-bottom: 1rem;
      margin-left: 80rem;
      transition: all 0.2s ease;
      font-size: 1rem;
      box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }
  
    @media screen and (max-width:600px) {
      .notification-button {
        width:90%; 
        margin-bottom: 50px;  
      }
    }
  
    .notification-button:hover {
      opacity: 0.8;
      cursor: pointer;
    }
</style>
