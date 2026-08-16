<script lang="ts">
	import { Checkbox, Pane, Slider } from '$lib'
	let colors = 0.95
	let darkMode = true
	let numbers = true
	let oneMore = true
</script>

<div class="layout-wrapper"></div>
<Pane position="inline" theme={{ bladeValueWidth: '244px' }} width={337}>
	<Slider label="Colors" max={1} min={0} bind:value={colors} />
	<Checkbox label="Dark Mode" bind:value={darkMode} />
	<Checkbox label="Numbers" bind:value={numbers} />
	<Checkbox label="One More" bind:value={oneMore} />
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
