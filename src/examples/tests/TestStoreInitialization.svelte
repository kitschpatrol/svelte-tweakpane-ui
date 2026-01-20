<script lang="ts">
	// Via https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/15
	// eslint-disable-next-line import/no-duplicates
	import { onMount, tick } from 'svelte'
	// eslint-disable-next-line import/no-duplicates
	import { writable } from 'svelte/store'
	import { Slider } from '$lib'

	const bear = writable({ apples: 100, name: 'Someone' })
	const bear2 = writable({ apples: 100, name: 'Someone' })

	onMount(async () => {
		// No tick
		$bear2.apples = 60

		// With Tick
		await tick()
		$bear.apples = 60
	})
</script>

<h1>With tick, works in Svelte 4</h1>

<p>Native input</p>
<input bind:value={$bear.apples} min={0} max={100} step={1} type="range" />
<p>Svelte Tweakpane UI</p>
<Slider bind:value={$bear.apples} min={0} max={100} step={1} />

<h1>Without tick, works in Svelte 5</h1>

<p>Native input</p>
<input bind:value={$bear2.apples} min={0} max={100} step={1} type="range" />
<p>Svelte Tweakpane UI</p>
<Slider bind:value={$bear2.apples} min={0} max={100} step={1} />
