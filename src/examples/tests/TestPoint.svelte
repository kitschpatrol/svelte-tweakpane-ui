<script lang="ts">
	import { Point, type PointChangeEvent, type PointValue2d } from '$lib'

	let point2d: PointValue2d = { x: 0, y: 0 }

	let binding1InternalEventCount = 0
	let binding1ExternalEventCount = 0
	let binding2InternalEventCount = 0
	let binding2ExternalEventCount = 0

	function listener(event: PointChangeEvent) {
		console.log(event)
	}
</script>

<Point
	bind:value={point2d}
	on:change={listener}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++
		} else {
			binding1ExternalEventCount++
		}
	}}
	expanded={true}
	label="2D Point Picker 1"
	picker="inline"
	userExpandable={false}
/>
<Point
	bind:value={point2d}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++
		} else {
			binding2ExternalEventCount++
		}
	}}
	expanded={true}
	label="2D Point Picker 2"
	picker="inline"
	userExpandable={false}
/>

<pre>Value: <span>{JSON.stringify(point2d, null, 2)}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
