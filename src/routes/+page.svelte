<script lang="ts">
	import Checkbox from '$lib/extra/Checkbox.svelte';
	import { FpsGraph, Pane, PaneDraggable, PaneInline, Slider } from '$lib/index.js';
	import { Themes } from '$lib/theme.js';
	import { bindFoldable } from '@tweakpane/core';
	import { onMount } from 'svelte';

	let fpsRef: FpsGraph;

	onMount(() => {
		function render() {
			// Rendering
			fpsRef?.begin();
			fpsRef?.end();
			requestAnimationFrame(render);
		}

		render();
	});

	let vToMon = 5;

	// let w = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];

	// setInterval(() => {
	// 	w = w.map((v) => Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5)));
	// }, 20);

	// let profilerRef: Profiler;

	// function abuseRandom() {
	// 	let sum = 0.0;
	// 	for (let sum = 0; sum < 1e5; sum++) {
	// 		sum += Math.random();
	// 	}
	// }

	// setGlobalDefaultTheme(baseTheme);

	let x = 0;

	let persist = true;
</script>

<div class="wrapper">
	<PaneInline title="Tweakpane">
		<Slider bind:value={x} min={0} max={1000} step={0.1} />
	</PaneInline>

	<Checkbox bind:value={persist} />

	<PaneDraggable storePositionLocally={false} theme={Themes.light} title="Tweakpane Draggable">
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</PaneDraggable>

	<Pane title="Tweakpane Normal" theme={Themes.vivid}>
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</Pane>
</div>

<style>
	div.wrapper {
		width: 300px;
	}
</style>
