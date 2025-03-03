<script lang="ts">
	import { Pane, Slider } from '$lib'
	import { onMount } from 'svelte'
	import { type Pane as TpPane } from 'tweakpane'

	let tpPane: TpPane

	onMount(() => {
		// Have your way with the pane...
		tpPane.on('change', (event) => {
			console.log(event)
		})
	})

	let speed = 50
</script>

<Pane bind:tpPane>
	<Slider bind:value={speed} min={0} max={100} />
</Pane>
