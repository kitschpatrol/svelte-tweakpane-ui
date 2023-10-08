<script lang="ts">
	import {
		Binding,
		RotationEuler,
		RotationQuaternion,
		CubicBezier,
		FpsGraph,
		Pane,
		Folder,
		Button,
		NumberMonitor,
		Slider,
		Tab,
		Page,
		Checkbox,
		ColorPicker,
		PointPicker,
		TextField
	} from '$lib/index.js';
	import { Themes } from '$lib/theme.js';
	import { onMount } from 'svelte';

	import Test from '$lib/core/Test.svelte';
	import Blade from '$lib/core/Blade.svelte';
	// import Test2 from '../../scratch/Test2.svelte';

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
	let label = 'Test';
	let params = { r: 0 };
	let reticulationCount = 0;

	let selectedA = false;
	let selectedB = false;
	let i: number = 0;

	// let modes: ('fixed' | 'inline' | 'draggable')[] = ['fixed', 'inline', 'draggable'];
	let modeIndex = 0;

	// let ee: boolean = true;
	// let xv: number;
</script>

<div class="wrapper">
	<Test mode="draggable" iAmADraggableProp regular={1} />
	<Test mode="fixed" />

	<!-- <Test2 expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Test2>

	<Test2 mode="fixed" expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Test2>

	<Test2 mode="draggable" expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Test2>

	<Test2 mode="inline" expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Test2>

	<Test2 width={34}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Test2> -->

	<Pane></Pane>

	<Pane x={5} expanded={false}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Pane>

	<Pane mode="fixed" x={50} expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Pane>

	<Pane mode="draggable">
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Pane>

	<Pane mode="inline" expanded={true}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Pane>

	<!-- modeIndex: {modeIndex}
	<Pane title="Test Pane" mode="fixed" x={0} y={0}>
		<Button title="Button A" on:click={() => (modeIndex = (modeIndex + 1) % 3)} />
	</Pane>

	<Tab bind:selectedIndex={i}>
		<Page bind:selected={selectedA}>
			<Button title="Button A" on:click={() => (selectedB = true)} />
		</Page>
		<Page bind:selected={selectedB} title="B">
			<Button title="Button B" on:click={() => (selectedA = true)} />
		</Page>
	</Tab>

	<Button title="Reticulate" on:click={() => (i = 1)} />

	<p>{i}</p>

	<p>{selectedA}</p>
	<p>{selectedB}</p>

	<hr />

	<Folder title="Reticulaton Manager">
		<Button title="Reticulate" on:click={() => reticulationCount++} />
		<NumberMonitor label="Reticulations" value={reticulationCount} />
	</Folder>

	<Button
		label="Spline Status"
		title="Check"
		on:click={() => alert('Reticulation in progress...')}
	/>

	<Blade bladeParams={{ view: 'separator' }} />

	<Binding bind:params key={'r'} label="Reticulation" />
	Value: {params.r}

	<Pane mode="draggable" title="Tweakpane">
		<Slider bind:value={x} min={0} max={1000} step={0.1} />
	</Pane>

	<TextField bind:value={label} />

	<Checkbox label="expanded" bind:value={expanded} />
	<Checkbox label="folderExpanded" bind:value={folderExpanded} />
	<Checkbox label="rExpanded" bind:value={rExpanded} />
	<Checkbox label="r1Expanded" bind:value={rExpanded1} />
	<Checkbox label="r12xpanded" bind:value={rExpanded2} />
	<Checkbox label="Point Picker Expanded" bind:value={rExpanded3} />
	<Checkbox label="r12xpanded" bind:value={rExpanded4} />

	<Pane
		mode="draggable"
		bind:expanded
		collapsable={false}
		theme={Themes.light}
		title="Tweakpane Draggable"
	>
		<CubicBezier bind:value={b} bind:expanded={rExpanded4} picker={'inline'} />
		<PointPicker {label} bind:value={p} bind:expanded={rExpanded3} picker={'inline'} />
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
	</Pane>

	<Pane title="test" width={500}></Pane>

	<Pane collapsable={true} title="Tweakpane Normal" theme={Themes.vivid}>
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</Pane> -->
</div>

<style>
	div.wrapper {
		width: 300px;
	}
</style>
