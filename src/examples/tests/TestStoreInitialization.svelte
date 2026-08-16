<script lang="ts">
	// Via https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/15

	import { onMount, tick } from 'svelte'
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

<!-- eslint-disable svelte/prefer-destructured-store-props -- Direct store-property binding is behavior under test. -->

<h1>With tick, works in Svelte 4</h1>

<p>Native input</p>
<input max={100} min={0} step={1} type="range" bind:value={$bear.apples} />
<p>Svelte Tweakpane UI</p>
<Slider max={100} min={0} step={1} bind:value={$bear.apples} />

<h1>Without tick, works in Svelte 5</h1>

<p>Native input</p>
<input max={100} min={0} step={1} type="range" bind:value={$bear2.apples} />
<p>Svelte Tweakpane UI</p>
<Slider max={100} min={0} step={1} bind:value={$bear2.apples} />
