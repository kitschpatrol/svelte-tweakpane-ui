<script lang="ts">
	import {
		Button,
		Page,
		Pane,
		Point,
		type PointValue2d,
		Profiler,
		type ProfilerMeasure,
		RotationQuaternion,
		Slider,
		Tab
	} from '$lib';
	import SliderExample from '$lib-docs/generated/examples/SliderExample.svelte';
	import CubicBezier from '$lib/plugin/essentials/CubicBezier.svelte';
	import { onMount } from 'svelte';

	// this is a readonly function handle assigned by Profiler component first used in onMount since
	// it is not bound until then
	let measure: ProfilerMeasure;

	let loopExponent = 1;
	let test: [number, number, number, number] = [0, 0, 0, 0];

	// helper to test Math functions
	function hardWork(fn: (n: number) => number, exponent: number): void {
		measure(fn.name, () => {
			for (let sum = 0; sum < Number('1e' + exponent); sum++) {
				fn(sum);
			}
		});
	}

	onMount(() => {
		(function tick() {
			// Nesting measurements creates a hierarchy in the Profile visualization
			measure('Tick', () => {
				measure('Trigonometry', () => {
					hardWork(Math.sin, loopExponent);
					hardWork(Math.cos, loopExponent);
					hardWork(Math.tan, loopExponent);
					hardWork(Math.atan, loopExponent);
					hardWork(Math.acos, loopExponent);
					hardWork(Math.acosh, loopExponent);
				});
				measure('Logarithms', () => {
					hardWork(Math.log, loopExponent);
					hardWork(Math.log10, loopExponent);
					hardWork(Math.log1p, loopExponent);
					hardWork(Math.log2, loopExponent);
				});
				measure('Rounding', () => {
					hardWork(Math.round, loopExponent);
					hardWork(Math.floor, loopExponent);
					hardWork(Math.ceil, loopExponent);
					hardWork(Math.fround, loopExponent);
				});
			});

			requestAnimationFrame(tick);
		})();
	});

	let point2d: PointValue2d = { x: 0, y: 0 };

	let scale = 2;
	let w = 500;
</script>

<Slider bind:value={scale} min={-10} max={10} />
<Slider bind:value={w} min={100} max={1000} />

<Pane position={'inline'} {scale} width={w}>
	<CubicBezier bind:value={test} expanded={false} picker={'inline'} />
	<Tab>
		<Page title="A">
			<Button on:click={() => alert('A...')} title="Button A" />
		</Page>
		<Page title="B">
			<Button on:click={() => alert('B...')} title="Button B" />
		</Page>
	</Tab>
	<RotationQuaternion
		bind:value={test}
		clickToExpand={true}
		expanded={false}
		label="Quaternion
	Picker"
		picker={'inline'}
	/>
	<Profiler bind:measure label="Profiler" />
	<Slider bind:value={loopExponent} min={1} max={5} label="Loop Exponent (Careful)" step={1} />
	<Point bind:value={point2d} expanded={false} label="2D Point Picker" />
</Pane>
