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
	import { Themes } from '$lib/theme.js';

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
</script>

<div class="wrapper">
	<BooleanMonitor value={boolToMon} />
	<BooleanMonitor value={boolToMon} rows={5} />
	<BooleanMonitor value={boolToMon} rows={5} bufferSize={100} />
	<Button
		title="mess with monitor boolean"
		on:click={() => {
			boolToMon = !boolToMon;
		}}
	/>

	<NumberMonitor value={numberToMonitor} rows={5} bufferSize={50} />
	<NumberMonitor value={numberToMonitor} graph />
	<NumberMonitor value={numberToMonitor} />
	<Slider label="number to monitor" bind:value={numberToMonitor} />

	<TextMonitor label="Plain Monitor" value={textToMonitor} />
	<TextMonitor label="Multiline Monitor" rows={6} multiline={true} value={textToMonitor} />
	<TextField label="text to monitor" bind:value={textToMonitor} />
	<Button
		title="mess with monitor text"
		on:click={() => {
			textToMonitor += 'asdfasdfasdf\n';
		}}
	/>

	<Profiler label="Test" bind:this={profilerRef} />
	<Pane theme={Themes.vivid}>
		<Button
			title="test profiler"
			on:click={() => {
				profilerRef.measure('test', abuseRandom);
			}}
		/>

		<FpsGraph label="FPS Internal Clock" />

		<FpsGraph
			on:change={(e) => {
				fpsValue = e.detail;
			}}
			bind:this={fpsRef}
			label="FPS External Clock"
		/>
	</Pane>

	<Waveform min={-1} max={11} value={w} lineStyle={'bezier'} />

	{ilv}
	<ThumbnailList label="options" bind:value={ilv} options={il} />

	{JSON.stringify(rq)}
	<RotationQuaternion label="Rotate Quaternion" bind:value={rq} />

	{JSON.stringify(rv)}
	<RotationEuler label="Rotate Euler" bind:value={rv} />

	{imgPath}
	<Image label="Image drag and drop" bind:value={imgPath} />

	{rowCount}
	<pre>
	{mlt}
</pre>
	<Textarea
		bind:value={mlt}
		rows={rowCount}
		placeholder={"There's no place like holder"}
		label={'Multiline'}
	/>
	<Button
		on:click={() => {
			rowCount += 1;
		}}
	/>

	{va}
	<Wheel wide={false} amount={100} bind:value={va} disabled={false} />

	<Ring wide={false} series={1} bind:value={va} disabled={false} />

	<GenericBinding value={v} />
	{bz}
	<CubicBezier label={checkLabel} bind:value={bz} />
	<Button
		title="Relabel Checkbox"
		on:click={() => {
			checkLabel = checkLabel
				.split('')
				.sort(() => 0.5 - Math.random())
				.join('');
		}}
	/>

	<Button
		title="Reset value"
		on:click={() => {
			bz = [0.25, 0.75, 0.75, 0.25];
		}}
	/>

	<ButtonGrid
		on:click={(e) => {
			console.log(`e.detail: ${JSON.stringify(e.detail, null, 2)}`);
		}}
		buttons={['one', 'two']}
	/>

	{radioValue}
	<RadioGrid label={undefined} bind:value={radioValue} values={['A', 'B', 'C']} />
	<Checkbox />

	{fpsValue}
	{p1s}
	{p2s}
	{p3s}
	{JSON.stringify(testParams)}
	{JSON.stringify(range)}
	{key}

	{testParams.levitch}

	<hr />

	<Interval label={checkLabel} bind:value={range} min={-1000} max={1000} />

	<hr />

	<PointPicker expanded={true} picker={'inline'} value={{ x: 50, y: 120, z: 77, w: 34 }} />

	<PointPicker
		expanded={true}
		picker={'inline'}
		value={{ x: 50, y: 120, z: 5 }}
		min={-200}
		max={200}
		step={5}
	/>

	<PointPicker
		expanded={true}
		picker={'inline'}
		value={{ x: 50, y: 120 }}
		min={-200}
		max={200}
		step={5}
	/>

	<h3>Stand-alone</h3>
	{checkLabel}<br />
	{checkValue}<br />
	{colorValue} <br />

	<List
		value={0}
		options={{
			'0': 0,
			'1': 1,
			'2': 2
		}}
	/>

	<List
		value="0"
		options={{
			none: '',
			dark: 'dark-theme.json',
			light: 'light-theme.json'
		}}
	/>

	{testNum} <br />
	{testText} <br />
	<TextField bind:value={testText} />
	<!-- <Slider label="Interval" bind:value={range} min={-1000} max={1000} /> -->
	<Slider label="adfasdf" bind:value={testNum} min={0} />
	<Slider bind:value={testNum} max={100} />
	<Slider bind:value={testNum} min={0} max={100} />
	<Slider bind:value={testNum} step={1} />
	<Slider bind:value={testNum} step={10} min={0} max={100} />
	<Slider
		bind:value={testNum}
		format={(n) => {
			return `${n}!!!`;
		}}
	/>

	<ColorPicker bind:value={colorValue} />

	<Checkbox label={checkLabel} bind:value={checkValue} />
	<Button
		title="Toggle Checkbox"
		on:click={() => {
			checkValue = !checkValue;
		}}
	/>

	<hr />
	<Binding bind:params={testParams} {key} />
	<hr />

	<hr />
	<Separator />
	<hr />
	<h3>Inside a pane</h3>
	<Pane theme={Themes.vivid} title="yes" bind:expanded={paneExpanded}>
		<Binding params={testParams} {key} />
		<Separator />
		{#if viz}
			<Button title="hi" />
		{/if}
		<Button title="reset" />
		{#if viz}
			<Folder>
				<Button title="enfoldered" />
				<Separator />
			</Folder>
		{/if}
		<Separator />
		{#if viz}
			<Tab>
				<Page title="A">
					<Button title="Some button A" />
					<Binding params={testParams} {key} />
				</Page>
				<Page title="B">
					<Button title="Some button B" />
					<Binding params={testParams} {key} />
				</Page>
			</Tab>
		{/if}
		<Button title="Toggle Viz" on:click={toggleVisible} />
		<Button title="Toggle Key" on:click={toggleKey} />
		<Separator />
	</Pane>
</div>

<hr />
<p>I am at the bottom</p>

<style>
	div.wrapper {
		width: 500px;
	}
</style>
