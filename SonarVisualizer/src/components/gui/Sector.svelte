<script>
    import { onMount } from 'svelte';
  
    let minVal = 0;
    let maxVal = 360;
  
    $: leftProgressStyle = `left: ${minVal / 360 * 100}%`;
    $: rightProgressStyle = `right: ${100 - (maxVal / 360 * 100)}%`;
    $: progressStyle = `left: ${minVal / 360 * 100}%; right: ${100 - (maxVal / 360 * 100)}%;`;
  
    onMount(() => {
  const rangeInput = document.querySelector(".range-input");
  rangeInput.addEventListener('input', () => {
    minVal = parseInt(rangeInput.querySelector('.range-min').value);
    maxVal = parseInt(rangeInput.querySelector('.range-max').value);
    if (maxVal - minVal < 15) {
        if (minVal === 0) {
          maxVal = 15;
        } else if (maxVal === 360) {
          minVal = 345;
        } else {
          maxVal = minVal + 15;
        }
      }
  });
});
</script>
  
  <div class="wrapper">
    <h2>SELECT SECTOR</h2>
    <div class="degree-input">
      <div class="field">
        <span>MIN</span>
        <input type="number" class="input-min" min="0" max="345" bind:value={minVal}>
      </div>
      <div class="field">
        <span>MAX</span>
        <input type="number" class="input-max" min="15" max="360" bind:value={maxVal}>
      </div>
    </div>
    <div class="slider">
      <div class="progress" style={progressStyle}></div>
    </div>
    <div class="range-input">
      <input type="range" class="range-min" min="0" max="360" bind:value={minVal}>
      <input type="range" class="range-max" min="0" max="360" bind:value={maxVal}>
    </div>
  </div>
  
  <style>
    .wrapper {
      width: 500px;
      text-align: start;
    }
  
    .field {
      font-family: 'Gloock', serif;
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
      color: black;
      font-size: 14px;
    }
  
    h2 {
      font-family: 'Gloock', serif;
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
      color: black;
      font-size: 20px;
      margin-left: 10px;
      margin-top: 40px;
    }
  
    p {
      font-family: 'Gloock', serif;
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
      color: black;
      font-size: 20px;
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
      width: 70%;
      height: 70%;
      outline: none;
      text-align: center;
      font-size: 18px;
      margin-left: 12px;
      border-radius: 5px;
      border: 1px black solid;
      -moz-appearance: none;
    }
  
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

	.slider {
		position: relative;
		width: 100%;
		height: 40px;
		top: 50%;
		background-color: #585858;
        border-radius: 30px;
        border: 1px black solid;
	}

    .slider .progress{
        height: 40px;
        left: 0%;
        right: 0%;
        position: absolute;
        border-radius: 30px;
        background: #D9D9D9;
    }

    .range-input{
        position:relative;
    }
    
    .range-input input{
        background: none;
        -webkit-appearance: none;
        position:absolute;
        top: -43px;
        height: 40px;
        width: 100%;
        border-radius: 30px;
        cursor: pointer;
        pointer-events: none;
    }
    input[type="range"]::-webkit-slider-thumb{
        border-radius: 30px;
		width: 50px;
		height: 50px;
		background-color: #D9D9D9;
		border: 1px black solid;
        -webkit-appearance: none;
        pointer-events: auto;
    }

</style>