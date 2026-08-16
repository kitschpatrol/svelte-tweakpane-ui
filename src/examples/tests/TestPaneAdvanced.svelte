<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane'
	import { onMount } from 'svelte'
	import { Pane, Slider } from '$lib'
	import Checkbox from '$lib/control/Checkbox.svelte'

	let tpPane1: TpPane
	let tpPane2: TpPane
	let tpPane3: TpPane

	let expanded = true
	let userExpandable = true

	onMount(() => {
		// Have your way with the pane...
		console.log('tpPane1:', tpPane1)
		tpPane1.on('change', (event) => {
			console.log('tpPane1')
			console.log(event)
		})
		console.log('tpPane2:', tpPane2)
		tpPane2.on('change', (event) => {
			console.log('tpPane2')
			console.log(event)
		})
		console.log('tpPane3:', tpPane3)
		tpPane3.on('change', (event) => {
			console.log('tpPane3')
			console.log(event)
		})
	})

	let speed = 50
</script>

<Pane position="draggable" {userExpandable} bind:expanded bind:tpPane={tpPane1}>
	<Checkbox label="expanded" bind:value={expanded} />
	<Checkbox label="user expandable" bind:value={userExpandable} />
	<Slider max={100} min={0} bind:value={speed} />
</Pane>
<Pane position="inline" {userExpandable} bind:expanded bind:tpPane={tpPane2}>
	<Slider max={100} min={0} bind:value={speed} />
</Pane>
<Pane position="fixed" {userExpandable} bind:expanded bind:tpPane={tpPane3}>
	<Slider max={100} min={0} bind:value={speed} />
</Pane>
