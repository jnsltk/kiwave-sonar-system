<script>
    import { onMount } from 'svelte';
    import { sonarCommands } from "../../data/stores";
    import { degreeToServoDegree, padDeg } from '../../degrees/degrees';
  
    //Initial start and end degree values for the sector.
    let startDegree = 0;
    let endDegree = 180;

    let inputStartDeg;
    let inputEndDeg;

    // Reactive statement to update the displayed start and end degree values.
    $: displatedStartDeg = startDegree;
    $: displayedEndDeg =  endDegree;

  //Check the new end degree value input.
  function checkEndDeg(inputElem) {
    let newEndDegree = parseInt(inputElem.value);

    //The end degree can not be more than 180.
    if (newEndDegree > 180) {
      newEndDegree = 180;
    }

    //The minimum difference between the start and end can be 15 degrees.
    if (newEndDegree - startDegree < 15) {
      if (startDegree === 0) {
        newEndDegree = 15;
      } else if (newEndDegree === 180) {
        startDegree = 180 - 15;
      } else {
        newEndDegree = startDegree + 15;
      }
    }

    inputElem.value = newEndDegree;
    endDegree = newEndDegree;
  }

  //Check the new start degree input.
  function checkStartDegree(inputElem) {
    let newstartDegree = parseInt(inputElem.value);

    //The minimum value for start degree is 0.
    if (newstartDegree < 0) {
      newstartDegree = 0;
    }

    //The minimum difference between the start and end can be 15 degrees.
    if (endDegree - newstartDegree < 15) {
      if (newstartDegree === 0) {
        endDegree = 15;
      } else if (endDegree === 180) {
        newstartDegree = 180 - 15;
      } else {
        endDegree = newstartDegree + 15;
      }
    }

    inputElem.value = newstartDegree;
    startDegree = newstartDegree;
  }

    //Calculate the progress that will be shown on the slider based on the initial start and end degrees.
    $: progressStyle = `left: ${startDegree / 180 * 100}%; right: ${100 - (endDegree / 180 * 100)}%;`;
   


    // Set the sector by updating sonarCommands with the processed degrees
    async function setSector(){
      //Adds padding zero's to conform to command structure.
      $sonarCommands.sonarData.sDeg2=await padDeg(await degreeToServoDegree(startDegree));
      $sonarCommands.sonarData.sDeg1=await padDeg(await degreeToServoDegree(endDegree));
    }

    onMount(() => {
  const rangeInput = document.querySelector(".sector-input");
  rangeInput.addEventListener('input', () => {
    // @ts-ignore
    startDegree = parseInt(rangeInput.querySelector('.sector-start').value);
    // @ts-ignore
    endDegree = parseInt(rangeInput.querySelector('.sector-end').value);
    /*
    * Making sure the sector can not be set to less than 15 degrees
    * since it is the smallest range in which the ultrasonic sensors can
    * detect objects.
    */
    if (endDegree - startDegree < 15) {
        if (startDegree === 0) {
          endDegree = 15;
        } else if (endDegree === 180) {
          startDegree = 180-15;
        } else {
          endDegree = startDegree + 15;
        }
      }
  });
});

</script>
  
  <div class="wrapper">
    <p>Select sector</p>
    <div class="degree-input">
      <div class="field">
        <span><p>Start degree</p></span>
        <input on:change={()=>setSector()}  on:blur={(e)=>checkStartDegree(e.target)} type="number" class="input-min" min="0" max="180"  value={startDegree} bind:this={inputStartDeg}>
      </div>
      <div class="field">
        <span>
          <p>End degree</p>
         </span>

        <input on:change={()=>setSector()} on:blur={(e)=>checkEndDeg(e.target)} type="number"  class="input-max" min="15" max="180" value={endDegree} bind:this={inputEndDeg}>
      </div>
    </div>
    <div class="slider">
      <div class="progress" style={progressStyle}></div>
    </div>
    <div class="sector-input">
      <input  on:change={()=>setSector()} type="range" class="sector-start" min="0" max="180" bind:value={displatedStartDeg}>
      <input  on:change={()=>setSector()} type="range" class="sector-end" min="0" max="180" bind:value={displayedEndDeg}>
    </div>
  </div>
  
  
  <style>
    .wrapper {
      width: 100%;
      text-align: start;
      transition: all 0.2s ease;
    }

    :is(span p){
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

    .sector-input{
        position:relative;
    }
    
    .sector-input input{
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