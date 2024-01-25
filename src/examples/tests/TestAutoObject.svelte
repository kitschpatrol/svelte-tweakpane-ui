<script lang="ts">
	import { AutoObject } from '$lib';

	let binding1InternalEventCount = 0;
	let binding1ExternalEventCount = 0;
	let binding2InternalEventCount = 0;
	let binding2ExternalEventCount = 0;

	let object = {
		// Creates a <Checkbox>
		someBoolean: true,
		// Creates a <Color> picker
		someColor: {
			r: 255,
			g: 0,

			b: 55
		},
		// Wraps children in a <Folder>
		someFolder: {
			b: 2,
			a: 1,
			c: 3
		},
		// Creates a <Slider>
		someNumber: 1,
		// Creates a <Point>
		somePoint: {
			x: 1,
			y: 2
		},
		// Creates a <Text>
		someString: 'test'
	};
</script>

<AutoObject
	bind:object
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++;
		} else {
			binding1ExternalEventCount++;
		}
	}}
/>
<AutoObject
	bind:object
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++;
		} else {
			binding2ExternalEventCount++;
		}
	}}
/>

<hr />

<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
<pre>Value: <span>{JSON.stringify(object)}</span></pre>
