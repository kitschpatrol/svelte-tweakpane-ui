<script lang="ts">
	import { CubicBezier, type CubicBezierValueObject } from '$lib'

	let value: CubicBezierValueObject = { x1: 0, y1: 0, x2: 0, y2: 0 }

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0
</script>

<CubicBezier
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	label="Binding 1"
/>
<CubicBezier
	bind:value
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

<pre>Value: <span>{JSON.stringify(value, undefined, 2)}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
