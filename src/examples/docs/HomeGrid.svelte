<script lang="ts">
	import { Button, Checkbox, Color, Monitor, Pane, RotationEuler, Separator, Slider } from '$lib';
	import { onMount } from 'svelte';
	import GridWrangler from './GridWrangler.svelte';
	import Demo from './HomeDemo.svelte';

	let mounted = false;

	export let showBackground = false;
	export let showPane = false;

	onMount(() => {
		mounted = true;
	});

	// Tweakpane
	let paneWidth: number = 290;

	// Grid
	let paneCount: number = 0;
	let gridSpacingX: number = 709;
	let gridSpacingY: number = 785;
	let scale: number = 1.5;
	let rotation: [number, number, number] = [0.7, 0, 0.75];
	let rotationExtrinsic: [number, number, number] = [-0.5, -0.16, 0];
	let overdrawX: number = 1370;
	let overdrawY: number = 1640;
	let includeCenters: boolean = true;
	let backgroundA = '#FF00FFFF';
	let backgroundB = '#ffa500FF';
</script>

{#if mounted}
	{#if showPane}
		<Pane position="fixed" y={100}>
			<Checkbox bind:value={showBackground} label="Show Background" />
			{#if showBackground}
				<Color bind:value={backgroundA} expanded={false} label="Background A" picker="inline" />
				<Color bind:value={backgroundB} expanded={false} label="Background B" picker="inline" />
				<Separator />
			{/if}
			<Monitor value={paneCount} format={(v) => v.toFixed(0)} label="Pane Count" />
			<Slider bind:value={overdrawX} min={0} max={2000} label="Overdraw X" step={1} />
			<Slider bind:value={overdrawY} min={0} max={2000} label="Overdraw Y" step={1} />
			<Checkbox bind:value={includeCenters} label="Include Centers" />
			<Slider bind:value={gridSpacingX} min={100} max={1500} label="Spacing X" step={1} />
			<Slider bind:value={gridSpacingY} min={100} max={1500} label="Spacing Y" step={1} />
			<Slider bind:value={paneWidth} min={100} max={500} label="Pane Width" step={1} />
			<Slider bind:value={scale} min={0.5} max={5} label="Scale" />
			<RotationEuler
				bind:value={rotation}
				expanded={true}
				label="Rotation Intrinsic"
				picker="inline"
			/>
			<RotationEuler
				bind:value={rotationExtrinsic}
				expanded={true}
				label="Rotation Extrinsic"
				picker="inline"
			/>
			<Button
				on:click={() => {
					rotation = [0, 0, 0];
					rotationExtrinsic = [0, 0, 0];
				}}
				title="Reset Rotation"
			/>
		</Pane>
	{/if}
	<GridWrangler
		bind:paneCount
		{backgroundA}
		{backgroundB}
		{gridSpacingX}
		{gridSpacingY}
		{includeCenters}
		{overdrawX}
		{overdrawY}
		{rotation}
		{rotationExtrinsic}
		{scale}
		{showBackground}
	>
		<Demo width={paneWidth} />
	</GridWrangler>
{/if}
