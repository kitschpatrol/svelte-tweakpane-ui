<script lang="ts">
	import {
		Binding,
		Button,
		Folder,
		Page,
		Pane,
		Separator,
		Tab,
		AutoObject,
		Checkbox,
		ColorPicker,
		List,
		PointPicker,
		Interval,
		RadioGrid,
		Slider,
		TextField,
		FpsGraph
	} from '$lib/index.js';
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

	let fpsBegin: any;
	let fpsEnd: any;

	let fpsValue: number = 0;

	let range = { min: 0, max: 100 };

	onMount(() => {
		function render() {
			fpsBegin && fpsBegin();
			// Rendering
			fpsEnd && fpsEnd();
			requestAnimationFrame(render);
		}

		render();
	});
</script>

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

<div class="wrapper">
	<hr />

	<Interval label={checkLabel} bind:value={range} min={-1000} max={1000} />

	<FpsGraph label="FPS Internal Clock" />

	<FpsGraph
		on:change={(e) => {
			fpsValue = e.detail;
		}}
		bind:begin={fpsBegin}
		bind:end={fpsEnd}
		label="FPS External Clock"
	/>

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
	<Slider bind:value={testNum} min={0} />
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
	<Button
		title="Relabel Checkbox"
		on:click={() => {
			checkLabel = checkLabel
				.split('')
				.sort(() => 0.5 - Math.random())
				.join('');
		}}
	/>
	<hr />
	<Binding bind:params={testParams} {key} />
	<hr />

	<hr />
	<Separator />
	<hr />
	<h3>Inside a pane</h3>
	<Pane title="yes" bind:expanded={paneExpanded}>
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
