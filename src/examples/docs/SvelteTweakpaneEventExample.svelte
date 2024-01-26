<script lang="ts">
	import { Button, Monitor, Slider, type SliderChangeEvent } from '$lib';

	let speed = 50;

	// Keep track of how many Slider change events originated from direct
	// interaction with the slider (internal) vs. programmatic changes set
	// when the button's clicked (external)
	let internalChangeCount = 0;
	let externalChangeCount = 0;

	// Chang event handler The SliderChangeEvent type is a convenient alias
	// to ValueChangeEvent<number>
	function onChange(event: SliderChangeEvent) {
		// Identify where the event came from, 'internal' or 'external'
		event.detail.origin === 'internal' ? internalChangeCount++ : externalChangeCount++;
	}

	// A Svelte reactive statement is (usually) a much better way to respond
	// to value changes! $: console.log(speed);
</script>

<Slider bind:value={speed} min={0} max={100} on:change={onChange} label="Set Speed Limit:" />
<Monitor value={internalChangeCount} format={(v) => v.toFixed(0)} label="Internal change events:" />
<Monitor value={externalChangeCount} format={(v) => v.toFixed(0)} label="External change events:" />
<Button on:click={() => (speed = 55)} label="Change limit externally:" title="Limit: 55" />
