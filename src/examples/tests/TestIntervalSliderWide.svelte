<script lang="ts">
	import { Checkbox, IntervalSlider } from '$lib'

	let value: [number, number] = [25, 75]
	let wide = false
</script>

<IntervalSlider bind:value min={0} max={100} format={(v) => `${v.toFixed(0)}%`} {wide} />
<Checkbox bind:value={wide} label="Wide" />
<pre>Value: {value}</pre>
