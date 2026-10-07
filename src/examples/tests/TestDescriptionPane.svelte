<script lang="ts">
	import { Pane, Slider } from '$lib'

	let description: string | undefined = 'Controls the demo scene.'
	let title: string | undefined = undefined
	let value = 0.5
	let x = 400
	let y = 40
</script>

<Pane {description} storePositionLocally={false} title="Draggable" bind:x bind:y>
	<Slider label="Draggable slider" max={1} min={0} bind:value />
</Pane>

<div style:width="256px">
	<Pane {description} position="inline" title="Inline">
		<Slider label="Inline slider" max={1} min={0} bind:value />
	</Pane>
	<Pane description="Describes an untitled pane." position="inline" {title}>
		<Slider label="Untitled slider" max={1} min={0} bind:value />
	</Pane>
</div>

<button
	type="button"
	on:click={() => {
		title = title === undefined ? 'Added title' : undefined
	}}>Toggle title</button
>
<button
	type="button"
	on:click={() => {
		description = 'Updated description'
	}}>Update description</button
>
<button
	type="button"
	on:click={() => {
		description = undefined
	}}>Remove description</button
>
<output data-testid="position-state">{x} {y}</output>
