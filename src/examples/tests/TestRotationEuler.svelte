<script lang="ts">
	import { RotationEuler, type RotationEulerValueObject } from '$lib'

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0

	let value: RotationEulerValueObject = { x: 0, y: 0, z: 0 }
</script>

<RotationEuler
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	expanded={true}
	label="CSS Rotation 1"
	picker="inline"
/>
<RotationEuler
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
	expanded={true}
	label="CSS Rotation 2"
	picker="inline"
/>

<pre>Value: <span>{value}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
