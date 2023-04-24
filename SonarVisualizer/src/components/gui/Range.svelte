<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { sonarStore,sonarCommands } from "../../data/stores";
    let sliderValue = 1;
    
    let range="100";
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
      <p>RANGE: <span>{range}</span> CM</p>
      <input on:change={()=>setRange()} type="range" min="1" max="250" bind:value={range} id="myRange" class="slider"  style:background={`linear-gradient(90deg, #D9D9D9 ${0.4 * range}%, #585858 ${0.4 * range}%)`} > 
    </div>
  </main>
    
<style>
    .slideContainer{
        width: 500px;
        height: 90px;
        text-align: left;
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
        width: 50px;
        height: 50px;
        background-color:#D9D9D9;
        border-radius: 30px;
        border: 1px black solid;
        cursor: pointer;
    }

    .slider::-moz-range-thumb{
        width: 50px;
        height: 50px;
        background-color:#D9D9D9;
        border-radius: 30px;
        border: 1px black solid;
        cursor: pointer;
    }

    @media only screen and (max-width: 600px) {
  .slideContainer {
    width: 85%;
    height: 100%;
  }
  
  p {
    font-size: 18px;
  }
  
}
    


</style>