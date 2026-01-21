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
	let width = 360
	let scale1 = 1
	let scale2 = 2
	$: width1 = width * scale1
	$: width2 = width * scale2
</script>

<Pane position="inline" scale={scale1} title="Tweakpane Scale Test" width={width1}>
	<FpsGraph />
	<Slider bind:value={scale1} min={0} max={2} label="Scale" />
	<Monitor value={wave} min={-2} max={2} bufferSize={300} graph={true} label="Monitor" />
	<CubicBezier value={[0, 0, 0, 0]} expanded={true} picker="inline" />
	<Wheel value={1} />
	<Ring value={1} />
</Pane>
<br />
<br />
<Pane position="inline" scale={scale2} title="Tweakpane Scale Test" width={width2}>
	<FpsGraph />
	<Slider bind:value={scale2} min={0} max={2} label="Scale" />
	<Monitor value={wave} min={-2} max={2} bufferSize={300} graph={true} label="Monitor" />
	<CubicBezier value={[0, 0, 0, 0]} expanded={true} picker="inline" />
	<Wheel value={1} />
	<Ring value={1} />
</Pane>

<style>
	:global(html) {
		display: flex;
		gap: 10em;
		/* TODO */
		/* stylelint-disable-next-line declaration-property-value-no-unknown */
		align-items: top;
		justify-content: center;
		width: 100vw;
		height: 100vh;
	}
</style>
