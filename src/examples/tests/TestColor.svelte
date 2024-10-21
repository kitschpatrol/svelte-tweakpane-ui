<script lang="ts">
	import { Color, type ColorValueRgbaTuple, type ColorValueRgbObject } from '$lib';

	let value: ColorValueRgbObject = { r: 0, g: 0, b: 0 };
	let value2: ColorValueRgbaTuple = [0, 0, 0, 0];

	let binding1InternalEventCount = 0;
	let binding1ExternalEventCount = 0;
	let binding2InternalEventCount = 0;
	let binding2ExternalEventCount = 0;
	let binding3InternalEventCount = 0;
	let binding3ExternalEventCount = 0;
	let binding4InternalEventCount = 0;
	let binding4ExternalEventCount = 0;
</script>

<Color
	bind:value
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding1InternalEventCount++;
		} else {
			binding1ExternalEventCount++;
		}
	}}
	label="Binding 1"
/>
<Color
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
<Color
	bind:value={value2}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding3InternalEventCount++;
		} else {
			binding3ExternalEventCount++;
		}
	}}
	label="Binding 3"
/>
<Color
	bind:value={value2}
	on:change={(event) => {
		if (event.detail.origin === 'internal') {
			binding4InternalEventCount++;
		} else {
			binding4ExternalEventCount++;
		}
	}}
	label="Binding 4"
/>

<hr />

<pre>Value Object: <span>{JSON.stringify(value, undefined, 2)}</span></pre>
<pre>Binding 1 Internal: <span>{binding1InternalEventCount}</span></pre>
<pre>Binding 1 External: <span>{binding1ExternalEventCount}</span></pre>
<pre>Binding 2 Internal: <span>{binding2InternalEventCount}</span></pre>
<pre>Binding 2 External: <span>{binding2ExternalEventCount}</span></pre>

<pre>Value Tuple: <span>{JSON.stringify(value2, undefined, 2)}</span></pre>
<pre>Binding 3 Internal: <span>{binding3InternalEventCount}</span></pre>
<pre>Binding 3 External: <span>{binding3ExternalEventCount}</span></pre>
<pre>Binding 4 Internal: <span>{binding4InternalEventCount}</span></pre>
<pre>Binding 5 External: <span>{binding4ExternalEventCount}</span></pre>
