<script lang="ts">
	import { Checkbox, Slider } from '$lib';
	let colors = 0.95;
	let darkMode = true;
	let numbers = true;
</script>

<div class="grid-wrapper">
	<Slider
		bind:value={colors}
		min={0}
		max={1}
		label="Colors"
		theme={{ baseBorderRadius: '0', bladeValueWidth: '244px' }}
	/>
	<Checkbox
		bind:value={darkMode}
		label="Dark Mode"
		theme={{ baseBorderRadius: '0', bladeValueWidth: '75.5px' }}
	/>
	<Checkbox
		bind:value={numbers}
		label="Numbers"
		theme={{ baseBorderRadius: '0', bladeValueWidth: '80px' }}
	/>
</div>

<style>
	div.grid-wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		max-width: 337px;
	}

	div.grid-wrapper > :global(div:first-child) {
		grid-column: span 2;
	}
</style>
