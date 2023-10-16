<script lang="ts">
	/** eslint-disable @typescript-eslint/no-unused-vars */
	import List from '$lib/extra/List.svelte';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import Separator from '$lib/extra/Separator.svelte';
	import {
		Binding,
		RotationEuler,
		RotationQuaternion,
		CubicBezier,
		FpsGraph,
		Pane,
		Folder,
		Button,
		MonitorNumber,
		Slider,
		Tab,
		Page,
		Checkbox,
		ColorPicker,
		PointPicker,
		AutoObject,
		TextField
	} from '$lib/index.js';
	// import { Themes } from '$lib/theme.js';
	// import { onMount } from 'svelte';

	//import Blade from '$lib/core/Blade.svelte';
	// import MonitorBoolean from '$lib/extra/MonitorBoolean.svelte';
	// import type { PickerLayout } from '@tweakpane/core';
	// import Pane from '$lib/core/Pane.svelte';
	// import MonitorString from '$lib/extra/MonitorString.svelte';

	// import Test2 from '../../scratch/Test2.svelte';

	// let fpsRef: FpsGraph;

	// onMount(() => {
	// 	function render() {
	// 		// Rendering
	// 		fpsRef?.begin();
	// 		fpsRef?.end();
	// 		requestAnimationFrame(render);
	// 	}

	// 	render();
	// });

	// let vToMon = 5;

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

	// let x = 0;
	// let e = { x: 0, y: 0, z: 0 };
	// let p = { x: 0, y: 0 };
	// let c = { r: 0, g: 0, b: 0 };
	// let f = { x: 0, y: 0, z: 0, w: 0 };
	// let b: [number, number, number, number] = [0.5, 0, 0.5, 1];
	// let expanded = true;
	// let folderExpanded = true;
	// let rExpanded = false;
	// let rExpanded1 = false;
	// let rExpanded2 = false;
	// let rExpanded3 = false;
	// let rExpanded4 = false;
	// let label = 'Test';

	// let reticulationCount = 0;

	// let selectedA = false;
	// let selectedB = false;
	// let i: number = 0;

	// // let modes: ('fixed' | 'inline' | 'draggable')[] = ['fixed', 'inline', 'draggable'];
	// let modeIndex = 0;

	// let ee: boolean = true;
	// // let xv: number;

	// let expanded2 = true;
	// let clickToExpand = true;
	// let buttonStuff = '';
	// let pickerType: PickerLayout = 'inline';

	// let params = {
	// 	someNumber: 1, // creates a
	// 	someBoolean: true, // creates a checkbox
	// 	someString: 'test', // creates a text field
	// 	somePoint: {
	// 		// creates a point picker
	// 		x: 1,
	// 		y: 2,
	// 		z: 2,
	// 		w: 1
	// 	},
	// 	someColor: {
	// 		// creates a color picker
	// 		r: 255,
	// 		g: 0,
	// 		b: 55
	// 	},
	// 	someFolder: {
	// 		// wraps children in a folder
	// 		a: 1,
	// 		b: 2,
	// 		c: 3
	// 	}
	// };

	// let theme: any = Themes.light;
	// let pretty: boolean = false;

	let stringToMonitor = 'bla';
	// let booleanToMonitor = false;
	// let numberToMonitor = 0;
	// let t = 0;

	// setInterval(() => {
	// 	// numberToMonitor = Math.sin(t);
	// 	t += 0.3;
	// }, 100);

	let f1 = (v) => v.toFixed(1);
	let f2 = (v) => v.toFixed(10);

	let l = 'Bla';
	let f = f1;
	let disabled = false;

	let value1 = 0.5;
	let value2 = 0.5;
</script>

<div class="wrapper">
	{l}
	<MonitorNumber label={l} value={value1} format={f} />
	<Slider {disabled} bind:value={value1} label={l} min={-1} max={1} format={f} />
	<Button
		on:click={() => {
			f = f === f1 ? f2 : f1;
		}}
		label="Toggle Format"
	/>
	<Button
		on:click={() => {
			l += 'Bla';
		}}
		label={'Append Label'}
	/>
	<Button
		on:click={() => {
			disabled = !disabled;
		}}
		label={'Toggle enabled'}
	/>
	<Button label={l} {disabled} />
	<GenericSlider {disabled} bind:value={value2} min={-1} max={1} format={(v) => v.toFixed(1)} />
</div>

<style>
	div.wrapper {
		width: 300px;
	}
</style>
