<script lang="ts">
	import { Checkbox, IntervalSlider, Ring, Separator, Slider, Wheel } from '$lib';

	let min = 0;
	let max = 100;
	let value = 50;
	let wide = true;
</script>

<Checkbox bind:value={wide} label="Wide" />
<Separator />
<Slider bind:value {min} {max} label="Slider" {wide} />
<IntervalSlider
	value={[min, max]}
	{min}
	{max}
	bind:meanValue={value}
	label="IntervalSlider"
	{wide}
/>
<Wheel bind:value {min} {max} label="Wheel" {wide} />
<Ring bind:value {min} {max} label="Ring" {wide} />
