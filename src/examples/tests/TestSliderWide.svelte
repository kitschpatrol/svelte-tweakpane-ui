<script lang="ts">
	import { Checkbox, Slider } from '$lib'

	let value = 0
	let wide = false
</script>

<Slider
	format={(v) => v.toFixed(2)}
	label="Let it Slide Wide"
	max={1}
	min={-1}
	wide={true}
	bind:value
/>
<Slider
	format={(v) => v.toFixed(2)}
	label="Let it Slide"
	max={1}
	min={-1}
	wide={false}
	bind:value
/>
<Slider
	format={(v) => v.toFixed(2)}
	label="Let it Slide Wide if Checked"
	max={1}
	min={-1}
	{wide}
	bind:value
/>
<Checkbox label="Wide" bind:value={wide} />
<pre>Value: {value}</pre>
