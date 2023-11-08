<script lang="ts">
	import { FpsGraph, Monitor, Slider } from '$lib';
	import { onMount } from 'svelte';

	let rotation = 0;
	let rotationSpeed = 3;
	let phase = 500;
	let scale = 1.25;
	let intensity = 4;

	onMount(() => {
		(function tick() {
			rotation += rotationSpeed;
			requestAnimationFrame(tick);
		})();
	});

	$: gridSize = intensity ** 2;
</script>

<FpsGraph interval={50} rows={5} />

<Slider bind:value={intensity} min={1} max={10} label="Intensity" step={1} />
<Monitor value={gridSize ** 2} format={(v) => v.toFixed(0)} label="Boxes" />
<Slider bind:value={scale} min={0.25} max={2} label="Scale" />
<Slider bind:value={phase} min={0} max={2000} label="Phase" />
<Slider bind:value={rotationSpeed} label="Rotation Speed" />

<div class="demo">
	{#each Array.from({ length: gridSize }, (_, i) => i) as x}
		{#each Array.from({ length: gridSize }, (_, i) => i) as y}
			<div
				class="box"
				style:left="{(x / gridSize) * 100}%"
				style:scale
				style:top="{(y / gridSize) * 100}%"
				style:transform="rotateZ({rotation + (x / gridSize) * phase + (y / gridSize) * phase}deg)"
				style:width="{100 / gridSize}%"
			/>
		{/each}
	{/each}
</div>

<!-- <script lang="ts">
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

<Slider bind:value={scale} min={-10} max={10} /> <Slider bind:value={w} min={100} max={1000} />

<Pane position={'inline'} {scale} width={w}> <CubicBezier bind:value={test} expanded={false}
    picker={'inline'} /> <Tab> <Page title="A"> <Button on:click={() => alert('A...')} title="Button
    A" /> </Page> <Page title="B"> <Button on:click={() => alert('B...')} title="Button B" />
    </Page> </Tab> <RotationQuaternion bind:value={test} clickToExpand={true} expanded={false}
    label="Quaternion Picker" picker={'inline'}
    />
    <Profiler bind:measure label="Profiler" />
    <Slider bind:value={loopExponent} min={1} max={5} label="Loop Exponent (Careful)" step={1} />
    <Point bind:value={point2d} expanded={false} label="2D Point Picker" />
</Pane> -->

<style>
	.demo {
		position: relative;
		overflow: hidden;
		aspect-ratio: 1;
		width: 100%;
		background: linear-gradient(to top, gold, rebeccapurple);
	}

	.box {
		position: absolute;
		transform-origin: center;
		aspect-ratio: 1;
		opacity: 0.5;
		background: linear-gradient(to bottom, orange, magenta);
	}
</style>
