<script lang="ts">
	/** eslint-disable @typescript-eslint/no-unused-vars */
	import List from '$lib/extra/List.svelte';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';

	import {
		Pane,
		Button,
		MonitorNumber,
		Slider,
		Checkbox,
		ColorPicker,
		PointPicker,
		TextField,
		ButtonGrid
	} from '$lib/index.js';
	// import { Themes } from '$lib/theme.js';
	// import { onMount } from 'svelte';

	import Wheel from '$lib/plugin/camerakit/Wheel.svelte';
	import { Themes } from '$lib/theme.js';
	import CubicBezier from '$lib/plugin/essentials/CubicBezier.svelte';
	import FpsGraph from '$lib/plugin/essentials/FpsGraph.svelte';
	import IntervalSlider from '$lib/plugin/essentials/IntervalSlider.svelte';
	import RadioGrid from '$lib/plugin/essentials/RadioGrid.svelte';
	import Image from '$lib/plugin/Image.svelte';
	import type { ImageResolvable } from 'tweakpane-image-plugin/dist/types/model.js';
	import Profiler from '$lib/plugin/Profiler.svelte';
	import RotationEuler from '$lib/plugin/RotationEuler.svelte';
	import RotationQuaternion from '$lib/plugin/RotationQuaternion.svelte';
	import Textarea from '$lib/plugin/Textarea.svelte';
	import Waveform from '$lib/plugin/Waveform.svelte';

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

	let w = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];

	setInterval(() => {
		w = w.map((v) => Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5)));
	}, 20);

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

	// let f = { x: 0, y: 0, z: 0, w: 0 };

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

	// let booleanToMonitor = false;
	// let numberToMonitor = 0;
	// let t = 0;

	// setInterval(() => {
	// 	// numberToMonitor = Math.sin(t);
	// 	t += 0.3;
	// }, 100);

	let f1 = (v: number) => v.toFixed(1);
	let f2 = (v: number) => v.toFixed(10);

	let l = 'Bla';
	let f = f1;
	let disabled = false;

	let value = 0.5;
	let value1 = 0.5;
	let c = { r: 0, g: 0, b: 0 };

	let expanded = true;

	let selection: number;

	let point2d = { x: 0, y: 0 };
	let point3d = { x: 0, y: 0, z: 0 };
	let point4d = { x: 0, y: 0, z: 0, w: 0 };

	let x1 = { max: 10, format: (v: number) => v.toFixed(10) };
	let x2 = { max: 1, format: (v: number) => v.toFixed(1) };
	let xf = x1;
	let text = 'Cosmic Manifold';

	let xPos: number = 500;

	let eb = true;

	let i = { min: 0, max: 100 };

	let b: [number, number, number, number] = [0.5, 0, 0.5, 1];

	let rv: number = 0;
	let img: ImageResolvable;
	$: console.log(img);
</script>

<div class="wrapper">
	<Waveform bind:value={w} />

	<Textarea value={''} />

	<RotationQuaternion label="yes" value={point4d} picker="inline" />
	<RotationEuler label="yes" value={point3d} picker="inline" />

	<Profiler label="hi" />

	<Image bind:value={img}></Image>

	<RadioGrid bind:value={rv} values={[0, 1, 2, 3]} />

	<IntervalSlider bind:value={i} min={0} max={100} />

	<FpsGraph rows={5} />

	<CubicBezier bind:value={b} picker="inline" {expanded} />

	<ButtonGrid
		on:click={(b) => {
			console.log(b.detail.index);
		}}
		buttons={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']}
	/>

	<Pane localStoreId={'asdf'} x={500}>
		<Wheel
			bind:value
			label="Let it Slide"
			min={-100}
			max={100}
			format={(v) => v.toFixed(2)}
			wide={true}
		/>
		<Wheel
			bind:value
			label="Let it Slide"
			min={-100}
			max={100}
			format={(v) => v.toFixed(2)}
			wide={true}
		/>
	</Pane>

	{xPos}
	{eb}
	<Pane position="fixed">
		<TextField bind:value={text} label="The Message" />
	</Pane>
	<Pane position="inline">
		<TextField bind:value={text} label="The Message" />
	</Pane>
	<Pane
		position="draggable"
		localStoreId="2"
		bind:expanded={eb}
		theme={Themes.vivid}
		bind:x={xPos}
		y={0}
		title="problems"
	>
		<TextField bind:value={text} label="The Message" />
	</Pane>
	<Pane>
		<TextField bind:value={text} label="The Message" />
	</Pane>

	<PointPicker
		label="2D Point Picker"
		bind:value={point2d}
		picker="inline"
		{expanded}
		format={f}
		max={1}
		x={xf}
	/>
	<Button
		on:click={() => {
			xf = xf === x1 ? x2 : x1;
		}}
		label="Toggle X"
	/>
	<PointPicker label="3D Point Picker" bind:value={point3d} />
	<PointPicker label="4D Point Picker" bind:value={point4d} min={0} max={100} />

	<List label="Alphanumerics" bind:value={selection} options={{ a: 1, b: 2, c: 3 }} />

	<ColorPicker bind:value={c} picker="inline" {expanded} clickToExpand={false} />

	<TextField bind:value={text} label="The Message" />

	<Checkbox bind:value={disabled} label="Disabled" theme={Themes.vivid} />
	<Checkbox bind:value={expanded} label="Expanded" theme={Themes.vivid} />

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
	<GenericSlider {disabled} bind:value={value1} min={-1} max={1} format={(v) => v.toFixed(1)} />
</div>

<style>
	div.wrapper {
		width: 300px;
	}
</style>
