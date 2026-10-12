<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane'
	import { Pane, Slider } from '#lib'
	import { onMount } from 'svelte'

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
	<Slider max={100} min={0} bind:value={speed} />
</Pane>
