<script lang="ts">
	import { Slider } from '$lib'

	let speed = 50
</script>

<Slider max={100} min={0} bind:value={speed} />
<pre>
{speed}
</pre>
