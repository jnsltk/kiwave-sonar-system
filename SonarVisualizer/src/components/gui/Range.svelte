<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { sonarStore,sonarCommands } from "../../data/stores";
    let sliderValue = 1;
    
    //The range that is given automatically is 100
    let range = $sonarCommands.sonarData.sRange;
    async function setRange(){
      //Adds padding zero's to conform to command structure
      let paddingToAdd=3-range.toString().length;
      let processedRange="";
      for(let i=0;i<paddingToAdd;i++){
        processedRange+="0";
      }
      processedRange+=range.toString();
      $sonarCommands.sonarData.sRange=processedRange;

    }
  </script>
  
  <main>
    <div class="slideContainer">
      <!-- svelte-ignore a11y-unknown-role -->
      <p role="label" >Range: <span>{range}</span> cm</p>
      <!-- svelte-ignore a11y-no-abstract-role -->
      <input on:change={()=>setRange()} type="range" data-testid="range" min="1" max="220" bind:value={range} id="myRange" class="slider"  style:background={`linear-gradient(90deg,#007AFF  ${100/220 * range}%,#D9D9D9  ${100/220 * range}%)`} > 
    </div>
  </main>
    
<style>
    .slideContainer{
        width: 100%;
        height: 90px;
        text-align: left;
        transition: all 0.2s ease;
        
    }

    .slider{
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 30px;
        outline: none;
        -webkit-transition: 0.2s;
        
    }

    .slider:hover{
        opacity: 1;
    }

    .slider::-webkit-slider-thumb{
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background-color:#c3c1c1;
        border-radius: 30px;
        cursor: pointer;
    }

    /*
    * Moz is required to make the slider usable for Firefox web browsers.
    */
    .slider::-moz-range-thumb{
        width: 20px;
        height: 20px;
        background-color:#c3c1c1;
        border-radius: 30px;
        cursor: pointer;
        border: 0;
    }

  
    


</style>