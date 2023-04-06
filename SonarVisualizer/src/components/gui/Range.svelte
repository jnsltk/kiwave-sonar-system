<script>
    import { onMount } from 'svelte';
    
    let sliderValue = 1;
    
    onMount(() => {
      const slider = document.getElementById('myRange');
      slider.addEventListener('input', (event) => {
        sliderValue = event.target.value;
      });
      slider.addEventListener("mousemove", function(){
        var x = slider.value;
        var color = 'linear-gradient(90deg, #D9D9D9 ' + 0.4*x + '%, #585858 ' + 0.4*x + '%)';
        slider.style.background = color;
      });
    });
  </script>
  
  <main>
    <div class="slideContainer">
      <p>RANGE: <span>{sliderValue}</span> CM</p>
      <input type="range" min="1" max="250" bind:value={sliderValue} id="myRange" class="slider"> 
    </div>
  </main>
    
<style>
    .slideContainer{
        width: 500px;
        height: 90px;
        text-align: left;
    }



    p{
        font-family: 'Gloock', serif;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: bold;
        color: black;
        font-size: 20px;
        margin-left: 10px;
    }
    .slider{
        -webkit-appearance: none;
        width: 100%;
        height: 40px;
        background: linear-gradient(90deg, #585858 60%, #585858 60%);
        border-radius: 30px;
        border: 1px black solid;
        outline: none;
        -webkit-transition: 0.2s;
    }

    .slider:hover{
        opacity: 1;
    }

    .slider::-webkit-slider-thumb{
        -webkit-appearance: none;
        width: 55px;
        height: 55px;
        background-color:#D9D9D9;
        border-radius: 30px;
        border: 1px black solid;
        cursor: pointer;
    }

    .slider::-moz-range-thumb{
        width: 40px;
        height: 40px;
        background-color:#D9D9D9;
        cursor: pointer;
    }

    

  @import url('https://fonts.googleapis.com/css2?family=Gloock&family=IBM+Plex+Sans:wght@700&display=swap');


</style>