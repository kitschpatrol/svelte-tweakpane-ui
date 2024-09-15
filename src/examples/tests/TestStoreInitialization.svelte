<script lang="ts">
	// Via https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/15
	import { Slider } from '$lib';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';

	const bear = writable({ apples: 100, name: 'Someone' });

	onMount(async () => {
		await tick();
		$bear.apples = 60;
	});
</script>

<p>Native input</p>
<input bind:value={$bear.apples} min={0} max={100} step={1} type="range" />
{$bear.apples}
<p>Svelte Tweakpane UI</p>
<Slider bind:value={$bear.apples} min={0} max={100} step={1} />
