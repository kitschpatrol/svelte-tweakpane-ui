<script lang="ts">
	import {
		List,
		IntervalSlider,
		Slider,
		Button,
		Pane,
		Binding,
		type Theme,
		type IntervalSliderValue,
		type BindingObject
	} from '$lib';

	let n = 0;
	let m: IntervalSliderValue = [0, 100];

	let mMean: number = 0;
	let paneRef: Pane;

	let theme: Theme = {
		bladeValueWidth: '70%'
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let objectOptions = {
		one: { blah: 1, blah2: 2 },
		two: { blah: 2, blah2: 3 }
	};

	let objectArray = [
		{
			text: 'one',
			value: 'blaa'
		},
		{
			text: 'two',
			value: 'bla'
		}
	];

	let objectOptionsObjectAray = [
		{ blah: 1, blah2: 2 },
		{ blah: 1, blah2: 2 },
		{ blah: 2, blah2: 3 },
		5
	];

	let objectOptionsAray = [1, 2, 3, 4];

	let optionsRef: any = objectOptionsObjectAray;

	let oVal: any;

	let params: BindingObject = { r: 0 };
</script>

<Binding bind:object={params} key={'r'} label="Reticulation" />
<pre>
Value: {params.r}
</pre>

{JSON.stringify(oVal)}

<List options={optionsRef} bind:value={oVal} />

<Pane {theme} position="draggable" title="Svelte Tweakpane UI Demo" bind:this={paneRef}>
	<List options={optionsRef} bind:value={oVal} />
	<Button
		on:click={() => {
			// oVal = objectOptions.two;
			optionsRef = objectArray;
		}}
	/>

	<Slider bind:value={mMean} min={0} max={100} label="Slider" step={1} />
	<IntervalSlider bind:meanValue={mMean} bind:value={m} min={0} max={100} label="Slider" step={1} />
</Pane>

<style>
</style>
