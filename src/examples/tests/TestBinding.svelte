<script lang="ts">
	import type { BindingObject } from '$lib';
	import { Binding } from '$lib';

	let binding1InternalEventCount = 0;
	let binding1ExternalEventCount = 0;
	let binding2InternalEventCount = 0;
	let binding2ExternalEventCount = 0;

	let object: BindingObject = { v: 0 };
</script>

<Binding
	bind:object
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++;
		} else {
			binding1ExternalEventCount++;
		}
	}}
	key={'v'}
	label="Binding 1"
/>
<Binding
	bind:object
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++;
		} else {
			binding2ExternalEventCount++;
		}
	}}
	key={'v'}
	label="Binding 2"
/>

<hr />

<pre>Value: <span>{object.v}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>
