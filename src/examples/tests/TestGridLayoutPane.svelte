<script lang="ts">
	import { Checkbox, Pane, Slider } from '$lib';
	let colors = 0.95;
	let darkMode = true;
	let numbers = true;
	let oneMore = true;
</script>

<div class="layout-wrapper"></div>
<Pane position="inline" theme={{ bladeValueWidth: '244px' }} width={337}>
	<Slider bind:value={colors} min={0} max={1} label="Colors" />
	<Checkbox bind:value={darkMode} label="Dark Mode" />
	<Checkbox bind:value={numbers} label="Numbers" />
	<Checkbox bind:value={oneMore} label="One More" />
</Pane>

<style>
	div.layout-wrapper > :global(div.tp-rotv_c) {
		display: flex;
		flex-wrap: wrap;
	}

	div.layout-wrapper > :global(div.tp-lblv) {
		flex-grow: 1;
	}

	div.layout-wrapper > :global(.tp-lblv:has(.tp-ckbv)) {
		flex-direction: row-reverse;
		flex-grow: 0;
	}

	div.layout-wrapper > :global(.tp-lblv_v:has(.tp-ckbv)) {
		width: fit-content;
	}
</style>
