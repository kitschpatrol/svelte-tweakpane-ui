<script lang="ts">
	import { onMount } from 'svelte'
	import { CubicBezier, FpsGraph, Monitor, Pane, Ring, Slider, Wheel } from '$lib'

	let time = 0

	onMount(() => {
		function tick() {
			time = Date.now() / 1000
			requestAnimationFrame(tick)
		}

		requestAnimationFrame(tick)
	})

	$: wave = Math.sin(time * 5)
	const width = 360
	let scale1 = 1
	let scale2 = 2
	$: width1 = width * scale1
	$: width2 = width * scale2
</script>

<Pane position="inline" scale={scale1} title="Tweakpane Scale Test" width={width1}>
	<FpsGraph />
	<Slider label="Scale" max={2} min={0} bind:value={scale1} />
	<Monitor bufferSize={300} graph={true} label="Monitor" max={2} min={-2} value={wave} />
	<CubicBezier expanded={true} picker="inline" value={[0, 0, 0, 0]} />
	<Wheel value={1} />
	<Ring value={1} />
</Pane>
<br />
<br />
<Pane position="inline" scale={scale2} title="Tweakpane Scale Test" width={width2}>
	<FpsGraph />
	<Slider label="Scale" max={2} min={0} bind:value={scale2} />
	<Monitor bufferSize={300} graph={true} label="Monitor" max={2} min={-2} value={wave} />
	<CubicBezier expanded={true} picker="inline" value={[0, 0, 0, 0]} />
	<Wheel value={1} />
	<Ring value={1} />
</Pane>

<style>
	:global(html) {
		display: flex;
		flex-wrap: wrap;
		gap: 10em;
		align-items: flex-start;
		justify-content: center;
		width: 100vw;
		height: 100dvh;
	}
</style>
