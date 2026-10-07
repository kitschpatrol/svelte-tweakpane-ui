<script lang="ts">
	import { Pane, Slider } from '$lib'

	let value = 0.5
	let scale = 2
	let draggable = false
</script>

<Pane
	position={draggable ? 'draggable' : 'inline'}
	{scale}
	storePositionLocally={false}
	title="Scaled Description"
	width={600}
>
	<Slider description="Description at pane scale." label="Scaled" max={1} min={0} bind:value />
</Pane>

<button
	type="button"
	on:click={() => {
		scale = scale === 2 ? 1 : 2
	}}>Toggle scale</button
>
<button
	type="button"
	on:click={() => {
		draggable = !draggable
	}}>Toggle draggable</button
>
