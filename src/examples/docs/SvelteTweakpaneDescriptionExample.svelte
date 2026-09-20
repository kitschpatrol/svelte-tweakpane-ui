<script lang="ts">
	import { Slider } from '$lib'

	let value = 0.5
</script>

<Slider
	description="Controls the overall scene brightness."
	label="Exposure"
	max={1}
	min={0}
	bind:value
/>
