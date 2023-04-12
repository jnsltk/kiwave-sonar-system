<script>
 
    import Sonar from './components/gui/Sonar.svelte';
    import Range from './components/gui/Range.svelte';
    import Sector from './components/gui/Sector.svelte';

    let start;
	  let end;
	  const nice = d => {
		if (!d && d !== 0) return '';
		return d.toFixed(2);
	}
</script>

<main>
<Sonar/>
<Range/>
<Sector bind:start bind:end/>
<div class="labels">
  <div class="label">{nice(start)}</div>
  <div class="label">{nice(end)}</div>
</div>
</main>

<style>

</style>
