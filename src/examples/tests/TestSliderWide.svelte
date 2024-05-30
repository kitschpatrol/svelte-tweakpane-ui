<script lang="ts">
	import { Checkbox, Slider } from '$lib';

	let value = 0;
	let wide = false;
</script>

<Slider
	bind:value
	min={-1}
	max={1}
	format={(v) => v.toFixed(2)}
	label="Let it Slide Wide"
	wide={true}
/>
<Slider
	bind:value
	min={-1}
	max={1}
	format={(v) => v.toFixed(2)}
	label="Let it Slide"
	wide={false}
/>
<Slider
	bind:value
	min={-1}
	max={1}
	format={(v) => v.toFixed(2)}
	label="Let it Slide Wide if Checked"
	{wide}
/>
<Checkbox bind:value={wide} label="Wide" />
<pre>Value: {value}</pre>
