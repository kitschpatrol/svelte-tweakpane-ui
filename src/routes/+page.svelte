<script lang="ts">
	import {
		Binding,
		Button,
		Folder,
		Page,
		Pane,
		Separator,
		Tab,
		Checkbox,
		ColorPicker,
		List,
		PointPicker,
		Interval,
		RadioGrid,
		RotationQuaternion,
		Slider,
		TextMonitor,
		NumberMonitor,
		Waveform,
		BooleanMonitor,
		TextField,
		Textarea,
		Wheel,
		ThumbnailList,
		RotationEuler,
		Ring,
		ButtonGrid,
		CubicBezier,
		Image,
		Profiler,
		FpsGraph
	} from '$lib/index.js';

	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import { Themes, setGlobalDefaultTheme, type Theme } from '$lib/theme.js';

	import { onMount } from 'svelte';

	let buttonTitle = 'yes';
	let paneExpanded = true;
	let testParams = { speed: 'hi', levitch: 100 };
	let key = 'levitch';

	let radioValue = 'A';
	let viz = true;

	const toggleKey = () => {
		key = key === 'speed' ? 'levitch' : 'speed';
	};

	const toggleVisible = () => {
		viz = !viz;
	};

	const clickA = () => {
		clickFunc = clickB;
		testParams.speed += 100;
	};

	const clickB = () => {
		clickFunc = clickA;
	};

	let clickFunc = clickA;

	let p1s = true;
	let p2s = true;
	let p3s = true;

	let checkLabel = 'I am a checkbox!';
	let checkValue = false;
	// let colorValue = '0x00ffd6';
	let colorValue = { r: 1, g: 25, b: 234 };

	let testNum = 3.14;
	let testText = 'cosmic manifold';

	let fpsRef: FpsGraph;

	let fpsValue: number = 0;

	let range = { min: 0, max: 100 };

	onMount(() => {
		function render() {
			// Rendering
			fpsRef?.begin();
			fpsRef?.end();
			requestAnimationFrame(render);
		}

		render();
	});

	let v = false;
	let va = 5;

	let bz: [number, number, number, number] = [0.25, 0.75, 0.75, 0.25];
	let mlt = '';
	let rowCount = 2;

	let imgPath: string = 'placeholder';

	let pp = { x: 0, y: 0 };
	let rv = { x: 0, y: 0, z: 0 };
	let rq = { x: 0, y: 0, z: 0, w: 0 };

	let ilv: string = '002';
	let il = [
		{ text: 'Item #1', value: '001', src: 'https://picsum.photos/600?v=001' },
		{ text: 'Item #2', value: '002', src: 'https://picsum.photos/600?v=002' },
		{ text: 'Item #3', value: '003', src: 'https://picsum.photos/600?v=003' },
		{ text: 'Item #4', value: '004', src: 'https://picsum.photos/600?v=004' },
		{ text: 'Item #5', value: '005', src: 'https://picsum.photos/600?v=005' },
		{ text: 'Item #6', value: '006', src: 'https://picsum.photos/600?v=006' }
	];

	let w = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];
	setInterval(() => {
		w = w.map((v) => Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5)));
	}, 20);

	let profilerRef: Profiler;

	function abuseRandom() {
		let sum = 0.0;
		for (let sum = 0; sum < 1e5; sum++) {
			sum += Math.random();
		}
	}

	let boolToMon = false;
	let textToMonitor = 'bla';
	let numberToMonitor = 0;

	const baseTheme: Theme = {
		baseBorderRadius: '5px'
	};

	const inlineTheme: Theme = {
		baseBorderRadius: '5px'
	};

	setGlobalDefaultTheme(baseTheme);
	// setGlobalDefaultTheme(undefined);

	let vb = 50;
	let vToMon = va;

	let vm = 50;

	let ex = true;
</script>

<Pane title="Floating" mode="floating">
	<Button label="Test Button" title="Button" />
</Pane>

<div class="wrapper">
	<PointPicker bind:value={pp} picker="inline" />

	<ColorPicker bind:value={colorValue} />

	<ButtonGrid
		on:click={() => {
			console.log('clicked');
		}}
		buttons={['one', 'two', 'three']}
	/>

	<FpsGraph />

	<Pane>
		<FpsGraph />
	</Pane>

	{vToMon}
	<h2>PAGE</h2>
	<Page title="A">
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</Page>

	<hr />

	<!-- <Slider label="ba" bind:value={vm} min={0} max={1000} step={0.1} /> -->
	<h2>TAB / PAGE</h2>
	<Tab>
		<Page title="AA">
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
		</Page>
		{#if ex}
			<Page title="B">
				<Slider value={1} min={0} max={10} step={0.1} />
			</Page>
		{/if}
		<Page title="C">
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
		</Page>
	</Tab>

	<hr />
	<h2>PANE / TAB / PAGE</h2>
	<Pane>
		<Tab>
			<Page title="A">
				<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
			</Page>
			<Page title="B">
				<Slider value={1} min={0} max={10} step={0.1} />
			</Page>
		</Tab>
	</Pane>
	<Button
		on:click={() => {
			console.log('click');
			ex = !ex;
		}}
	/>
	<!--
	<Pane>
		<Button
			on:click={() => {
				console.log('click');
				ex = !ex;
			}}
		/>
	</Pane> -->

	{vm}
	<Slider label="ba" bind:value={vm} min={0} max={1000} step={0.1} />

	<!-- <hr />
	<Slider bind:value={vToMon} min={0} max={10} step={0.1} />

	<Binding bind:key params={testParams} theme={Themes.vivid} />

	<Pane>
		<Binding label="1" bind:key params={testParams} />
		<Binding label="2" bind:key params={testParams} />
		<Binding label="3" bind:key params={testParams} />
		<Binding label="4" bind:key params={testParams} />
	</Pane> -->

	<!-- <Folder title="I am folder">
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</Folder>

	<Pane>
		<Folder title="I am folder">
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
			<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
		</Folder>
	</Pane> -->

	<!-- <hr />
	<Pane>
		<Slider bind:value={vToMon} min={0} max={10} step={0.1} />
	</Pane>
	<Slider bind:value={va} min={0} max={10} step={0.1} />
	<hr />
	<Button
		label="Test Button"
		title="Button"
		on:click={() => {
			vToMon = vb;
		}}
	/> -->

	<!-- <Pane title="Inline" theme={inlineTheme} mode="inline">
		<Button label="Test Button" title="Button" />
	</Pane> -->
</div>

<p>I am at the bottom</p>

<style>
	div.wrapper {
		width: 300px;
	}
</style>
