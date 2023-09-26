<script lang="ts">
	import Folder from '$lib/core/Folder.svelte';
	import Checkbox from '$lib/extra/Checkbox.svelte';
	import ColorPicker from '$lib/extra/ColorPicker.svelte';
	import CubicBezier from '$lib/plugin/essentials/CubicBezier.svelte';
	import PointPicker from '$lib/extra/PointPicker.svelte';
	import { FpsGraph, Pane, PaneDraggable, PaneInline, Slider } from '$lib/index.js';
	import RotationEuler from '$lib/plugin/RotationEuler.svelte';
	import RotationQuaternion from '$lib/plugin/RotationQuaternion.svelte';
	import { Themes } from '$lib/theme.js';
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
	let e = { x: 0, y: 0, z: 0 };
	let p = { x: 0, y: 0 };
	let c = { r: 0, g: 0, b: 0 };
	let f = { x: 0, y: 0, z: 0, w: 0 };
	let b: [number, number, number, number] = [0.5, 0, 0.5, 1];
	let expanded = true;
	let folderExpanded = true;
	let rExpanded = false;
	let rExpanded1 = false;
	let rExpanded2 = false;
	let rExpanded3 = false;
	let rExpanded4 = false;
</script>

<div class="wrapper">
	<PaneInline title="Tweakpane">
		<Slider bind:value={x} min={0} max={1000} step={0.1} />
	</PaneInline>

	<Checkbox label="expanded" bind:value={expanded} />
	<Checkbox label="folderExpanded" bind:value={folderExpanded} />
	<Checkbox label="rExpanded" bind:value={rExpanded} />
	<Checkbox label="r1Expanded" bind:value={rExpanded1} />
	<Checkbox label="r12xpanded" bind:value={rExpanded2} />
	<Checkbox label="r12xpanded" bind:value={rExpanded3} />
	<Checkbox label="r12xpanded" bind:value={rExpanded4} />

	<PaneDraggable bind:expanded theme={Themes.light} title="Tweakpane Draggable">
		<CubicBezier bind:value={b} bind:expanded={rExpanded4} picker={'inline'} />
		<PointPicker bind:value={p} bind:expanded={rExpanded3} picker={'inline'} />
		<ColorPicker bind:value={c} bind:expanded={rExpanded2} picker={'inline'} />
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
		<RotationEuler bind:expanded={rExpanded} label={'Test'} picker={'inline'} bind:value={e} />
		<RotationQuaternion
			bind:expanded={rExpanded1}
			label={'Test'}
			picker={'inline'}
			bind:value={f}
		/>
		<Folder bind:expanded={folderExpanded}>
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
		</Folder>
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
