<script lang="ts">
	import { Button, Pane } from '$lib';

	let paneRef: Pane;
</script>

<Pane position="draggable" title="Svelte Tweakpane UI Demo" bind:this={paneRef}>
	<Button on:click={() => {}} />
</Pane>
