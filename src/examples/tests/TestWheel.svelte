<script lang="ts">
	import { Wheel } from '$lib'

	let angle = 45

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
</script>

<Wheel
	bind:value={angle}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
	label="Wheel 1"
	pointerScale={-2.5}
	wide={true}
/>
<Wheel
	bind:value={angle}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
	format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
	label="Wheel 2"
	pointerScale={-2.5}
	wide={true}
/>

<pre>Value: <span>{angle}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
