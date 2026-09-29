<script lang="ts">
	import { Button, Slider } from '$lib'

	let value = 0.5
	let min = 0
	let label: string | undefined = 'Lifecycle'
	let mounted = true
</script>

{#if mounted}
	<Slider description="A standalone description." {label} max={1} {min} bind:value />
	<Button description="A standalone action." title="Action" />
{/if}

<button
	type="button"
	on:click={() => {
		min = min === 0 ? -1 : 0
	}}>Recreate control</button
>
<button
	type="button"
	on:click={() => {
		label = label === undefined ? 'Lifecycle' : undefined
	}}
>
	Toggle label
</button>
<button
	type="button"
	on:click={() => {
		mounted = !mounted
	}}>Toggle controls</button
>
