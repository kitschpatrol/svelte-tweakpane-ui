<script lang="ts">
	import { onMount } from 'svelte'
	import { Button, Checkbox, Color, Monitor, Pane, RotationEuler, Separator, Slider } from '$lib'
	import GridWrangler from './GridWrangler.svelte'
	import Demo from './HomeDemo.svelte'

	let mounted = false

	export let showBackground = false
	export let showPane = false

	onMount(() => {
		mounted = true
	})

	// Tweakpane
	let paneWidth: number = 290

	// Grid
	let paneCount: number = 0
	let gridSpacingX: number = 709
	let gridSpacingY: number = 785
	let scale: number = 1.5
	let rotation: [number, number, number] = [0.7, 0, 0.75]
	let rotationExtrinsic: [number, number, number] = [-0.5, -0.16, 0]
	let overdrawX: number = 1370
	let overdrawY: number = 1640
	let includeCenters: boolean = true
	let backgroundA = '#FF00FFFF'
	let backgroundB = '#ffa500FF'
</script>

{#if mounted}
	{#if showPane}
		<Pane position="fixed" y={100}>
			<Checkbox label="Show Background" bind:value={showBackground} />
			{#if showBackground}
				<Color expanded={false} label="Background A" picker="inline" bind:value={backgroundA} />
				<Color expanded={false} label="Background B" picker="inline" bind:value={backgroundB} />
				<Separator />
			{/if}
			<Monitor format={(v) => v.toFixed(0)} label="Pane Count" value={paneCount} />
			<Slider label="Overdraw X" max={2000} min={0} step={1} bind:value={overdrawX} />
			<Slider label="Overdraw Y" max={2000} min={0} step={1} bind:value={overdrawY} />
			<Checkbox label="Include Centers" bind:value={includeCenters} />
			<Slider label="Spacing X" max={1500} min={100} step={1} bind:value={gridSpacingX} />
			<Slider label="Spacing Y" max={1500} min={100} step={1} bind:value={gridSpacingY} />
			<Slider label="Pane Width" max={500} min={100} step={1} bind:value={paneWidth} />
			<Slider label="Scale" max={5} min={0.5} bind:value={scale} />
			<RotationEuler
				expanded={true}
				label="Rotation Intrinsic"
				picker="inline"
				bind:value={rotation}
			/>
			<RotationEuler
				expanded={true}
				label="Rotation Extrinsic"
				picker="inline"
				bind:value={rotationExtrinsic}
			/>
			<Button
				title="Reset Rotation"
				on:click={() => {
					rotation = [0, 0, 0]
					rotationExtrinsic = [0, 0, 0]
				}}
			/>
		</Pane>
	{/if}
	<GridWrangler
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
		bind:paneCount
	>
		<Demo width={paneWidth} />
	</GridWrangler>
{/if}
