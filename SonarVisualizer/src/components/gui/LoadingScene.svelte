<script>
    import { onMount } from 'svelte';

    let animationStarted = false;
  
    function startAnimation() {
      animationStarted = true;
    }
  
    //Start the animation and make the loader pulse
    onMount(() => {
      startAnimation();
    });
  </script>
  
  <div class="container">
    {#if animationStarted}
      <div class="loader"></div>
    {/if}
    <p>Hold on! <br> KiWave is connecting...</p>
  </div>
  
  <style>
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
      height: 100vh;
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
  
