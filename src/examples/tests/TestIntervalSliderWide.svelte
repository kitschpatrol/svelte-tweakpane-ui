<script lang="ts">
	import { Checkbox, IntervalSlider } from '$lib'

	let value: [number, number] = [25, 75]
	let wide = false
</script>

<IntervalSlider format={(v) => `${v.toFixed(0)}%`} max={100} min={0} {wide} bind:value />
<Checkbox label="Wide" bind:value={wide} />
<pre>Value: {value}</pre>
