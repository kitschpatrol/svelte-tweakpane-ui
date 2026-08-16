<script lang="ts">
	import { Checkbox, Slider } from '$lib'
	let colors = 0.95
	let darkMode = true
	let numbers = true
</script>

<div class="grid-wrapper">
	<Slider
		label="Colors"
		max={1}
		min={0}
		theme={{ baseBorderRadius: '0', bladeValueWidth: '244px' }}
		bind:value={colors}
	/>
	<Checkbox
		label="Dark Mode"
		theme={{ baseBorderRadius: '0', bladeValueWidth: '75.5px' }}
		bind:value={darkMode}
	/>
	<Checkbox
		label="Numbers"
		theme={{ baseBorderRadius: '0', bladeValueWidth: '80px' }}
		bind:value={numbers}
	/>
</div>

<style>
	div.grid-wrapper {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		max-width: 337px;
	}

	div.grid-wrapper > :global(div:first-child) {
		grid-column: span 2;
	}
</style>
