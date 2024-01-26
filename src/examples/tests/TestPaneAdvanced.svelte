<script lang="ts">
	import { Pane, Slider } from '$lib';
	import Checkbox from '$lib/control/Checkbox.svelte';
	import { onMount } from 'svelte';
	import { type Pane as TpPane } from 'tweakpane';

	let tpPane1: TpPane;
	let tpPane2: TpPane;
	let tpPane3: TpPane;

	let expanded = true;
	let userExpandable = true;

	onMount(() => {
		// Have your way with the pane...
		console.log(`tpPane1: ${String(tpPane1)}`);
		tpPane1.on('change', (event) => {
			console.log('tpPane1');
			console.log(event);
		});
		console.log(`tpPane2: ${String(tpPane2)}`);
		tpPane2.on('change', (event) => {
			console.log('tpPane2');
			console.log(event);
		});
		console.log(`tpPane3: ${String(tpPane3)}`);
		tpPane3.on('change', (event) => {
			console.log('tpPane3');
			console.log(event);
		});
	});

	let speed = 50;
</script>

<Pane bind:expanded bind:tpPane={tpPane1} position="draggable" {userExpandable}>
	<Checkbox bind:value={expanded} label="expanded" />
	<Checkbox bind:value={userExpandable} label="user expandable" />
	<Slider bind:value={speed} min={0} max={100} />
</Pane>
<Pane bind:expanded bind:tpPane={tpPane2} position="inline" {userExpandable}>
	<Slider bind:value={speed} min={0} max={100} />
</Pane>
<Pane bind:expanded bind:tpPane={tpPane3} position="fixed" {userExpandable}>
	<Slider bind:value={speed} min={0} max={100} />
</Pane>
