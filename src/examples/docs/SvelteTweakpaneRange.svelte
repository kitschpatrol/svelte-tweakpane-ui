<script lang="ts">
	import { Slider } from '$lib';

	let speed = 50.0;
</script>

<Slider bind:value={speed} min={0} max={100} />
<pre>
{speed}
</pre>
