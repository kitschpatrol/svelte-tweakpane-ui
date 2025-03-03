<script lang="ts">
	import { Slider } from '$lib'

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0

	let value: number = 0
</script>

<Slider
	bind:value
	min={0}
	max={100}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	label="Binding 1"
/>
<Slider
	bind:value
	min={0}
	max={100}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
	label="Binding 2"
/>

<hr />

<pre>Value: <span>{value}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
