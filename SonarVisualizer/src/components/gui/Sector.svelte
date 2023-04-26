<script>
    import { onMount } from 'svelte';
    import { sonarCommands } from "../../data/stores";
  
    let minVal = 0;
    let maxVal = 180;


    $: leftProgressStyle = `left: ${minVal / 180 * 100}%`;
    $: rightProgressStyle = `right: ${100 - (maxVal / 180 * 100)}%`;
    $: progressStyle = `left: ${minVal / 180 * 100}%; right: ${100 - (maxVal / 180 * 100)}%;`;
   
    async function processDeg(inputDeg){
      let paddingToAdd=3-inputDeg.toString().length;
      let processedDeg="";
      for(let i=0;i<paddingToAdd;i++){
        processedDeg+="0";
      }
      processedDeg+=inputDeg.toString()
      return processedDeg;
    }
    async function setSector(){
      //Adds padding zero's to conform to command structure
      $sonarCommands.sonarData.sDeg1=await processDeg(minVal);
      $sonarCommands.sonarData.sDeg2=await processDeg(maxVal);
    }

    onMount(() => {
  const rangeInput = document.querySelector(".range-input");
  rangeInput.addEventListener('input', () => {
    // @ts-ignore
    minVal = parseInt(rangeInput.querySelector('.range-min').value);
    // @ts-ignore
    maxVal = parseInt(rangeInput.querySelector('.range-max').value);
    /*
    * Making sure the sector can not be set to less than 15 degrees
    * since it is the smallest range in which the ultrasonic sensors can
    * detect objects.
    */
    if (maxVal - minVal < 15) {
        if (minVal === 0) {
          maxVal = 15;
        } else if (maxVal === 180) {
          minVal = 180-15;
        } else {
          maxVal = minVal + 15;
        }
      }
  });
});

</script>
  
  <div class="wrapper">
    <p>Select sector</p>
    <div class="degree-input">
      <div class="field">
        <span>
          <p>Start degree</p>
          </span>
        <input on:change={()=>setSector()} type="number" class="input-min" min="0" max="180" bind:value={minVal}>
      </div>
      <div class="field">
        <span>
          <p>End degree</p>
         </span>

        <input on:change={()=>setSector()} type="number" class="input-max" min="15" max="180" bind:value={maxVal}>
      </div>
    </div>
    <div class="slider">
      <div class="progress" style={progressStyle}></div>
    </div>
    <div class="range-input">
      <input  on:change={()=>setSector()} type="range" class="range-min" min="0" max="180" bind:value={minVal}>
      <input  on:change={()=>setSector()} type="range" class="range-max" min="0" max="180" bind:value={maxVal}>
    </div>
  </div>
  
  
  <style>
    .wrapper {
      width: 100%;
      text-align: start;
      transition: all 0.2s ease;
    }

    span p{
      font-size: 14px;
    }
  
    .degree-input {
      width: 100%;
      display: flex;
      margin: 0px 10px 15px;
    }
  
    .degree-input .field {
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
    }
  
    .field input {
      width: 40%;
      height: 70%;
      outline: none;
      text-align: center;
      font-size: 16px;
      margin-left: 12px;
      border-radius: 20px;
      border: 0px black solid;
      -moz-appearance: none;
      -webkit-box-shadow: inset 0px 0px 28px 0px rgba(0,0,0,0.22);
      -moz-box-shadow: inset 0px 0px 28px 0px rgba(0,0,0,0.22);
      box-shadow: inset 0px 0px 28px 0px rgba(0,0,0,0.22);
    }
  
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

	.slider {
		position: relative;
		width: 100%;
		height: 10px;
		top: 50%;
		background-color:#D9D9D9 ;
    border-radius: 30px;
	}

    .slider .progress{
    height: 10px;
    left: 0%;
    right: 0%;
    position: absolute;
    border-radius: 30px;
    background:#007AFF ;
    }

    .range-input{
        position:relative;
    }
    
    .range-input input{
        background: none;
        -webkit-appearance: none;
        position:absolute;
        top: -28px;
        height: 40px;
        width: 100%;
        border-radius: 30px;
        cursor: pointer;
        pointer-events: none;
    }
    
    input[type="range"]::-webkit-slider-thumb{
    border-radius: 30px;
		width: 20px;
		height: 20px;
		background-color:#c3c1c1;
    -webkit-appearance: none;
    pointer-events: auto;
    
    }

    /*
    * Moz is required to make the slider usable for Firefox web browsers
    */
    input[type="range"]::-moz-range-thumb{
    border-radius: 30px;
		width: 20px;
		height: 20px;
		background-color:#c3c1c1;
    pointer-events: auto;
    border: 0;
    
    }
    
    @media only screen and (max-width: 600px) {
  .wrapper{
    width: 100%;
  }

  h2{
    font-size: 18px;
  }
  .field{
    font-size: 12px;
  }

}

</style>