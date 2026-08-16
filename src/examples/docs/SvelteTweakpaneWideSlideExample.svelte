<script lang="ts">
	import { Checkbox, IntervalSlider, Ring, Separator, Slider, Stepper, Wheel } from '$lib'

	const min = 0
	const max = 100
	let value = 50
	let wide = true
</script>

<Checkbox label="Wide" bind:value={wide} />
<Separator />
<Slider label="Slider" {max} {min} {wide} bind:value />
<Stepper label="Stepper" {max} {min} step={10} {wide} bind:value />
<IntervalSlider
	label="IntervalSlider"
	{max}
	{min}
	value={[min, max]}
	{wide}
	bind:meanValue={value}
/>
<Wheel label="Wheel" {max} {min} {wide} bind:value />
<Ring label="Ring" {max} {min} {wide} bind:value />
