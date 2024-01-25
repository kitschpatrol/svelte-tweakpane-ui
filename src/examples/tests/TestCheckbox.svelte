<script lang="ts">
	import { Checkbox, type ValueChangeEvent } from '$lib';

	let value: boolean = false;

	let binding1InternalEventCount = 0;
	let binding1ExternalEventCount = 0;
	let binding2InternalEventCount = 0;
	let binding2ExternalEventCount = 0;

	function listener(event: ValueChangeEvent<boolean>) {
		console.log(event);
	}
</script>

<Checkbox
	bind:value
	on:change={listener}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++;
		} else {
			binding1ExternalEventCount++;
		}
	}}
	label="Binding 1"
/>
<Checkbox
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding2InternalEventCount++;
		} else {
			binding2ExternalEventCount++;
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
