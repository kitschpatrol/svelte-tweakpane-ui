<script lang="ts">
	import { Button, Monitor, Slider, type SliderChangeEvent } from '$lib'

	let speed = 50

	// Keep track of how many Slider change events originated from direct
	// interaction with the slider (internal) vs. programmatic changes set
	// when the button's clicked (external)
	let internalChangeCount = 0
	let externalChangeCount = 0

	// Change event handler
	// The SliderChangeEvent type is a convenient alias
	// to ValueChangeEvent<number>
	function onChange(event: SliderChangeEvent) {
		// Identify where the event came from, 'internal' or 'external'
		event.detail.origin === 'internal' ? internalChangeCount++ : externalChangeCount++
	}

	// A Svelte reactive statement is (usually) a much better way to respond
	// to value changes! $: console.log(speed);
</script>

<Slider label="Set Speed Limit:" max={100} min={0} bind:value={speed} on:change={onChange} />
<Monitor format={(v) => v.toFixed(0)} label="Internal change events:" value={internalChangeCount} />
<Monitor format={(v) => v.toFixed(0)} label="External change events:" value={externalChangeCount} />
<Button
	label="Change limit externally:"
	title="Limit: 55"
	on:click={() => {
		speed = 55
	}}
/>
